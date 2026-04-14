from celery import Celery
app = Celery("detect", broker="redis://redis:6379/0")
