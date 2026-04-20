####### corrected code that runs 3 video
import cv2
from ultralytics import YOLO

# Define color mapping for PPE categories
COLORS = {
    "person": (0, 255, 0),  # Green
    "helmet": (255, 0, 0),  # Blue
    "glove": (0, 255, 255),  # Yellow
    "vest": (255, 165, 0),  # Orange
    "boot": (128, 0, 128)  # Purple
}

class PPEModel:
    def __init__(self, model_path: str):
        self.model = YOLO(model_path)  # Load trained YOLOv8 model

    def predict(self, frame):
        # Run inference with adjusted parameters
        results = self.model(frame)

        detections = []
        for result in results:
            for box in result.boxes.data:  # YOLOv8 outputs bounding boxes
                x1, y1, x2, y2, conf, class_id = box.tolist()
                class_id = int(class_id)
                conf = round(conf, 2)  # Round confidence score

                # Ensure class_id is within range
                if class_id < len(self.model.names):
                    label = self.model.names[class_id].lower()  # Convert to lowercase for color mapping
                else:
                    label = "unknown"

                # Store detection details
                detections.append({
                    "label": label,
                    "confidence": conf,
                    "x": int(x1),
                    "y": int(y1),
                    "width": int(x2 - x1),
                    "height": int(y2 - y1),
                    "color": COLORS.get(label, (0, 0, 255))  # Default to red if unknown
                })

        return detections  # Return structured detection results


# Initialize model with correct path
ppe_model = PPEModel("assets/PPE_Detection/PPE_Detect_best3.pt")
