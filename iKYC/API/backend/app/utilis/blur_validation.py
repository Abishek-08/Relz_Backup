import cv2
import numpy as np


# --- Blur detection from bytes ---
def is_blurry(image_bytes: bytes, threshold: int = 120) -> bool:
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return True
        laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
        
        return laplacian_var < threshold
    except Exception as e:
       
        return True