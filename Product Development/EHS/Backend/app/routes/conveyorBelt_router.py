from fastapi import APIRouter,Response
from fastapi.responses import StreamingResponse
from app.Applications.Conveyor_Product_Detection.conveyor_main import generate_frames
from app.constants.string_constants import STATUS

conveyorBelt_router = APIRouter()

@conveyorBelt_router.get('/test')
async def test():
    return {STATUS:"Conveyor-Belt router is running"}

@conveyorBelt_router.get('/live')
async def liveStream():
    return  StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")