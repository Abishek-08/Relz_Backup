import os
from torch.utils.data import Dataset
from PIL import Image
 
class FaceDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        """
        Args:
            root_dir (str): Path to the dataset (e.g. 'aligned_dataset')
            transform (callable, optional): Optional transform to be applied on a sample.
        """
        self.root_dir = root_dir
        self.transform = transform
        self.samples = []
        self.class_to_idx = {}
        self.idx_to_class = []
 
        # Assign numeric label to each person (folder)
        for idx, class_name in enumerate(sorted(os.listdir(root_dir))):
            class_path = os.path.join(root_dir, class_name)
            if not os.path.isdir(class_path):
                continue
 
            self.class_to_idx[class_name] = idx
            self.idx_to_class.append(class_name)
 
            for img_name in os.listdir(class_path):
                img_path = os.path.join(class_path, img_name)
                self.samples.append((img_path, idx))
 
    def __len__(self):
        return len(self.samples)
 
    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label
 
    def get_identity_name(self, label):
        """Returns the person's name given a numeric label."""
        return self.idx_to_class[label]
 