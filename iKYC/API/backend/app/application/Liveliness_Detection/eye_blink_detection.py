import cv2
import mediapipe as mp
import numpy as np
import time
 
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True
)
 
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
 
EAR_THRESHOLD = 0.25
CONSEC_FRAMES = 2
 
# Persistent state
frame_counter = 0
blink_stage = 0
blink_start_time = None
 
overall_blink_status = False
first_attempt_status = False
second_attempt_status = False
 
 
def calculate_ear(eye_landmarks):
    A = np.linalg.norm(eye_landmarks[1] - eye_landmarks[5])
    B = np.linalg.norm(eye_landmarks[2] - eye_landmarks[4])
    C = np.linalg.norm(eye_landmarks[0] - eye_landmarks[3])
    return (A + B) / (2.0 * C)
 
 
def reset_status():
    global blink_stage, overall_blink_status, first_attempt_status, second_attempt_status
    blink_stage = 0
    overall_blink_status = False
    first_attempt_status = False
    second_attempt_status = False
 
 
def detect_blink(frame):
    """
    Process frame for blink detection and return JSON-safe dict.
    Auto-resets once both blinks are completed.
    """
    global frame_counter, blink_stage, blink_start_time
    global overall_blink_status, first_attempt_status, second_attempt_status
 
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)
    h, w, _ = frame.shape
 
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            landmarks = [(int(lm.x * w), int(lm.y * h)) for lm in face_landmarks.landmark]
            left_eye = np.array([landmarks[i] for i in LEFT_EYE])
            right_eye = np.array([landmarks[i] for i in RIGHT_EYE])
 
            left_ear = calculate_ear(left_eye)
            right_ear = calculate_ear(right_eye)
            ear = (left_ear + right_ear) / 2.0
 
            if ear < EAR_THRESHOLD:
                frame_counter += 1
            else:
                if frame_counter >= CONSEC_FRAMES:
                    if blink_stage == 0:
                        first_attempt_status = True
                        blink_stage = 1
                        blink_start_time = time.time()
                    elif blink_stage == 1 and time.time() - blink_start_time > 1.5:
                        second_attempt_status = True
                        overall_blink_status = True
                        blink_stage = 2
                        blink_start_time = time.time()
                    frame_counter = 0
 
    # ✅ Reset after 3 seconds of completion
    # if blink_stage == 2 and time.time() - blink_start_time > 3:
    #     reset_status()
 
    return {
        "overall_blink_detected": overall_blink_status,
        "first_attempt": first_attempt_status,
        "second_attempt": second_attempt_status,
    }
 