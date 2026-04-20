from app.config import Base
from sqlalchemy import Column,String,Integer,DateTime,func
from sqlalchemy.orm import relationship
from .solution import Solution

class Industry(Base):
    __tablename__ = 'industry_tbl'

    industryId = Column(Integer,primary_key=True,index=True)
    industryType = Column(String(50))
    industryDescription = Column(String(255))
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())

    solutions = relationship('Solution',back_populates='industrys')

   

