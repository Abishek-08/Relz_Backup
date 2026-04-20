from sqlalchemy import text
from sqlalchemy.orm import Session,joinedload
from app.schemas.individualPlans import IndividualPlans
from app.models.individualPlan import IndividualPlan

def insert_individualPlan_repo(individualPlan:IndividualPlans,db:Session):
    individualPlan_data = IndividualPlan(**individualPlan.dict())
    db.add(individualPlan_data)
    db.commit()
    db.refresh(individualPlan_data)
    return individualPlan_data

def get_all_individualPlan_repo(db:Session):
    return db.query(IndividualPlan).options(joinedload(IndividualPlan.plan),joinedload(IndividualPlan.solution)).all()