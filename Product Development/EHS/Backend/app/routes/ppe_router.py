# import os
# from fastapi import APIRouter,Query
# from fastapi.responses import JSONResponse,StreamingResponse
# from app.Applications.PPE_Compliance_Detection.ppe_main import process_video_stream
# #from app.service.ppe_detection_service import log_detections_every_5_minutes,start_detection_loggers,stop_detection_loggers
# ppe_router = APIRouter()

# VIDEO_PATHS = {
#     "zone1": "assets/PPE_Detection/EHS.mp4",
#     "zone2": "assets/PPE_Detection/EHS_zone2.mp4",
#     "zone3": "assets/PPE_Detection/EHS_zone3.mp4"
# }

# @ppe_router.get("/test")
# def test():
#     return {"status":"PPE Router is running"}

# # @ppe_router.post("/start-detection")
# # async def start_detection():
# #     start_detection_loggers()
# #     return {"message": "PPE detection tasks started successfully."}

# # @ppe_router.post("/stop-detection")
# # async def stop_detection():
# #     stop_detection_loggers()
# #     return {"message": "PPE detection tasks stopped successfully."}

# @ppe_router.get("/live-z1")
# def detect_ppe_video(zone: str = Query("zone1", enum=list(VIDEO_PATHS.keys()))):
#     video_path = VIDEO_PATHS.get(zone)
#     if not video_path or not os.path.exists(video_path):
#         return JSONResponse(status_code=400, content={"error": "Invalid or missing video file."})

#     try:
#         frame_generator = process_video_stream(video_path,zone)
#         return StreamingResponse(frame_generator(), media_type='multipart/x-mixed-replace; boundary=frame')
#     except IOError as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})

# @ppe_router.get("/live-z2")
# def detect_ppe_video(zone: str = Query("zone2", enum=list(VIDEO_PATHS.keys()))):
#     video_path = VIDEO_PATHS.get(zone)
#     if not video_path or not os.path.exists(video_path,zone):
#         return JSONResponse(status_code=400, content={"error": "Invalid or missing video file."})

#     try:
#         frame_generator = process_video_stream(video_path)
#         return StreamingResponse(frame_generator(), media_type='multipart/x-mixed-replace; boundary=frame')
#     except IOError as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})
    
# @ppe_router.get("/live-z3")
# def detect_ppe_video(zone: str = Query("zone3", enum=list(VIDEO_PATHS.keys()))):
#     video_path = VIDEO_PATHS.get(zone)
#     if not video_path or not os.path.exists(video_path,zone):
#         return JSONResponse(status_code=400, content={"error": "Invalid or missing video file."})

#     try:
#         frame_generator = process_video_stream(video_path)
#         return StreamingResponse(frame_generator(), media_type='multipart/x-mixed-replace; boundary=frame')
#     except IOError as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})


import os
from fastapi import APIRouter,Query
from fastapi.responses import JSONResponse,StreamingResponse
from app.Applications.PPE_Compliance_Detection.ppe_main import process_video_stream
#from app.service.ppe_detection_service import log_detections_every_5_minutes,start_detection_loggers,stop_detection_loggers
from app.service.ppe_kpi_service import KPIService
from app.repository.ppe_detection_repository import DetectionRepository


ppe_router = APIRouter()

VIDEO_PATHS = {
    "zone1": "assets/PPE_Detection/EHS.mp4",
    "zone2": "assets/PPE_Detection/EHS ZONE2 VIDEO.mp4",
    "zone3": "assets/PPE_Detection/EHS_CCTV.mp4"
}

@ppe_router.get("/test")
def test():
    return {"status":"PPE Router is running"}

# @ppe_router.post("/start-detection")
# async def start_detection():
#     start_detection_loggers()
#     return {"message": "PPE detection tasks started successfully."}

# @ppe_router.post("/stop-detection")
# async def stop_detection():
#     stop_detection_loggers()
#     return {"message": "PPE detection tasks stopped successfully."}





@ppe_router.get("/dashboard")
async def get_dashboard_kpis():
    repo = DetectionRepository()
    service = KPIService(repo)
    return {
        "ppe_compliance_rate_this_month": await service.ppe_compliance_rate_this_month(),
        "non_compliance_incidents_this_week": await service.non_compliance_incidents_this_week(),
        "compliance_streak": await service.compliance_streak(),
        "compliance_score_by_zone": await service.compliance_score_by_zone(),
        "Compliance_data_record": await service.detection_days_summary(),
    }