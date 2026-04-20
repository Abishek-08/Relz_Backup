import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.admin_router import admin_router

load_dotenv()

# Reading constants from the .env file
version = os.getenv('VERSION')
origins = os.getenv('ORIGINS')

# Initialize the app
app = FastAPI(
    title= os.getenv('3EYE_TITLE') ,
    version=version,
    description= os.getenv('3EYE_DESCRIPTION'),
    root_path=f"{os.getenv('3EYE_BASE_URL')}/{version}"
)

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins,
)



# Include routers
app.include_router(admin_router, prefix=f"{os.getenv('ADMIN_ROUTER_BASE_URL')}", tags=['admin'])
