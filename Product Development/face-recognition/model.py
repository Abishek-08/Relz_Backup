import torch.nn as nn
import torchvision.models as models
import torch.nn.functional as F
 
class ArcFaceModel(nn.Module):
    def __init__(self, embedding_size=128):
        super().__init__()
        self.backbone = models.resnet18(pretrained=True)
        self.backbone.fc = nn.Identity()
        self.embedding = nn.Linear(512, embedding_size)
 
    def forward(self, x):
        x = self.backbone(x)
        x = self.embedding(x)
        return F.normalize(x)