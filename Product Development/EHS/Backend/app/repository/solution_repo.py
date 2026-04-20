from sqlalchemy import text
from sqlalchemy.orm import Session,joinedload
from app.models.solution import Solution
from app.schemas.solutions import Solutions

def create_solution_repo(solution:Solutions,db:Session):
    db_solution = Solution(**solution.dict())
    db.add(db_solution)
    db.commit()

def get_solution_by_id_repo(solutionId,db:Session):
    return db.query(Solution).options(joinedload(Solution.industrys)).filter_by(solutionId=solutionId).all()

def get_solution_by_industryId_repo(industryId:int, db:Session):
    return db.query(Solution).options(joinedload(Solution.industrys)).filter_by(industry_Id=industryId).all()

def deletion_solution_by_industryId_repo(solutionId:int, db:Session):
    solution = db.query(Solution).options(joinedload(Solution.industrys)).filter_by(solutionId = solutionId).first()
    db.delete(solution)
    db.commit()

def get_all_solution_repo(db:Session):
    return db.query(Solution).all()

def get_all_unplanned_solution_repo(db:Session):
    result = db.execute(text("""SELECT 
                                    sl.solutionId,
                                    sl.solutionType
                                FROM solution_tbl sl
                                WHERE sl.solutionId 
                                NOT IN 
                                (
                                SELECT 
                                    solution_Id 
                                FROM individualPlan_tbl
                                );
                             """))
    columns = result.keys()
    return [dict(zip(columns, row)) for row in result.fetchall()]