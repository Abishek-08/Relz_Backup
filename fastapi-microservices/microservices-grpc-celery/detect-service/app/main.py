import os
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.demo_router import demoRouter
from app.grpc.server import serve

load_dotenv()



app = FastAPI(
    title='detect-service',
    version=1,
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

@app.on_event("startup")
def startup_event():
    print("Application is starting up (using @app.on_event)")
    asyncio.run(serve())