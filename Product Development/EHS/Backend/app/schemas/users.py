from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile


class Users(BaseModel):
    userId: Optional[int] = None
    userName: Optional[str] = None
    userEmail: Optional[str] = None
    userGender: Optional[str] = None
    userPassword: Optional[str] = None
    userProfile:Optional[bytes] = None
    