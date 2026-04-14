from app.celery.celery_workers import celery_app

@celery_app.task
def test_celery_task(num: int):
    sum = 0
    for i in range(0,num):
        sum = sum + i
    return sum

