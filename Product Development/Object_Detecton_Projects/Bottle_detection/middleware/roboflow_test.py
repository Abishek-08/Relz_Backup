import os
import cv2
from ultralytics import YOLO
 
def generate_frames():
    video_path = './vid2.mp4'
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        return
 
    print(f"Opening video: {video_path}")
    os.makedirs('output', exist_ok=True)
 
    model = YOLO('bestC.pt')
    cap = cv2.VideoCapture(video_path)
 
    if not cap.isOpened():
        print("Error: Could not open video.")
        return
 
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = 640
    frame_height = 480
    print("FPS:", fps, "Width:", frame_width, "Height:", frame_height)
 
    out = cv2.VideoWriter('output/output_video.mp4', fourcc, fps, (frame_width, frame_height))
 
    cement_count = set()
    last_positions = {}
    LINE_Y = 277
 
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break
 
        # Resize to match output dimensions (optional)
        frame = cv2.resize(frame, (frame_width, frame_height))
 
        results = model.track(frame, persist=True, tracker="botsort.yaml")[0]
 
        if results.boxes is not None:
            for box in results.boxes:
                if box.id is None:
                    continue
                track_id = int(box.id.item())
                cords = box.xyxy[0].tolist()
                cords = [round(x) for x in cords]
                x_centre = (cords[0] + cords[2]) // 2
                y_centre = (cords[1] + cords[3]) // 2
 
                if y_centre > LINE_Y:
                    cement_count.add(track_id)
 
                last_positions[track_id] = y_centre
 
                cv2.rectangle(frame, (cords[0], cords[1]), (cords[2], cords[3]), (25, 15, 220), 2)
                cv2.rectangle(frame, (cords[0], cords[1] - 25), (cords[0] + 80, cords[1] - 5), (255, 0, 0), -1)
                cv2.putText(frame, f'ID: {track_id}', (cords[0], cords[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                cv2.circle(frame, (x_centre, y_centre), 3, (0, 255, 255), -1)
 
        cv2.line(frame, (180, LINE_Y), (305, LINE_Y), (255, 255, 0), 5)
        cv2.putText(frame, f'Count: {len(cement_count)}', (20, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
 
        out.write(frame)
        cv2.imshow("Live", frame)
 
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
 
    cap.release()
    out.release()
    cv2.destroyAllWindows()
 
generate_frames()
 