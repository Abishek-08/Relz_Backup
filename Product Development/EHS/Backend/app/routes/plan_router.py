from fastapi import APIRouter,Response
from sqlalchemy.orm import Session
from app.dependency.mysql_dependency import db_dependency
from app.schemas.plans import Plans
from app.constants.string_constants import STATUS
from app.service.plan_service import insert_plan_service,get_all_plan_service

plan_router = APIRouter()

@plan_router.get("/test")
def test():
    return {"status":"Plan Router is Running"}

@plan_router.post("/")
def insert_plan(plan:Plans,response:Response ,db:Session=db_dependency):
    try:
        response.status_code = 200
        return insert_plan_service(plan,db)
    except Exception as e:
        response.status_code = 500
        return {STATUS:f'{e}'}
    
@plan_router.get("/")
def get_all_plan(db:Session=db_dependency):
    try:
        return get_all_plan_service(db)
    except Exception as e:
        return {STATUS:f'{e}'}