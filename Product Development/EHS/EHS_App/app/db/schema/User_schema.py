from pydantic import BaseModel
from typing import Optional

class Users(BaseModel):
    userName:str
    userEmail:str
    userGender:str
    userPassword:str