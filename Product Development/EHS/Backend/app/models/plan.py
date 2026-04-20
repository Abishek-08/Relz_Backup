from app.config import Base
from sqlalchemy import Column,String,Integer,Double,DateTime,func
from sqlalchemy.orm import relationship


class Plan(Base):
    __tablename__ = "plan_tbl"

    planId = Column(Integer,primary_key=True,index=True)
    planType = Column(String(50))
    planDuration = Column(Integer)
    planAmount = Column(Double)
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())