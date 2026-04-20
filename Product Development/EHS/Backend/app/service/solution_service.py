from sqlalchemy.orm import Session
from app.schemas.solutions import Solutions
from app.repository.solution_repo import create_solution_repo,get_solution_by_id_repo,get_solution_by_industryId_repo,deletion_solution_by_industryId_repo,get_all_solution_repo,get_all_unplanned_solution_repo

def create_solution_service(solution:Solutions,db:Session):
    create_solution_repo(solution,db)

def get_solution_by_id_service(solutionId,db:Session):
    return get_solution_by_id_repo(solutionId,db)

def get_solution_by_industryId_service(industryId:int, db:Session):
    return get_solution_by_industryId_repo(industryId,db)

def delete_solution_by_industryId_service(solutionId:int, db:Session):
    return deletion_solution_by_industryId_repo(solutionId,db)

def get_all_solution_service(db:Session):
    return get_all_solution_repo(db)

def get_all_unplanned_solution_service(db:Session):
    return get_all_unplanned_solution_repo(db)