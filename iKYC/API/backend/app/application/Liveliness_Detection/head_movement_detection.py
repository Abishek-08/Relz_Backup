import cv2
import mediapipe as mp
import numpy as np
 
mp_face_mesh = mp.solutions.face_mesh
 
face_mesh = mp_face_mesh.FaceMesh(
 
    static_image_mode=False,  # live detection
 
    refine_landmarks=True,
 
    max_num_faces=1,
 
    min_detection_confidence=0.5,
 
    min_tracking_confidence=0.5
 
)
 
def detect_pose_direction(image):
 
    h, w = image.shape[:2]
 
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
 
    results = face_mesh.process(img_rgb)
 
    if not results.multi_face_landmarks:
 
        return "No face"
 
    landmarks = results.multi_face_landmarks[0].landmark
 
    def to_xy(lm):
 
        return np.array([lm.x * w, lm.y * h])
 
    nose = to_xy(landmarks[1])
 
    left_eye = to_xy(landmarks[33])
 
    right_eye = to_xy(landmarks[263])
 
    chin = to_xy(landmarks[152])
 
    forehead = to_xy(landmarks[10])  # top of head
 
    nose_to_left_eye = np.linalg.norm(nose - left_eye)
 
    nose_to_right_eye = np.linalg.norm(nose - right_eye)
 
    # Eye visibility
    left_eye_visibility = landmarks[33].visibility
 
    right_eye_visibility = landmarks[263].visibility
 
    # Default direction
    direction = "unknown"
 
    # Horizontal checks (left/right/front)
    if left_eye_visibility < 0.3 and right_eye_visibility > 0.6:
 
        direction = "left"
 
    elif right_eye_visibility < 0.3 and left_eye_visibility > 0.6:
 
        direction = "right"
 
    elif abs(nose_to_left_eye - nose_to_right_eye) < 20:
 
        direction = "front"
 
    elif nose_to_left_eye > nose_to_right_eye + 30:
 
        direction = "left"
 
    elif nose_to_right_eye > nose_to_left_eye + 30:
 
        direction = "right"
 
    # Vertical checks (up/down)
    vertical_dist = chin[1] - forehead[1]
 
    nose_y = nose[1]
 
    if nose_y < forehead[1] + vertical_dist * 0.35:
 
        direction = "up"
 
    elif nose_y > forehead[1] + vertical_dist * 0.65:
 
        direction = "down"
 
    return direction