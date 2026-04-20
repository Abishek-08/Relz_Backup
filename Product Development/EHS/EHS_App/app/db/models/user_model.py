from sqlalchemy import Column, Integer, String, Table
from app.db.database_config import Base
 

class User(Base):
    __tablename__ = "user_tbl"  
    
    userId = Column(Integer, primary_key=True) 
    userName = Column(String(255))
    userEmail = Column(String(255),unique=True)
    userGender = Column(String(255))
    userPassword = Column(String(255))