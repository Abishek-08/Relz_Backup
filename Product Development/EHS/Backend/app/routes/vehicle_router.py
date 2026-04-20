from fastapi import APIRouter,Response,WebSocket
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
# from app.socket.socket_manager import sio
from app.dependency.mysql_dependency import db_dependency,SessionLocal
from app.constants.string_constants  import STATUS
from app.constants.api_constants import TEST
import asyncio
from app.schemas.vehicles import Vehicles
from app.Applications.Vehicle_Parking_Detection.vehicle_model import generateFrame
from app.service.vehicle_service import insert_Vehicle_service,update_Vehicle_service,get_vehicle_update_count_service,startup_vehicle_insert_service


vehicle_router = APIRouter()


@vehicle_router.get(TEST)
async def test():
    return {STATUS:"vehicle router is running"}
    

@vehicle_router.post("/")
async def insert_Vehicle(vehicle:Vehicles,response:Response,db:Session = db_dependency):
    try:
        response.status_code = 200
        return insert_Vehicle_service(vehicle,db)

    except Exception as e:
        response.status_code = 422
        return {"error":str(e)} 


@vehicle_router.put("/")
async def update_Vehicle(vehicle:Vehicles,response:Response,db:Session = db_dependency):
    try:
         response.status_code=200
         update_Vehicle_service(vehicle,db)
         return {STATUS:'success'}
    except Exception as e:
         response.status_code=500
         return{"error":str(e)}
    
    
@vehicle_router.get('/live')
async def live_footage():
    return StreamingResponse(generateFrame(), media_type="multipart/x-mixed-replace; boundary=frame")

# @vehicle_router.websocket("/ws/vehicleupdate")
# async def vehicle_count_socket(websocket: WebSocket):
#     await websocket.accept()
#     print("WebSocket client connected")

#     # Manually create DB session
#     db = SessionLocal()

#     try:
#         while True:
#             vehicle = get_vehicle_update_count_service(1, db)
#             vehicle_data = Vehicles.from_orm(vehicle).json()
#             await websocket.send_json({"vehicle": vehicle_data})
#             print("Vehicle: ", vehicle_data)
#             await asyncio.sleep(5)
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#     finally:
#         db.close()

@vehicle_router.get("/vehicleupdate")
def get_vehicle_count(db:Session=db_dependency):
    return get_vehicle_update_count_service(1,db )


    

    

 
        

    