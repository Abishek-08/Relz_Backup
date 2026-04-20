from sqlalchemy.orm import Session 
from app.schemas.vehicles import Vehicles
from app.dependency.mysql_dependency import db_dependency
from app.repository.vehicle_repo import insert_vehicle_repo,update_Vehicle_repo,get_vehicle_update_count_repo,startup_vehicle_insert_repo,get_vehicle_by_id_repo


def insert_Vehicle_service(vehicle:Vehicles,db:Session):
    return insert_vehicle_repo(vehicle,db)

def update_Vehicle_service(vehicle:Vehicles,db:Session):
   update_Vehicle_repo(vehicle,db)

def get_vehicle_update_count_service(vehicleId:int, db:Session):
    return get_vehicle_update_count_repo(vehicleId,db)

def startup_vehicle_insert_service(db:Session):
    if not get_vehicle_by_id_repo(1,db):
        startup_vehicle_insert_repo(db)