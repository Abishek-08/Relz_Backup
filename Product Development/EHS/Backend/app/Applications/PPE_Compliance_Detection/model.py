from pydantic import BaseModel,HttpUrl
from typing import List


from pydantic import BaseModel
from typing import List

class PPEItem(BaseModel):
    name: str  # Example: 'helmet', 'gloves'
    detected: bool  # True if detected, False otherwise
    confidence: float  # Confidence score from the model
    bbox: List[float]  # List of 4 float values representing [x_min, y_min, x_max, y_max]

    class Config:
        arbitrary_types_allowed = True  # Not needed, but kept in case you add custom types


class PersonPPEStatus(BaseModel):
    person_id: int
    ppe_items: List[PPEItem]
    compliance_status: bool  # True if all required PPEs are present

class PPEVideoRequest(BaseModel):
    video_url: HttpUrl  # Ensures it's a valid URL
    zone: str  # Ensures it's a string