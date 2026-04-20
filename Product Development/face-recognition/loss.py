import torch
import torch.nn as nn
import torch.nn.functional as F
 
class ArcFaceLoss(nn.Module):
    def __init__(self, s=30.0, m=0.5):
        super().__init__()
        self.s = s
        self.m = m
 
    def forward(self, embeddings, labels, weights):
        cos_theta = F.linear(F.normalize(embeddings), F.normalize(weights))
        theta_m = torch.acos(cos_theta.clamp(-1.0 + 1e-7, 1.0 - 1e-7)) + self.m
        output = torch.cos(theta_m) * self.s
        return F.cross_entropy(output, labels)