import cv2
import mediapipe as mp
import numpy as np
import math
from collections import deque
 
# Initialize MediaPipe Hands solution
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
 
# Landmark indices for convenience
Wrist = 0
Thumb_Tip = 4
Thumb_IP = 3
Thumb_MCP = 2
Index_Tip = 8
Index_PIP = 6
Middle_Tip = 12
Middle_PIP = 10
Ring_Tip = 16
Ring_PIP = 14
Pinky_Tip = 20
Pinky_PIP = 18
Index_MCP = 5
Pinky_MCP = 17
Middle_MCP = 9
Ring_MCP = 13
 
# ✅ GLOBAL STATE (like blink detection)
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7,
)
angle_history = deque(maxlen=30)
 
# Gesture completion tracking
gesture_status = {
    "open_palm": False,
    "peace": False,
    "pointing": False,
    "thumbs_up": False,
    "fist": False,
    "rotation": False,
}
 
 
def lm_to_np(hand_landmarks):
    """Convert mediapipe landmarks to Nx3 numpy array (x,y,z) normalized coords"""
    return np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark], dtype=float)
 
 
def palm_center_and_width(landmarks):
    """Return palm_center (x,y) and palm_width scalar"""
    center = (
        landmarks[Index_MCP][:2] + landmarks[Pinky_MCP][:2] + landmarks[Wrist][:2]
    ) / 3.0
    width = np.linalg.norm(landmarks[Index_MCP][:2] - landmarks[Pinky_MCP][:2])
    width = max(width, 1e-6)
    return center, width
 
 
def is_finger_extended_simple(landmarks, tip_idx, pip_idx, margin=0.03):
    """Simple check if finger is extended based on tip vs pip position"""
    return landmarks[tip_idx][1] < landmarks[pip_idx][1] - margin
 
 
def is_finger_folded_simple(landmarks, tip_idx, pip_idx, margin=0.02):
    """Simple check if finger is folded based on tip vs pip position"""
    return landmarks[tip_idx][1] > landmarks[pip_idx][1] + margin
 
 
def is_thumb_extended(landmarks, handedness):
    """Check if thumb is extended horizontally"""
    tip_x = landmarks[Thumb_Tip][0]
    ip_x = landmarks[Thumb_IP][0]
    mcp_x = landmarks[Thumb_MCP][0]
    margin = 0.025
    if handedness == "Right":
        return tip_x > ip_x + margin and tip_x > mcp_x + margin
    else:
        return tip_x < ip_x - margin and tip_x < mcp_x - margin
 
 
def detect_open_palm(landmarks, handedness):
    """Detect open palm gesture - all fingers extended"""
    try:
        fingers_extended = [
            is_thumb_extended(landmarks, handedness),
            is_finger_extended_simple(landmarks, Index_Tip, Index_PIP),
            is_finger_extended_simple(landmarks, Middle_Tip, Middle_PIP),
            is_finger_extended_simple(landmarks, Ring_Tip, Ring_PIP),
            is_finger_extended_simple(landmarks, Pinky_Tip, Pinky_PIP),
        ]
        return sum(fingers_extended) >= 4
    except Exception:
        return False
 
 
def detect_peace(landmarks, handedness):
    """Detect peace sign - only index and middle finger up"""
    try:
        thumb_up = is_thumb_extended(landmarks, handedness)
        index_up = is_finger_extended_simple(landmarks, Index_Tip, Index_PIP)
        middle_up = is_finger_extended_simple(landmarks, Middle_Tip, Middle_PIP)
        ring_up = is_finger_folded_simple(landmarks, Ring_Tip, Ring_PIP)
        pinky_up = is_finger_folded_simple(landmarks, Pinky_Tip, Pinky_PIP)
        return (not thumb_up and index_up and middle_up and ring_up and pinky_up)
    except Exception:
        return False
 
 
def detect_pointing(landmarks, handedness):
    """Detect pointing gesture - only index finger up"""
    try:
        thumb_up = is_thumb_extended(landmarks, handedness)
        index_up = is_finger_extended_simple(landmarks, Index_Tip, Index_PIP)
        middle_up = is_finger_folded_simple(landmarks, Middle_Tip, Middle_PIP)
        ring_up = is_finger_folded_simple(landmarks, Ring_Tip, Ring_PIP)
        pinky_up = is_finger_folded_simple(landmarks, Pinky_Tip, Pinky_PIP)
        return (not thumb_up and index_up and middle_up and ring_up and pinky_up)
    except Exception:
        return False
 
 
def detect_thumbs_up(landmarks, handedness):
    """Robust thumbs-up detection matching the classic thumbs-up gesture"""
    try:
        thumb_tip_y = landmarks[Thumb_Tip][1]
        thumb_ip_y = landmarks[Thumb_IP][1]
        thumb_mcp_y = landmarks[Thumb_MCP][1]
        thumb_pointing_up = (thumb_tip_y < thumb_ip_y - 0.025 and thumb_tip_y < thumb_mcp_y - 0.035)
        wrist_y = landmarks[Wrist][1]
        thumb_above_wrist = thumb_tip_y < wrist_y - 0.05
        index_folded = landmarks[Index_Tip][1] > landmarks[Index_PIP][1] + 0.02
        middle_folded = landmarks[Middle_Tip][1] > landmarks[Middle_PIP][1] + 0.02
        ring_folded = landmarks[Ring_Tip][1] > landmarks[Ring_PIP][1] + 0.02
        pinky_folded = landmarks[Pinky_Tip][1] > landmarks[Pinky_PIP][1] + 0.02
        fingers_folded_count = sum([index_folded, middle_folded, ring_folded, pinky_folded])
        most_fingers_folded = fingers_folded_count >= 3
        center, palm_w = palm_center_and_width(landmarks)
        thumb_dist = np.linalg.norm(landmarks[Thumb_Tip][:2] - center)
        thumb_separated = (thumb_dist / palm_w) > 0.35
        knuckle_avg_y = (landmarks[Index_MCP][1] + landmarks[Middle_MCP][1] + landmarks[Ring_MCP][1] + landmarks[Pinky_MCP][1]) / 4
        thumb_above_knuckles = thumb_tip_y < knuckle_avg_y - 0.03
        thumb_tip_x = landmarks[Thumb_Tip][0]
        thumb_base_x = landmarks[Thumb_MCP][0]
        thumb_reasonable_position = abs(thumb_tip_x - thumb_base_x) < 0.15
        is_classic_thumbs_up = (thumb_pointing_up and thumb_above_wrist and most_fingers_folded and thumb_separated and thumb_above_knuckles and thumb_reasonable_position)
        return is_classic_thumbs_up
    except Exception:
        return False
 
 
def detect_fist(landmarks, handedness):
    """Detect classic closed fist - all fingers including thumb completely tucked in"""
    try:
        index_folded = landmarks[Index_Tip][1] > landmarks[Index_PIP][1] + 0.015
        middle_folded = landmarks[Middle_Tip][1] > landmarks[Middle_PIP][1] + 0.015
        ring_folded = landmarks[Ring_Tip][1] > landmarks[Ring_PIP][1] + 0.015
        pinky_folded = landmarks[Pinky_Tip][1] > landmarks[Pinky_PIP][1] + 0.015
        fingers_folded = sum([index_folded, middle_folded, ring_folded, pinky_folded])
        thumb_tip_x = landmarks[Thumb_Tip][0]
        thumb_tip_y = landmarks[Thumb_Tip][1]
        thumb_ip_y = landmarks[Thumb_IP][1]
        thumb_mcp_x = landmarks[Thumb_MCP][0]
        if handedness == "Right":
            thumb_not_extended = thumb_tip_x <= thumb_mcp_x + 0.03
        else:
            thumb_not_extended = thumb_tip_x >= thumb_mcp_x - 0.03
        thumb_not_up = thumb_tip_y >= thumb_ip_y - 0.02
        thumb_tucked = thumb_not_extended and thumb_not_up
        center, palm_w = palm_center_and_width(landmarks)
        fingertips_close_count = 0
        max_allowed_distance = palm_w * 0.6
        for tip_idx in [Index_Tip, Middle_Tip, Ring_Tip, Pinky_Tip]:
            dist = np.linalg.norm(landmarks[tip_idx][:2] - center)
            if dist < max_allowed_distance:
                fingertips_close_count += 1
        thumb_dist = np.linalg.norm(landmarks[Thumb_Tip][:2] - center)
        thumb_close_to_palm = thumb_dist < max_allowed_distance
        knuckle_avg_y = (landmarks[Index_MCP][1] + landmarks[Middle_MCP][1] + landmarks[Ring_MCP][1] + landmarks[Pinky_MCP][1]) / 4
        tips_below_knuckles = 0
        for tip_idx in [Index_Tip, Middle_Tip, Ring_Tip, Pinky_Tip]:
            if landmarks[tip_idx][1] >= knuckle_avg_y - 0.02:
                tips_below_knuckles += 1
        is_proper_fist = (fingers_folded >= 4 and thumb_tucked and fingertips_close_count >= 3 and thumb_close_to_palm and tips_below_knuckles >= 3)
        return is_proper_fist
    except Exception:
        return False
 
 
def detect_rotation(landmarks, handedness):
    """Detect hand rotation using angle history"""
    global angle_history
    try:
        p1 = landmarks[Index_MCP][:2]
        p2 = landmarks[Pinky_MCP][:2]
        dx, dy = p2 - p1
        current_angle = math.degrees(math.atan2(dy, dx))
        angle_history.append(current_angle)
        if len(angle_history) < 15:
            return False
        angles = np.array(list(angle_history))
        recent_angles = angles[-15:]
        valid_angles = recent_angles[~np.isnan(recent_angles)]
        if len(valid_angles) < 10:
            return False
        angle_range = np.max(valid_angles) - np.min(valid_angles)
        normalized_angles = (valid_angles + 360) % 360
        normalized_range = np.max(normalized_angles) - np.min(normalized_angles)
        min_rotation = 50
        return angle_range > min_rotation or normalized_range > min_rotation
    except Exception:
        return False
 
 
def detect_hand_gestures(frame):
    """
    Main detection function - works like detect_blink() and detect_pose_direction()
    Process frame and return current gesture states.
    """
    global hands, angle_history, gesture_status
    
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    
    # Current frame detections (LIVE - changes every frame)
    current_gestures = {
        "open_palm": False,
        "peace": False,
        "pointing": False,
        "thumbs_up": False,
        "fist": False,
        "rotation": False,
    }
    
    hand_detected = False
    handedness_label = "Unknown"
    
    if results.multi_hand_landmarks and results.multi_handedness:
        hand_detected = True
        landmarks = lm_to_np(results.multi_hand_landmarks[0])
        handedness_label = results.multi_handedness[0].classification[0].label
        
        # Detect all gestures in current frame (LIVE DETECTION)
        current_gestures["open_palm"] = detect_open_palm(landmarks, handedness_label)
        current_gestures["peace"] = detect_peace(landmarks, handedness_label)
        current_gestures["pointing"] = detect_pointing(landmarks, handedness_label)
        current_gestures["thumbs_up"] = detect_thumbs_up(landmarks, handedness_label)
        current_gestures["fist"] = detect_fist(landmarks, handedness_label)
        current_gestures["rotation"] = detect_rotation(landmarks, handedness_label)
        
        # Update persistent status - once detected, stays true
        for gesture_name, detected in current_gestures.items():
            if detected:
                gesture_status[gesture_name] = True
    else:
        # No hand detected - clear rotation history
        angle_history.clear()
    
    # Check if all gestures completed
    all_completed = all(gesture_status.values())
    
    # Return LIVE data that changes every frame
    return {
        "hand_detected": hand_detected,
        "handedness": handedness_label,
        "live_gestures": current_gestures,  # Live detection - changes every frame
        "completed_gestures": gesture_status.copy(),  # Persistent status
        "all_gestures_completed": all_completed,
    }
 
 
def reset_hand_gestures():
    """Reset all gesture status - like reset_status() for blinks"""
    global gesture_status, angle_history
    gesture_status = {
        "open_palm": False,
        "peace": False,
        "pointing": False,
        "thumbs_up": False,
        "fist": False,
        "rotation": False,
    }
    angle_history.clear()
    print("Hand gesture status reset.")
 