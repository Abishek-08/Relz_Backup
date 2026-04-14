# import base64
# import cv2
# import numpy as np
# from PIL import Image
# import insightface
# from insightface.app import FaceAnalysis
# import os

# # Force CPU only if needed (remove this line to use GPU if available)
# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"


# def base64_to_cv2(base64_str: str):
#     img_data = base64.b64decode(base64_str)
#     img_array = np.frombuffer(img_data, np.uint8)
#     img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
#     return img


# # Initialize InsightFace ArcFace model
# app = FaceAnalysis(
#     providers=["CPUExecutionProvider"]  # change to ["CUDAExecutionProvider"] if GPU is available
# )
# app.prepare(ctx_id=0, det_size=(640, 640))  # detection size for better accuracy


# def get_embedding(img):
#     faces = app.get(img)
#     if len(faces) == 0:
#         return None
#     return faces[0].normed_embedding  # take first detected face


# def cosine_similarity(a, b):
#     return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# def verify_face(document_face, live_face, threshold=0.55):
#     """
#     threshold: similarity cutoff for face matching.
#     Default = 0.55 (55%)
#     """
#     try:
#         doc_img = base64_to_cv2(document_face)
#         live_img = base64_to_cv2(live_face)

#         doc_emb = get_embedding(doc_img)
#         live_emb = get_embedding(live_img)

#         if doc_emb is None or live_emb is None:
#             return {"status": "error", "message": "No face detected in one of the images"}

#         sim = cosine_similarity(doc_emb, live_emb)

#         if sim >= threshold:  # match if similarity >= 55%
#             return {
#                 "status": "matched",
#                 "similarity": f"{sim:.4f}",
#                 "confidence": f"{sim*100:.2f}%"
#             }
#         else:
#             return {
#                 "status": "not-matched",
#                 "similarity": f"{sim:.4f}",
#                 "confidence": f"{sim*100:.2f}%"
#             }

#     except Exception as e:
#         return {"status": "error", "message": str(e)}
 