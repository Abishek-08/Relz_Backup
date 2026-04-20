from fastapi import APIRouter,HTTPException,Response
from fastapi.responses import StreamingResponse
from app.Applications.Product_Counting.count_main import generate_frames
from app.constants.string_constants import STATUS


counting_router = APIRouter()

@counting_router.get('/test')
async def test():
    return {STATUS:"Counting router is running"}

@counting_router.get('/live')
async def liveStream():
    return  StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")