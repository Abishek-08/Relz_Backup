from sqlalchemy.orm import Session
from app.dependency.mysql_dependency import db_dependency
from fastapi import APIRouter,Response
from app.constants.string_constants import STATUS,SUCCESS
from app.constants.api_constants import TEST
from app.schemas.solutions import Solutions
from app.service.solution_service import create_solution_service,get_solution_by_id_service,get_solution_by_industryId_service,delete_solution_by_industryId_service,get_all_solution_service,get_all_unplanned_solution_service

solution_router = APIRouter()

@solution_router.get(TEST)
async def test():
    return {STATUS:"solution router is running"}

@solution_router.post('/')
async def create_solution(solution:Solutions,db:Session = db_dependency):
     try:
          create_solution_service(solution,db)
          return Response(status_code=200,content=SUCCESS)
     except Exception as e:
          return Response(status_code=500,content=f'{e}')
    

@solution_router.get('/{solutionId}')
async def get_solution_by_id(solutionId:int,db:Session = db_dependency):
     try:
          return get_solution_by_id_service(solutionId,db)
     except Exception as e:
          return Response(status_code=500, content=f'{e}')
     
@solution_router.get('/industry/{industryId}')
async def get_solution_by_industryId(industryId:int, db:Session = db_dependency):
     try:
          return get_solution_by_industryId_service(industryId,db)
     except Exception as e:
          return Response(status_code=500, content=f'{e}')
     
@solution_router.delete('/{solutionId}')
async def delete_solution_by_industryId(solutionId:int, db:Session = db_dependency):
     try:
          delete_solution_by_industryId_service(solutionId,db)
          return Response(status_code=200, content=SUCCESS)
     except Exception as e:
          return Response(status_code=500, content=f'{e}')
     
@solution_router.get('/')
async def get_all_solution(db:Session=db_dependency):
     try:
          return get_all_solution_service(db)
     except Exception as e:
          return Response(status_code=500, content=f'{e}')
     
@solution_router.get('/unplan/')
async def get_all_unplanned_solution(db:Session=db_dependency):
     return get_all_unplanned_solution_service(db)