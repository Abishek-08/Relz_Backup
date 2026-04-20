from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PPEItem(BaseModel):
    item_name: str
    compliant: bool

class Detection(BaseModel):
    person_id: Optional[str]
    detected_ppe: List[str]
    missing_ppe: List[str]
    zone: str
    timestamp: datetime
    image: Optional[str]  # base64 string
