from pydantic import BaseModel

class cement(BaseModel):
    cementName: str
    cementCount: int
    lastCountTimeStamp: str