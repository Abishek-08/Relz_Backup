from celery import Celery
from app.config import REDIS_URL
from typing import List

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

@celery_app.task
def calculateSum(num: int):
    import time
    sum = 0
    for i in range(num):
        sum = sum + i
    time.sleep(10)
    return sum

@celery_app.task
def odd_even(numbers: list[int]):
    oddList = []
    evenList = []
    import time
    for i in numbers:
        if i%2 == 0:
            evenList.append(i)
        else:
            oddList.append(i)
    time.sleep(10)
    return {"oddList":oddList, "evenList": evenList}
