from pydantic import BaseModel
from typing import Optional

class Industries(BaseModel):
    industryId: Optional[int] = None
    industryType: str
    industryDescription: str