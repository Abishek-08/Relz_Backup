from sqlalchemy.orm import Session,joinedload
from app.models.bundlePlan import BundlePlan
from app.schemas.bundlePlans import BundlePlans


def insert_bundlePlan_repo(bundlePlan:BundlePlans,db:Session):
    bundlePlan_data = BundlePlan(**bundlePlan.dict())
    db.add(bundlePlan_data)
    db.commit()
    db.refresh(bundlePlan_data)
    return bundlePlan_data

def get_all_bundlePlan_repo(db:Session):
    return db.query(BundlePlan).options(joinedload(BundlePlan.plan),joinedload(BundlePlan.industry)).all()