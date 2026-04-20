from pydantic import BaseModel
from typing import Optional

class Plans(BaseModel):
    planId:Optional[int] = None
    planType:Optional[str] = None
    planDuration:Optional[int] = None
    planAmount:Optional[float] = None