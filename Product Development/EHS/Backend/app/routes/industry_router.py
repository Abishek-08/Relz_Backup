from fastapi import APIRouter,Response,Body
from sqlalchemy.orm import Session
from typing import List
from app.constants.string_constants import STATUS,SUCCESS,FAILURE
from app.constants.api_constants import TEST
from app.schemas.industries import Industries
from app.dependency.mysql_dependency import db_dependency
from app.service.industry_service import create_category_service,update_category_service,get_all_industry_service,delete_industry_by_type_service,delete_multiple_industry_service,get_all_unplanned_industry_service


industry_router = APIRouter()

@industry_router.get(TEST)
async def test():
    return {STATUS:"Industry router is running"}

@industry_router.post('/')
async def create_category(industry:Industries,db:Session = db_dependency):
    try:
        create_category_service(industry,db)
        return Response(status_code=200,content=SUCCESS)
    except Exception as e:
        return Response(status_code=500,content=f'{e}')


@industry_router.put('/')
async def update_category(industry:Industries,db:Session = db_dependency):
    try:
        update_category_service(industry,db)
        return Response(status_code=200,content=SUCCESS)
    except Exception as e:
        return Response(status_code=500,content=f'{e}')

@industry_router.get('/')
async def get_all_industry(response:Response, db:Session = db_dependency):
    try:
        result = get_all_industry_service(db)
        if result is None:
            return []
        response.status_code = 200
        return result
    except Exception as e:
        response.status_code = 500
        return {e}

@industry_router.delete('/{industryType}')
async def delete_industry_by_type(industryType:str,db:Session = db_dependency):
    try:
        delete_industry_by_type_service(industryType,db)
        return Response(status_code=200, content=SUCCESS)
    except Exception as e:
        return Response(status_code=500, content=f'{e}')


@industry_router.post('/multipledelete')
async def delete_multiple_industry(industryList: List[str] = Body(...), db: Session = db_dependency):
    if delete_multiple_industry_service(industryList,db):
        return Response(status_code=200, content=SUCCESS)
    return Response(status_code=500, content=FAILURE)

@industry_router.get('/unplan/')
async def get_all_unplanned_industry(db:Session=db_dependency):
    return get_all_unplanned_industry_service(db)