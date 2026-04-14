from celery import Celery
from app.config import REDIS_URL

celery_app = Celery(
    "doc_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)