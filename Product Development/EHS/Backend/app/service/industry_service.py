from sqlalchemy.orm import Session
from app.schemas.industries import Industries
from typing import List
from app.repository.industry_repo import create_category_repo,update_category_repo, get_all_industry_repo,delete_industry_by_type_repo,get_all_unplanned_industry_repo

def create_category_service(industry:Industries,db:Session):
    create_category_repo(industry,db)

def update_category_service(industry:Industries,db:Session):
    update_category_repo(industry,db)

def get_all_industry_service(db:Session):
    result = get_all_industry_repo(db)
    if result:
        return result
    return None

def delete_industry_by_type_service(industryType:str, db:Session):
    delete_industry_by_type_repo(industryType,db)

def delete_multiple_industry_service(industryList:List[str], db:Session):
    try:
        for industry in industryList:
            delete_industry_by_type_service(industry,db)
        return True
    except Exception as e:
        return False
    
def get_all_unplanned_industry_service(db:Session):
    return get_all_unplanned_industry_repo(db)