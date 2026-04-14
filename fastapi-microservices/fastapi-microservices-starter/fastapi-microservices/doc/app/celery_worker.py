from celery import Celery
app = Celery("doc", broker="redis://redis:6379/0")
