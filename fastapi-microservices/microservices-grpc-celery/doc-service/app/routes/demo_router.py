from fastapi import APIRouter,Response
from app.logger.logger import get_logger
from grpcc.doc_client import call_detect_service
from typing import List

demoRouter = APIRouter()
logger = get_logger()


@demoRouter.get('/test')
async def test():
    logger.info('demo-router is running')
    return {'status':'demo-router is running from doc-service'} 

@demoRouter.get('/evenlist')
async def calculateEven(num:List[int]):
    print(call_detect_service(number=num))
