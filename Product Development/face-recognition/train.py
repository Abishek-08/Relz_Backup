import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms
 
from model import ArcFaceModel
from loss import ArcFaceLoss
from data_loader import FaceDataset
 
# Configuration
DATA_DIR = "./aligned_dataset"
BATCH_SIZE = 32
EPOCHS = 250
EMBEDDING_SIZE = 128
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_PATH = "face_model.pth"
 
# Data transforms
transform = transforms.Compose([
    transforms.Resize((112, 112)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])
 
# Dataset and loader
dataset = FaceDataset(DATA_DIR, transform=transform)
data_loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)
 
# Model, loss, optimizer
model = ArcFaceModel(embedding_size=EMBEDDING_SIZE).to(DEVICE)
loss_fn = ArcFaceLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
 
print(f"Starting training on {DEVICE}... Total identities: {len(dataset.idx_to_class)}")
 
# Training loop
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
 
    for images, labels in data_loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        
        # Forward pass
        embeddings = model(images)
 
        # Get classification weights (embedding layer weight as class centers)
        num_classes = len(dataset.idx_to_class)
        # weights = nn.functional.normalize(model.embedding.weight, dim=1)
        class_weight = nn.Parameter(torch.randn(num_classes, EMBEDDING_SIZE)).to(DEVICE)
        
        # Loss
        loss = loss_fn(embeddings, labels, class_weight)
 
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
 
        total_loss += loss.item()
 
    avg_loss = total_loss / len(data_loader)
    print(f"Epoch [{epoch+1}/{EPOCHS}] Loss: {avg_loss:.4f}")
 
# Save model
torch.save(model.state_dict(), MODEL_PATH)
print(f"✅ Training complete. Model saved to {MODEL_PATH}")
 