import cv2
import numpy as np
from ultralytics import YOLO
 
# Load YOLO model once
try:
    model = YOLO("assets/Philippine idcard v2.pt")
  
except Exception as e:
    raise RuntimeError(f"Failed to load YOLO model: {e}")
 
# Document validation classes
DOCUMENT_CLASSES = {
    "UMID": {"Republic_ID", "umid"},
    "Voter_ID": {
        "election_barcode_layout1",
        "election_barcode_layout2",
        "election_commision_logo",
    },
    "Passport": {"passport_photo_placeholder", "Passport_flag", "Passport_id"},
    "Tax": set(),
    "Health": set(),
}
 

 
 
# --- Document validation from bytes ---
def validate_document(image_bytes: bytes, expected_classes: set, selected_doc_type: str) -> dict:
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
 
    if img is None:
        return {"status": "error", "reason": "Unable to decode image."}
 
    results = model(img)
    names = model.names
    detected_classes = [names[int(box.cls)] for box in results[0].boxes]
    detected_set = set(detected_classes)
 
    # Must contain at least one expected feature
    if not detected_set & expected_classes:
        return {
            "status": "invalid",
            "reason": f"Expected features for {selected_doc_type} not found.",
            # "expected": list(expected_classes),
            # "detected": list(detected_set),
        }
 
    # Cross-document contamination check
    for doc_type, class_set in DOCUMENT_CLASSES.items():
        if doc_type != selected_doc_type and detected_set & class_set:
            return {
                "status": "invalid",
                "reason": f"Detected features from another document type: {doc_type}",
               
            }
 
    # Valid document
    return {
        "status": "valid",
        "document_type": selected_doc_type,
       
    }
 