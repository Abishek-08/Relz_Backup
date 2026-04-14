from fastapi import APIRouter
from app.logger.logger import get_logger

demoRouter = APIRouter()
logger = get_logger()


@demoRouter.get('/test')
async def test():
    logger.info('demo-router is running')
    return {'status':'demo-router is running from detect-service'}