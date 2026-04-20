from sqlalchemy import String,Integer,Column,DateTime,func
from sqlalchemy.dialects.mysql import MEDIUMBLOB
from app.config import Base

class User(Base):
    __tablename__ = 'user_tbl'

    userId = Column(Integer,primary_key=True,index=True)
    userName = Column(String(30))
    userEmail = Column(String(30),unique=True)
    userGender = Column(String(10))
    userPassword = Column(String(30))
    userRole = Column(String(30),default='USER')
    userProfile = Column(MEDIUMBLOB)
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())

