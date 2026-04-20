from sqlalchemy.orm import Session
from app.schemas.vehicles import Vehicles
from app.models.vehicle import Vehicle
from app.dependency.mysql_dependency import db_dependency

def insert_vehicle_repo(vehicle_data:Vehicles,db:Session):
    db_vehicle = Vehicle(**vehicle_data.dict())  
    db.add(db_vehicle)  
    db.commit()  
    db.refresh(db_vehicle)  
    return db_vehicle

def update_Vehicle_repo(vehicle:Vehicles,db:Session):
    db.query(Vehicle).filter(Vehicle.vehicleId == vehicle.vehicleId).update(vehicle.dict())
    db.commit()

def get_vehicle_update_count_repo(vehicleId:int, db:Session):
    return db.query(Vehicle).filter(Vehicle.vehicleId==vehicleId).first()

def startup_vehicle_insert_repo(db:Session):
    temp_vehicle = Vehicles(vehicleId=1,totalParkingSlot=12,occupiedSlot=0,unOccupiedSlot=0)
    vehicle = Vehicle(**temp_vehicle.dict())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    
    
def get_vehicle_by_id_repo(vehicleId:int, db:Session):
    return db.query(Vehicle).filter(Vehicle.vehicleId == vehicleId).first()