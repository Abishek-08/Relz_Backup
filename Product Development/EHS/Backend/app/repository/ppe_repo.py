from datetime import datetime, timedelta
from app.config import PPE_Compliance_Collection
from zoneinfo import ZoneInfo



def save_ppe_detection(person_id, detected_ppe, missing_ppe, zone, timestamp, image_base64,ppe_items):
    data = {
        "person_id": person_id,
        "detected_ppe": list(detected_ppe),
        "missing_ppe": list(missing_ppe),
        "zone": zone,
        "timestamp": timestamp,
        "image": image_base64,
        "ppe_items": ppe_items,
    }
    PPE_Compliance_Collection.insert_one(data)
    print(f"[MongoDB] Detection stored for {zone} at {timestamp}")


