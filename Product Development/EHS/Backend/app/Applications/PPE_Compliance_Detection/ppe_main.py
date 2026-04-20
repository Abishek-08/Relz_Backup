# # app/services/detection_service.py

# import cv2
# import math
# from collections import OrderedDict
# from app.Applications.PPE_Compliance_Detection.ppe_model import ppe_model

# # Optional: move to app/utils/tracking.py if reused
# class CentroidTracker:
#     def __init__(self, max_distance=50):
#         self.next_person_id = 1
#         self.tracked_persons = OrderedDict()
#         self.max_distance = max_distance

#     def update(self, detections):
#         current_centroids = []
#         unmatched_centroids = []

#         for detection in detections:
#             if detection["label"].lower() == "person":
#                 x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
#                 centroid = ((x + w) // 2, (y + h) // 2)
#                 current_centroids.append((centroid, detection))

#         updated_persons = OrderedDict()
#         for centroid, detection in current_centroids:
#             matched_person_id = None
#             for person_id, tracked_centroid in self.tracked_persons.items():
#                 distance = math.sqrt((centroid[0] - tracked_centroid[0]) ** 2 +
#                                      (centroid[1] - tracked_centroid[1]) ** 2)
#                 if distance < self.max_distance:
#                     matched_person_id = person_id
#                     break

#             if matched_person_id is not None:
#                 updated_persons[matched_person_id] = centroid
#                 detection["person_id"] = matched_person_id
#             else:
#                 unmatched_centroids.append(centroid)
#                 updated_persons[self.next_person_id] = centroid
#                 detection["person_id"] = self.next_person_id
#                 self.next_person_id += 1

#         self.tracked_persons = updated_persons
#         return unmatched_centroids

# tracker = CentroidTracker()

# def process_video_stream(video_path):
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         raise IOError("Unable to open video.")

#     def frame_generator():
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             detections = ppe_model.predict(frame)
#             tracker.update(detections)

#             total_person_count = len([d for d in detections if d["label"].lower() == "person"])
#             for detection in detections:
#                 x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
#                 label, conf, color = detection["label"], detection["confidence"], detection["color"]
#                 label_text = f"{label} ({conf:.2f})"

#                 required_ppe = {"helmet", "gloves", "vest"}
#                 detected_ppe = {d["label"].lower() for d in detections if d["label"].lower() in required_ppe}
#                 missing_ppe = required_ppe - detected_ppe
#                 missing_text = ", ".join(f"Missing {item.capitalize()}" for item in missing_ppe)
#                 if missing_text:
#                     label_text += f" | {missing_text}"

#                 cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
#                 cv2.putText(frame, label_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

#                 if detection["label"].lower() == "person" and "person_id" in detection:
#                     person_id = detection["person_id"]
#                     centroid = tracker.tracked_persons.get(person_id)
#                     if centroid:
#                         cv2.circle(frame, centroid, 5, (0, 0, 255), -1)
#                         cv2.putText(frame, f"ID: {person_id}", (centroid[0] - 10, centroid[1] - 10),
#                                     cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#             cv2.putText(frame, f"Total Employees in Frame: {total_person_count}", (50, 50),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

#             success, buffer = cv2.imencode('.jpg', frame)
#             if not success:
#                 continue
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

#         cap.release()

#     return frame_generator




# import cv2
# import math
# from collections import OrderedDict
# from app.Applications.PPE_Compliance_Detection.ppe_model import ppe_model
# from app.service.ppe_detection_logger import log_ppe_detection # 👈 added your logger import

# # Optional: move to app/utils/tracking.py if reused
# class CentroidTracker:
#     def __init__(self, max_distance=50):
#         self.next_person_id = 1
#         self.tracked_persons = OrderedDict()
#         self.max_distance = max_distance

#     def update(self, detections):
#         current_centroids = []
#         unmatched_centroids = []

#         for detection in detections:
#             if detection["label"].lower() == "person":
#                 x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
#                 centroid = ((x + w) // 2, (y + h) // 2)
#                 current_centroids.append((centroid, detection))

#         updated_persons = OrderedDict()
#         for centroid, detection in current_centroids:
#             matched_person_id = None
#             for person_id, tracked_centroid in self.tracked_persons.items():
#                 distance = math.sqrt((centroid[0] - tracked_centroid[0]) ** 2 +
#                                      (centroid[1] - tracked_centroid[1]) ** 2)
#                 if distance < self.max_distance:
#                     matched_person_id = person_id
#                     break

#             if matched_person_id is not None:
#                 updated_persons[matched_person_id] = centroid
#                 detection["person_id"] = matched_person_id
#             else:
#                 unmatched_centroids.append(centroid)
#                 updated_persons[self.next_person_id] = centroid
#                 detection["person_id"] = self.next_person_id
#                 self.next_person_id += 1

#         self.tracked_persons = updated_persons
#         return unmatched_centroids

# tracker = CentroidTracker()

# def process_video_stream(video_path, zone):
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         raise IOError("Unable to open video.")

#     def frame_generator():
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             detections = ppe_model.predict(frame)
#             tracker.update(detections)

#             total_person_count = len([d for d in detections if d["label"].lower() == "person"])
#             for detection in detections:
#                 x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
#                 label, conf, color = detection["label"], detection["confidence"], detection["color"]
#                 label_text = f"{label} ({conf:.2f})"

#                 required_ppe = {"helmet", "gloves", "vest"}
#                 detected_ppe = {d["label"].lower() for d in detections if d["label"].lower() in required_ppe}
#                 missing_ppe = required_ppe - detected_ppe
#                 missing_text = ", ".join(f"Missing {item.capitalize()}" for item in missing_ppe)
#                 if missing_text:
#                     label_text += f" | {missing_text}"

#                 cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
#                 cv2.putText(frame, label_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

#                 if detection["label"].lower() == "person" and "person_id" in detection:
#                     person_id = detection["person_id"]
#                     centroid = tracker.tracked_persons.get(person_id)
#                     if centroid:
#                         cv2.circle(frame, centroid, 5, (0, 0, 255), -1)
#                         cv2.putText(frame, f"ID: {person_id}", (centroid[0] - 10, centroid[1] - 10),
#                                     cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#                         # ✅ Store detected PPE compliance data to MongoDB (with frame) based on time logic
#                         #zone = "Zone-A"  # or dynamically determine this based on position if required
#                         print('main frame calling')
#                         log_ppe_detection(
#                             person_id=person_id,
#                             detected_ppe=detected_ppe,
#                             missing_ppe=missing_ppe,
#                             zone=zone,
#                             frame=frame
#                         )

#             cv2.putText(frame, f"Total Employees in Frame: {total_person_count}", (50, 50),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

#             success, buffer = cv2.imencode('.jpg', frame)
#             if not success:
#                 continue
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

#         cap.release()

#     return frame_generator


import cv2
import math
from collections import OrderedDict
from app.Applications.PPE_Compliance_Detection.ppe_model import ppe_model
from app.service.ppe_detection_logger import log_ppe_detection

# Optional: move to app/utils/tracking.py if reused
class CentroidTracker:
    def __init__(self, max_distance=50):
        self.next_person_id = 1
        self.tracked_persons = OrderedDict()
        self.max_distance = max_distance

    def update(self, detections):
        current_centroids = []
        unmatched_centroids = []

        for detection in detections:
            if detection["label"].lower() == "person":
                x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
                centroid = ((x + w) // 2, (y + h) // 2)
                current_centroids.append((centroid, detection))

        updated_persons = OrderedDict()
        for centroid, detection in current_centroids:
            matched_person_id = None
            for person_id, tracked_centroid in self.tracked_persons.items():
                distance = math.sqrt((centroid[0] - tracked_centroid[0]) ** 2 +
                                     (centroid[1] - tracked_centroid[1]) ** 2)
                if distance < self.max_distance:
                    matched_person_id = person_id
                    break

            if matched_person_id is not None:
                updated_persons[matched_person_id] = centroid
                detection["person_id"] = matched_person_id
            else:
                unmatched_centroids.append(centroid)
                updated_persons[self.next_person_id] = centroid
                detection["person_id"] = self.next_person_id
                self.next_person_id += 1

        self.tracked_persons = updated_persons
        return unmatched_centroids


tracker = CentroidTracker()

# def process_video_stream(video_path, zone):
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         raise IOError("Unable to open video.")

#     def frame_generator():
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             detections = ppe_model.predict(frame)
#             tracker.update(detections)

#             total_person_count = len([d for d in detections if d["label"].lower() == "person"])
#             required_ppe = {"helmet", "gloves", "vest"}

#             detected_ppe = {d["label"].lower() for d in detections if d["label"].lower() in required_ppe}
#             missing_ppe = required_ppe - detected_ppe

#             for detection in detections:
#                 x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
#                 label, conf, color = detection["label"], detection["confidence"], detection["color"]
#                 label_text = f"{label} ({conf:.2f})"

#                 if missing_ppe:
#                     label_text += " | " + ", ".join(f"Missing {item.capitalize()}" for item in missing_ppe)

#                 cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
#                 cv2.putText(frame, label_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

#                 if detection["label"].lower() == "person" and "person_id" in detection:
#                     person_id = detection["person_id"]
#                     centroid = tracker.tracked_persons.get(person_id)
#                     if centroid:
#                         cv2.circle(frame, centroid, 5, (0, 0, 255), -1)
#                         cv2.putText(frame, f"ID: {person_id}", (centroid[0] - 10, centroid[1] - 10),
#                                     cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#                         log_ppe_detection(
#                             person_id=person_id,
#                             detected_ppe=detected_ppe,
#                             missing_ppe=missing_ppe,
#                             zone=zone,
#                             frame=frame
#                         )

#             cv2.putText(frame, f"Total Employees in Frame: {total_person_count}", (50, 50),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

#             success, buffer = cv2.imencode('.jpg', frame)
#             if not success:
#                 continue
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

#         cap.release()

#     return frame_generator

def process_video_stream(video_path, zone):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise IOError("Unable to open video.")

    PPE_CONF_THRESHOLD = 0.60  # configurable threshold

    def frame_generator():
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            detections = ppe_model.predict(frame)
            tracker.update(detections)

            total_person_count = len([d for d in detections if d["label"].lower() == "person"])
            required_ppe = {"helmet", "gloves", "vest"}

            # PPE detected with confidence >= 0.60
            detected_ppe = {
                d["label"].lower()
                for d in detections
                if d["label"].lower() in required_ppe and d["confidence"] >= PPE_CONF_THRESHOLD
            }

            missing_ppe = required_ppe - detected_ppe

            for detection in detections:
                x, y, w, h = detection["x"], detection["y"], detection["width"], detection["height"]
                label, conf, color = detection["label"], detection["confidence"], detection["color"]
                label_text = f"{label} ({conf:.2f})"

                # ✅ Attach missing PPE info only to person detection boxes
                if detection["label"].lower() == "person":
                    if missing_ppe:
                        label_text += " | " + ", ".join(f"Missing {item.capitalize()}" for item in missing_ppe)

                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame, label_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                if detection["label"].lower() == "person" and "person_id" in detection:
                    person_id = detection["person_id"]
                    centroid = tracker.tracked_persons.get(person_id)
                    if centroid:
                        cv2.circle(frame, centroid, 5, (0, 0, 255), -1)
                        cv2.putText(frame, f"ID: {person_id}", (centroid[0] - 10, centroid[1] - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                        log_ppe_detection(
                            person_id=person_id,
                            detected_ppe=detected_ppe,
                            missing_ppe=missing_ppe,
                            zone=zone,
                            frame=frame
                        )

            cv2.putText(frame, f"Total Employees in Frame: {total_person_count}", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

            success, buffer = cv2.imencode('.jpg', frame)
            if not success:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

        cap.release()

    return frame_generator