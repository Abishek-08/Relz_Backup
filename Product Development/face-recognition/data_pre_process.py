from facenet_pytorch import MTCNN
from PIL import Image
from torchvision import transforms
import os
 
mtcnn = MTCNN(image_size=112, margin=14)
 
INPUT_DIR = "dataset"
OUTPUT_DIR = "aligned_dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)
 
for person in os.listdir(INPUT_DIR):
    input_person_dir = os.path.join(INPUT_DIR, person)
    output_person_dir = os.path.join(OUTPUT_DIR, person)
    os.makedirs(output_person_dir, exist_ok=True)
 
    for img_file in os.listdir(input_person_dir):
        img_path = os.path.join(input_person_dir, img_file)
        img = Image.open(img_path)
        face = mtcnn(img)
        
        if face is not None:
            face_img = transforms.ToPILImage()(face)
            face_img.save(os.path.join(output_person_dir, img_file))