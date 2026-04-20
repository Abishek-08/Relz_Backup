import torch
from model import ArcFaceModel
 
model = ArcFaceModel()
model.load_state_dict(torch.load("face_model.pth"))
model.eval()
 
dummy_input = torch.randn(1, 3, 112, 112)
torch.onnx.export(model, dummy_input, "face_model.onnx", input_names=['input'], output_names=['output'], opset_version=11)