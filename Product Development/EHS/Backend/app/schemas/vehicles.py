from pydantic import BaseModel
from typing import Optional

class Vehicles(BaseModel):
    vehicleId : Optional[int] = None
    totalParkingSlot:int
    occupiedSlot : int
    unOccupiedSlot:int

    model_config = {
        "from_attributes":True
    }
