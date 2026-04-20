from sqlalchemy import Integer,Column,DateTime,func
from app.config import Base

class Vehicle(Base):
    __tablename__ = 'VehicleCount_tbl'

    vehicleId = Column(Integer,primary_key=True,index=True)
    totalParkingSlot = Column(Integer)
    occupiedSlot=Column(Integer)
    unOccupiedSlot=Column(Integer)
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())

