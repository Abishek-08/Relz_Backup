import base64
import cv2
import numpy as np
from PIL import Image
from deepface import DeepFace
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
 
def base64_to_cv2(base64_str: str):
    img_data = base64.b64decode(base64_str)
    img_array = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img
 
def verify_face(document_face, live_face):
    try:
        doc_img = base64_to_cv2(document_face)
        live_img = base64_to_cv2(live_face)
 
        result = DeepFace.verify(
            doc_img,
            live_img,
            model_name="VGG-Face",   
            detector_backend="opencv",
            enforce_detection=False,
        )
 
        confidence = result.get("distance", 1)  # Lower distance = more similarity
        verified = result.get("verified", False)
 
        if verified:
            return {
                "status":"matched",
                "distance": f'{confidence:.4f}',
                "confidence": f'{100*(1-confidence):.2f}%'
            }
                 
        else:
            return {
                "status":"not-matched",
                "distance": f'{confidence:.4f}',
                "confidence": f'{100*(1-confidence):.2f}%'
            }
 
    except Exception as e:
        return "Face Verification Error", f"Error: {e}"