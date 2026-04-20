from fastapi import FastAPI, UploadFile, File
import onnxruntime as ort
import numpy as np
import cv2
from matcher import FaceMatcher
 
app = FastAPI()
session = ort.InferenceSession("face_model.onnx")
matcher = FaceMatcher(known_embeddings=np.load("known_embeddings.npy"), identities=np.load("identity_labels.npy"))
 
def preprocess(img_bytes):
    img_np = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    face = cv2.resize(img_np, (112, 112)) / 255.0
    face = np.transpose(face, (2, 0, 1))[None, :].astype(np.float32)
    return face
 
@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    img_bytes = await file.read()
    face_tensor = preprocess(img_bytes)
    embedding = session.run(None, {"input": face_tensor})[0]
    identity, distance = matcher.match(embedding)
    return {"identity": identity, "distance": float(distance)}

