from sqlalchemy.orm import Session
from app.schemas.individualPlans import IndividualPlans
from app.repository.individualPlan_repo import insert_individualPlan_repo,get_all_individualPlan_repo

def insert_individualPlan_service(individualPlan:IndividualPlans,db:Session):
    return insert_individualPlan_repo(individualPlan,db)

def get_all_individualPlan_service(db:Session):
    return get_all_individualPlan_repo(db)
