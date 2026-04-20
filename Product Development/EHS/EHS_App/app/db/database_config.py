from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base


meta = MetaData()

# Connect to MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["ehs_db"]

user_collection = db["users"]
cements_collection = db["cements"]



# Connection to MySQL
engine = create_engine('mysql+pymysql://root:root@localhost:3306/ehs_db')

SessionLocal = sessionmaker(bind=engine,autoflush=False,expire_on_commit=False)

connection = engine.connect()

Base = declarative_base()