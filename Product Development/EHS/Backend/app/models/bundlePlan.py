from app.config import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column,Integer,String,DateTime,ForeignKey,func
from app.models.plan import Plan
from app.models.industry import Industry


class BundlePlan(Base):
    __tablename__ = 'bundlePlan_tbl'

    bundlePlanId = Column(Integer,primary_key=True,index=True)
    createdAt = Column(DateTime,server_default=func.now())
    updatedAt = Column(DateTime,onupdate=func.now(),default=func.now())
    
    plan_Id = Column(Integer,ForeignKey('plan_tbl.planId'),unique=True)
    plan = relationship('Plan',back_populates='bundleplan',cascade='all')

    industry_Id = Column(Integer,ForeignKey('industry_tbl.industryId'),unique=True)
    industry = relationship('Industry',back_populates='bundleplan',cascade='all')

Plan.bundleplan = relationship('BundlePlan',back_populates='plan',uselist=False)
Industry.bundleplan = relationship('BundlePlan',back_populates='industry',uselist=False)