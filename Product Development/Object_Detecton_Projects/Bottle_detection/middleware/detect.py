import cv2
from ultralytics import YOLO
import subprocess


def generate_frames():

    model = YOLO('bestV.pt')  
    cap = cv2.VideoCapture('./bottle.mp4')

    if not cap.isOpened():
       print("Error: Could not open video.")
       exit()

    while True:
        ret, frame = cap.read()

        # If no frame is found, break the loop
        if not ret:
            print("Failed to capture frame")
            break

        # Resize the frame to the desired resolution
        frame = cv2.resize(frame, (640, 480))

        # Run YOLO object detection
        results = model.predict(frame)[0]

        # Iterate over the detected boxes
        for box in results.boxes:
            class_id = results.names[box.cls[0].item()]
            cords = box.xyxy[0].tolist()
            cords = [round(x) for x in cords]
            conf = round(box.conf[0].item(), 2)

            # Draw rectangle and label
            cv2.rectangle(frame, (cords[0], cords[1]), (cords[2], cords[3]), (25, 15, 220), 2)
            cv2.rectangle(frame, (cords[0], cords[1] - 25), (cords[0] + 120, cords[1] - 5), (255, 0, 0), -1)
            cv2.putText(frame, f'{class_id} {conf}', (cords[0], cords[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        ret, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')




cv2.destroyAllWindows()
