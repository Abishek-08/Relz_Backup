from fastapi import APIRouter
from app.logger.logger import get_logger
from app.celery.tasks import test_celery_task

demoRouter = APIRouter()
logger = get_logger()


@demoRouter.get('/test')
async def test():
    logger.info('demo-router is running')
    return {'status':'demo-router is running from detect-service'}

@demoRouter.get('/{number}')
async def test_celery(number: int):
    result = test_celery_task.delay(num=number)
    return result.get()