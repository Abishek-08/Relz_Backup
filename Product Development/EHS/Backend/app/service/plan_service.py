from sqlalchemy.orm import Session
from app.schemas.plans import Plans
from app.repository.plan_repo import insert_plan_repo,get_all_plan_repo

def insert_plan_service(plan:Plans,db:Session):
    return insert_plan_repo(plan,db)

def get_all_plan_service(db:Session):
    return get_all_plan_repo(db)