from sqlalchemy.orm import Session
from app.schemas.plans import Plans
from app.models.plan import Plan

def insert_plan_repo(plan:Plans,db:Session):
    plan_data = Plan(**plan.dict())
    db.add(plan_data)
    db.commit()
    db.refresh(plan_data)
    return plan_data

def get_all_plan_repo(db:Session):
    return db.query(Plan).all()