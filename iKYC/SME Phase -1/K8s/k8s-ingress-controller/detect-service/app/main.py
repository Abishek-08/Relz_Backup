import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.demo_router import demoRouter

load_dotenv()



app = FastAPI(
    title='detect-service',
    version="1",
    description='It is detect-microservice',\
    root_path='/detect'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(demoRouter, prefix=f"/demo", tags=['demo'])