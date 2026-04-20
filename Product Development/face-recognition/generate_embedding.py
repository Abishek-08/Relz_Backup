import os
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
from model import ArcFaceModel
from data_loader import FaceDataset
 
# Config
DATA_DIR = "aligned_dataset"
MODEL_PATH = "face_model.pth"
EMBEDDING_SIZE = 128
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
 
# Load model
model = ArcFaceModel(embedding_size=EMBEDDING_SIZE).to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()
 
# Preprocessing
transform = transforms.Compose([
    transforms.Resize((112, 112)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])
 
# Dataset
dataset = FaceDataset(DATA_DIR, transform=transform)
 
# Embedding collection
embeddings = []
labels = []
 
with torch.no_grad():
    for img, label in dataset:
        img = img.unsqueeze(0).to(DEVICE)
        emb = model(img).cpu().numpy()
        embeddings.append(emb[0])
        labels.append(dataset.get_identity_name(label))
 
# Save to .npy
embeddings = np.array(embeddings)
labels = np.array(labels)
 
np.save("known_embeddings.npy", embeddings)
np.save("identity_labels.npy", labels)
 
print("✅ Embeddings and labels saved.")
 