import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.demo_router import demoRouter

load_dotenv()


app = FastAPI(
    title='doc-service',
    version=1,
    description='It is doc-microservice',
    root_path='/doc'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(demoRouter, prefix=f"/demo", tags=['demo'])