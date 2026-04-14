import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.main_router import main_router
from app.routes.webrtc_router import webrtc_router

load_dotenv()

app = FastAPI(
    title='detect-service',
    version="v1",
    description='It is detect-microservice',
    root_path='/v1/ikyc'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(main_router, prefix=f"/api", tags=['api'])
app.include_router(webrtc_router, prefix=f"/webrtc", tags=['webrtc'])