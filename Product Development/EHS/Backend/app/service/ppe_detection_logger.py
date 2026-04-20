# import asyncio

# import io
# import cv2
# import base64
# from datetime import datetime, timedelta
# from zoneinfo import ZoneInfo 
# from app.config import PPE_Compliance_Collection

# # Global dictionary to track last save time per zone
# last_save_times = {}

# # Time control interval (adjustable)
# SAVE_INTERVAL = timedelta(minutes=1)  # You can modify this as required

# def log_ppe_detection(person_id, detected_ppe, missing_ppe, zone, frame):
#     current_time = datetime.utcnow()
#     last_time = last_save_times.get(zone)

#     # Check if this zone has reached the save interval
#     if not last_time or (current_time - last_time) >= SAVE_INTERVAL:
#         # Convert frame to JPEG and then to base64
#         _, buffer = cv2.imencode('.jpg', frame)
#         image_bytes = buffer.tobytes()
#         image_base64 = base64.b64encode(image_bytes).decode('utf-8')
#         print('log calling')
#         data = {
#             "person_id": person_id,
#             "detected_ppe": list(detected_ppe),
#             "missing_ppe": list(missing_ppe),
#             "zone": zone,
#             "timestamp": current_time,
#             "image": image_base64
#         }

#         # Insert into MongoDB
#         PPE_Compliance_Collection.insert_one(data)
#         print('after monogo db storing')
#         # Update last save time for this zone
#         last_save_times[zone] = current_time

# def log_ppe_detection(person_id, detected_ppe, missing_ppe, zone, frame):
#     #current_time = datetime.utcnow()
#     current_time = datetime.now(ZoneInfo("Asia/Kolkata"))
#     last_time = last_save_times.get(zone)

#     if not last_time or (current_time - last_time) >= SAVE_INTERVAL:
#         success, buffer = cv2.imencode('.jpg', frame)
#         if not success:
#             print("Failed to encode frame!")
#             return

#         image_bytes = buffer.tobytes()
#         image_base64 = base64.b64encode(image_bytes).decode('utf-8')

#         if len(image_base64) % 4 != 0:
#             print(f"Invalid base64 length: {len(image_base64)}")
#             return

#         print('log calling')
#         data = {
#             "person_id": person_id,
#             "detected_ppe": list(detected_ppe),
#             "missing_ppe": list(missing_ppe),
#             "zone": zone,
#             "timestamp": current_time,
#             "image": image_base64
#         }

#         PPE_Compliance_Collection.insert_one(data)
#         print('after mongo db storing')

#         last_save_times[zone] = current_time



import cv2
import base64
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from app.config import PPE_Compliance_Collection
from app.repository import ppe_repo

# # Global dictionary to track last save time per zone
# last_save_times = {}

# # Time control interval
# SAVE_INTERVAL = timedelta(minutes=1)

# def log_ppe_detection(person_id, detected_ppe, missing_ppe, zone, frame):
#     current_time = datetime.now(ZoneInfo("Asia/Kolkata"))
#     last_time = last_save_times.get(zone)

#     if not last_time or (current_time - last_time) >= SAVE_INTERVAL:
#         success, buffer = cv2.imencode('.jpg', frame)
#         if not success:
#             print("Failed to encode frame!")
#             return

#         image_bytes = buffer.tobytes()
#         image_base64 = base64.b64encode(image_bytes).decode('utf-8')

#         if len(image_base64) % 4 != 0:
#             print(f"Invalid base64 length: {len(image_base64)}")
#             return

#         data = {
#             "person_id": person_id,
#             "detected_ppe": list(detected_ppe),
#             "missing_ppe": list(missing_ppe),
#             "zone": zone,
#             "timestamp": current_time.isoformat(),  # ✅ Save as ISO string in IST
#             "image": image_base64
#         }

#         PPE_Compliance_Collection.insert_one(data)
#         print(f"[MongoDB] Detection stored for {zone} at {current_time}")

#         last_save_times[zone] = current_time

# Global dictionary to track last save time per zone
last_save_times = {}

# Time control interval
SAVE_INTERVAL = timedelta(minutes=1)

def log_ppe_detection(person_id, detected_ppe, missing_ppe, zone, frame):
    current_time = datetime.now(ZoneInfo("Asia/Kolkata"))
    last_time = last_save_times.get(zone)

    if not last_time or (current_time - last_time) >= SAVE_INTERVAL:
        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            print("Failed to encode frame!")
            return

        image_bytes = buffer.tobytes()
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        if len(image_base64) % 4 != 0:
            print(f"Invalid base64 length: {len(image_base64)}")
            return
        
        ppe_items = []

        for ppe in detected_ppe:
            ppe_items.append({"item": ppe, "compliant": True})

        for ppe in missing_ppe:
            ppe_items.append({"item": ppe, "compliant": False})

        #Call the repository function to save
        ppe_repo.save_ppe_detection(
            person_id=person_id,
            detected_ppe=detected_ppe,
            missing_ppe=missing_ppe,
            zone=zone,
            timestamp=current_time,
            image_base64=image_base64,
            ppe_items = ppe_items,
        )

        last_save_times[zone] = current_time