from sqlalchemy import text
from app.schemas.industries import Industries
from app.models.industry import Industry
from sqlalchemy.orm import Session

def create_category_repo(industry:Industries,db:Session):
    db_industry = Industry(**industry.dict())
    db.add(db_industry)
    db.commit()

def update_category_repo(industry:Industries,db:Session):
    db.query(Industry).filter(Industry.industryId == industry.industryId).update(industry.dict())
    db.commit()

def get_all_industry_repo(db:Session):
    return db.query(Industry).all()

def delete_industry_by_type_repo(industryType:str, db:Session):
    industry = db.query(Industry).filter(Industry.industryType == industryType).first()
    db.delete(industry)
    db.commit()

def get_all_unplanned_industry_repo(db:Session):
    result = db.execute(text("""SELECT 
                                    ind.industryId,
                                    ind.industryType
                                FROM industry_tbl ind
                                WHERE ind.industryId 
                                NOT IN (
                                SELECT industry_Id 
                                FROM bundlePlan_tbl
                                        )
                             """))
    columns = result.keys()
    return [dict(zip(columns, row)) for row in result.fetchall()]