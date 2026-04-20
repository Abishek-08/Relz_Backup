from fastapi import APIRouter
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.constants.string_constants import STATUS
from app.dependency.mysql_dependency import db_dependency
from app.schemas.individualPlans import IndividualPlans
from app.service.individualPlan_service import insert_individualPlan_service,get_all_individualPlan_service

individualPlan_router = APIRouter()

@individualPlan_router.get('/test')
def test():
    return {STATUS:"IndividualPlan router is running"}

@individualPlan_router.post('/')
def insert_individualPlan(individualPlan:IndividualPlans,db:Session=db_dependency):
    try:
        return insert_individualPlan_service(individualPlan,db)
    except Exception as e:
        return Response(status_code=500,content=f'{e}')
        
@individualPlan_router.get('/')
def get_all_individualPlan(db:Session=db_dependency):
    return get_all_individualPlan_service(db)


