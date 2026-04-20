from app.config import Base
from sqlalchemy import Column,Integer,ForeignKey,DateTime,func
from sqlalchemy.orm import relationship
from app.models.plan import Plan
from app.models.solution import Solution

class IndividualPlan(Base):
    __tablename__ = "individualPlan_tbl"

    individualPlanId = Column(Integer,primary_key=True,index=True)
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now(),default=func.now())

    plan_Id = Column(Integer,ForeignKey('plan_tbl.planId'),unique=True)
    plan = relationship('Plan',back_populates='individualplan',cascade="all")

    solution_Id = Column(Integer,ForeignKey('solution_tbl.solutionId'),unique=True)
    solution = relationship('Solution',back_populates='individualplan')

Plan.individualplan = relationship("IndividualPlan", back_populates="plan", uselist=False)
Solution.individualplan = relationship("IndividualPlan",back_populates='solution',uselist=False)

    
