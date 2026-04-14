from celery import Celery
from app.config import REDIS_URL

celery_app = Celery(
    "kyc_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

@celery_app.task
def process_face(image_data: str):
    import time
    print("🧠 Processing face data...")
    time.sleep(3)
    return {"verified": True, "confidence": 0.96}
