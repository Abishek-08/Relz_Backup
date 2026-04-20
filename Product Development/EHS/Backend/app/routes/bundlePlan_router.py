from fastapi import APIRouter,Response,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError,IntegrityError
from app.constants.string_constants import STATUS
from app.dependency.mysql_dependency import db_dependency
from app.schemas.bundlePlans import BundlePlans
from app.service.bundlePlan_service import insert_bundlePlan_service,get_all_bundlePlan_service


budlePlan_router = APIRouter()

@budlePlan_router.get('/test')
def test():
    return {STATUS:"Bundle-plan router is running"}

@budlePlan_router.post('/')
async def insert_bundlePlan(bundlePlan:BundlePlans,response:Response,db:Session=db_dependency):
    try:
        response.status_code = 200
        return insert_bundlePlan_service(bundlePlan,db)
    
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=510,detail=f'{e}')
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=512,detail=f'{e}')

    except Exception as e:
        return Response(status_code=500,content=f'{e}')

@budlePlan_router.get('/')
async def get_all_bundlePlan(db:Session=db_dependency):
    return get_all_bundlePlan_service(db)
