import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.cement_controller import cement_router
from app.api.routers.user_controller import user_router
from app.db.database_config import meta,engine

load_dotenv()

#Reading the constants from the .env file
version = os.getenv('VERSION')
origins = os.getenv('ORIGINS')

#Initialize the app
app = FastAPI(title='EHS-Application',version=version,description='EHS is an vision AI based Application',root_path=f"{os.getenv('EHS_BASE_URL')}/{version}")
meta.create_all(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router,prefix=f"{os.getenv('USER_ROUTER_BASE_URL')}",tags=['user'])
app.include_router(cement_router,prefix=f"{os.getenv('CEMENT_ROUTER_BASE_URL')}",tags=['cement'])

