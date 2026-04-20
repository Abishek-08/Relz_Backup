import cv2
import numpy as np
import torch
from PIL import Image
from torchvision import transforms
from model import ArcFaceModel
from matcher import FaceMatcher
 
# Load model
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
model = ArcFaceModel()
model.load_state_dict(torch.load("face_model.pth", map_location=DEVICE))
model.eval().to(DEVICE)
 
# Load matcher
known_embeddings = np.load("known_embeddings.npy")
identity_labels = np.load("identity_labels.npy")
matcher = FaceMatcher(known_embeddings, identity_labels)
 
# Image preprocess
transform = transforms.Compose([
    transforms.Resize((112, 112)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])
 
# Capture from webcam or load image
use_webcam = True
 
if use_webcam:
    cap = cv2.VideoCapture(0)
    print("Press 's' to capture frame and recognize.")
    while True:
        ret, frame = cap.read()
        cv2.imshow("Webcam - Press 's' to scan", frame)
        if cv2.waitKey(1) & 0xFF == ord('s'):
            img = frame
            break
    cap.release()
    cv2.destroyAllWindows()
else:
    img = cv2.imread("test.jpg")
 
# Convert to PIL and preprocess
pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)).convert("RGB")
input_tensor = transform(pil_img).unsqueeze(0).to(DEVICE)
 
# Get embedding
with torch.no_grad():
    embedding = model(input_tensor).cpu().numpy()
 
# Match identity
identity, distance = matcher.match(embedding)
if distance < 1.0:
    print(f"Matched ----> Predicted: {identity} (Distance: {distance:.4f})")
else:
    print(f"Unknow -----> (Distance: {distance:.4f})")
 