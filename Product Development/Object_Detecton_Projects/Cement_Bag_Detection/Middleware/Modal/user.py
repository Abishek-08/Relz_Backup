from pydantic import BaseModel

class user(BaseModel):
    userName:str
    userPassword:str
    userGender:str
    userEmail:str