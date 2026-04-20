import os
from dotenv import load_dotenv
from fastapi import FastAPI
from app.models.user import User
from app.models.industry import Industry
from app.models.solution import Solution 
from app.models.vehicle import Vehicle
from app.models.plan import Plan
from app.models.individualPlan import IndividualPlan
from app.models.bundlePlan import BundlePlan
from sqlalchemy.orm import Session
from app.dependency.mysql_dependency import SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user_router import user_router
from app.routes.industry_router import industry_router
from app.routes.solution_router import solution_router
from app.routes.vehicle_router import vehicle_router
from app.routes.forklift_router import forklift_router
from app.routes.plan_router import plan_router
from app.routes.ppe_router import ppe_router
from app.routes.individualPlan_router import individualPlan_router
from app.routes.bundlePlan_router import budlePlan_router
from app.routes.counting_router import counting_router
from app.routes.conveyorBelt_router import conveyorBelt_router
from app.service.vehicle_service import startup_vehicle_insert_service
from app.config import Base, engine

load_dotenv()

# Reading constants from the .env file
version = os.getenv('VERSION')
origins = os.getenv('ORIGINS')

# Initialize the app
app = FastAPI(
    title='EHS-Application',
    version=version,
    description='EHS is a vision AI-based Application',
    root_path=f"{os.getenv('EHS_BASE_URL')}/{version}"
)

# Create the tables using Base.metadata.create_all()
Base.metadata.create_all(engine)  # This will create the tables

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Include routers
app.include_router(user_router, prefix=f"{os.getenv('USER_ROUTER_BASE_URL')}", tags=['user'])
app.include_router(industry_router,prefix=f"{os.getenv('INDUSTRY_ROUTER_BASE_URL')}",tags=['industry'])
app.include_router(solution_router,prefix=f"{os.getenv('SOLUTION_ROUTER_BASE_URL')}",tags=['solution'])
app.include_router(vehicle_router,prefix=f"{os.getenv('VEHICLE_ROUTER_BASE_URL')}",tags=['vehicle'])
app.include_router(forklift_router,prefix=f"{os.getenv('FORKLIFT_ROUTER_BASE_URL')}",tags=['forklift'])
app.include_router(plan_router, prefix=f"{os.getenv('PLAN_ROUTER_BASE_URL')}",tags=['plan'])
app.include_router(ppe_router, prefix=f"{os.getenv('PPE_ROUTER_BASE_URL')}",tags=['ppe'])
app.include_router(individualPlan_router,prefix=f"{os.getenv('INDIVIDUALPLAN_ROUTER_BASE_URL')}",tags=['individualplan'])
app.include_router(budlePlan_router,prefix=f"{os.getenv('BUNDLEPLAN_ROUTER_BASE_URL')}",tags=['bundleplan'])
app.include_router(counting_router,prefix=f"{os.getenv('COUNTING_ROUTER_BASE_URL')}",tags=['counting'])
app.include_router(conveyorBelt_router,prefix=f"{os.getenv('CONVEYORBELT_ROUTER_BASE_URL')}",tags=['conveyor'])



@app.on_event("startup")
def startup_vehicle():
    db = SessionLocal()
    try:
        startup_vehicle_insert_service(db)
    finally:
        db.close()