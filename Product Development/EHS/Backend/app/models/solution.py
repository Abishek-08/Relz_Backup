from app.config import Base
from sqlalchemy import Column,String,Integer,DateTime,func,ForeignKey
from sqlalchemy.orm import relationship

class Solution(Base):
    __tablename__ = "solution_tbl"

    solutionId = Column(Integer,primary_key=True,index=True)
    solutionType = Column(String(100))
    solutionDescription = Column(String(255))
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())

    industry_Id = Column(Integer,ForeignKey('industry_tbl.industryId'))
    industrys = relationship('Industry',back_populates='solutions',cascade="all")

   

    