from sqlalchemy.orm import Session
from app.schemas.bundlePlans import BundlePlans
from app.repository.bundlePlan_repo import insert_bundlePlan_repo,get_all_bundlePlan_repo

def insert_bundlePlan_service(bundlePlan:BundlePlans,db:Session):
    return insert_bundlePlan_repo(bundlePlan,db)

def get_all_bundlePlan_service(db:Session):
    return get_all_bundlePlan_repo(db)