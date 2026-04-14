from ultralytics import YOLO
from PIL import UnidentifiedImageError, Image
 
# Load YOLO model safely
try:
    model = YOLO("assets/back.pt")
except Exception as e:
    raise RuntimeError(f"Failed to load YOLO model: {e}")
 
# Supported document types and expected classes
EXPECTED_CLASSES = {"Pancard_checker", "dob", "father", "name", "pan_num", "qr_code"}
DOCUMENT_BACK_CLASSES = {doc_type: EXPECTED_CLASSES for doc_type in ["UMID", "Voter_ID", "Passport", "Tax", "Health"]}
SUPPORTED_DOC_TYPES = set(DOCUMENT_BACK_CLASSES.keys())
 
def _normalize(label: str) -> str:
    """Normalize labels for comparison."""
    return label.replace(" ", "").replace("_", "").lower()
 
def validate_back_document(image: Image.Image, selected_doc_type: str):
    """Validate back document based on minimum class detection (at least 4 out of 6)."""
    try:
        if selected_doc_type not in SUPPORTED_DOC_TYPES:
            return {"is_valid": False, "message": f"Unsupported document type: {selected_doc_type}"}
 
        results = model(image)
        names = getattr(results[0], "names", None) or getattr(model, "names", {})
        detected_classes = []
 
        if results and len(results) > 0 and getattr(results[0], "boxes", None) is not None:
            boxes = results[0].boxes
            if getattr(boxes, "cls", None) is not None:
                class_ids = [int(c) for c in boxes.cls.tolist()]
                for i in class_ids:
                    if isinstance(names, dict) and i in names:
                        detected_classes.append(names[i])
                    elif isinstance(names, (list, tuple)) and 0 <= i < len(names):
                        detected_classes.append(names[i])
 
        # Normalize and compare
        expected = {_normalize(c) for c in DOCUMENT_BACK_CLASSES[selected_doc_type]}
        detected = {_normalize(c) for c in detected_classes}
        matched_count = len(expected.intersection(detected))
 
        is_valid = matched_count >= 4  # require at least 4 matches due to pancard.pt detecting some classes in other cards made this validation.
        return {
            "is_valid": True,
            "message": f"{selected_doc_type} is valid." if is_valid else f"{selected_doc_type} is invalid."
        }
 
    except UnidentifiedImageError:
        return {"is_valid": False, "message": "Invalid image format."}
    except Exception as e:
        return {"is_valid": False, "message": f"Error during detection: {e}"}
 