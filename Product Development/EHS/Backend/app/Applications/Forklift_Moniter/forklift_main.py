import base64
import json
from collections import defaultdict
import cv2
import numpy as np
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import time
from app.constants.string_constants import FORKLIFT_CLASS_NAMES as CLASS_NAMES
from app.utilis.forklift_moniter_utils import get_next_sequence_value,line_intersects_rect
from app.config import forklift_violations_collection as violations_collection
from app.config import forklift_counters_collection as counters_collection



# Ensure counter documents exist
for counter_id in ["forklift_tracking_id", "person_tracking_id"]:
    if not counters_collection.find_one({"_id": counter_id}):
        counters_collection.insert_one({"_id": counter_id, "sequence_value": 0})

# Load the YOLO model trained for forklifts and persons
model = YOLO("assets/Forklift_Moniter/forkliftv3.pt")

# Open the video file
video_path = "assets/Forklift_Moniter/Forklift.mp4"


# Store track history separately for forklifts and persons
forklift_track_history = defaultdict(list)
person_track_history = defaultdict(list)


# Store detected events
recorded_forklift_ids = set()  # To prevent duplicate violation storage

latest_counts = {"forklifts": 0, "persons": 0}

# Define lines
left_line = [(253, 0), (128, 524)]
right_line = [(434, 1), (406, 548)]
line_color = (0, 255, 255)  # Yellow by default

async def process_frame():
    global latest_counts
    cap = cv2.VideoCapture(video_path)
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.resize(frame, (800, 600))

        forklifts = []
        persons = []
        global timestamp

        line_color = (0, 255, 255)  # Reset line color to Yellow

        # Run YOLO tracking
        results = model.track(frame, persist=True, tracker="bytetrack.yaml")

        if results and results[0].boxes is not None and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            class_ids = results[0].boxes.cls.int().cpu().tolist()
            confidences = results[0].boxes.conf.cpu().tolist()

            for box, track_id, class_id, conf in zip(boxes, track_ids, class_ids, confidences):
                if conf < 0.5:
                    continue  # Ignore low-confidence detections

                x1, y1, x2, y2 = map(int, box)
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                class_name = CLASS_NAMES[class_id]


                if class_name == "forklift":
                    if track_id not in forklift_track_history:
                        forklift_tracking_id = await get_next_sequence_value("forklift_tracking_id")  # Unique ID
                        forklift_track_history[track_id] = forklift_tracking_id
                    else:
                        forklift_tracking_id = forklift_track_history[track_id]

                    forklifts.append((forklift_tracking_id, x1, y1, x2, y2, cx, cy))
                    color = (0, 255, 0)  # Green for forklifts

                elif class_name == "person":
                    if track_id not in person_track_history:
                        person_tracking_id = await get_next_sequence_value("person_tracking_id")  # Unique ID
                        person_track_history[track_id] = person_tracking_id
                    else:
                        person_tracking_id = person_track_history[track_id]

                    persons.append((person_tracking_id, x1, y1, x2, y2,cx,cy))
                    color = (255, 0, 0)  # Blue for persons
                else:
                    continue

                # Draw bounding box and tracking ID
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame,
                            f"{class_name} ID:{forklift_tracking_id if class_name == 'forklift' else person_tracking_id}",
                            (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                # # Draw tracking lines
                # if len(forklifts) > 1 or len(persons) > 1:
                #     points = np.array(forklifts if class_name == "forklift" else persons, dtype=np.int32).reshape((-1, 1, 2))
                #     cv2.polylines(frame, [points], isClosed=False, color=color, thickness=2)


                # Check for forklift crossing
                if class_name == "forklift":
                    if  await line_intersects_rect(left_line, x1, y1, x2, y2) or await line_intersects_rect(right_line, x1, y1, x2, y2):
                        if forklift_tracking_id not in recorded_forklift_ids:
                            recorded_forklift_ids.add(forklift_tracking_id)  # Prevent duplicates
                            timestamp = time.strftime("%d-%m-%Y %H:%M:%S")
                            _, image_encoded = cv2.imencode('.jpg', frame)
                            image = base64.b64encode(image_encoded).decode('utf-8')

                            violation_entry = {
                                "_id": forklift_tracking_id,  # Use the unique tracking ID
                                "timestamp": timestamp,
                                "image": image
                            }
                            violations_collection.insert_one(violation_entry)
                            line_color = (0, 0, 255)  # Change line color to Red

        # Draw lines
        cv2.line(frame, left_line[0], left_line[1], line_color, 2)
        cv2.line(frame, right_line[0], right_line[1], line_color, 2)

        # Display the counts in the top-right corner
        info_text = [
            f"Timestamp:{timestamp}",
            f"Forklifts: {len(forklifts)}",
            f"Persons: {len(persons)}",
        ]

        y_offset = 20
        for text in info_text:
            cv2.putText(frame, text, (600, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            y_offset += 25

        #cv2.imshow("Forklift & Person Tracking", frame)
        # 1366 x 768
        frame= cv2.resize(frame,(1366,768))
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()


        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

        # Update global count
        latest_counts["forklifts"] = len(set(forklifts))
        latest_counts["persons"] = len(set(persons))


        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
            )

    cap.release()
    cv2.destroyAllWindows()