import uvicorn
from fastapi import FastAPI,HTTPException,Response
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from Modal.user import user

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["cement_bag"]
user_collection = db["user"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/test')
async def test():
    return {"status":"User Application is running"}

@app.post('/register')
async def register_user(User:user): # Query the database to retrieve all users
    userData =  user_collection.find_one({'userEmail':User.userEmail},{"_id":0})
    if userData:
        return Response(status_code=422,content='Email is already present')
    else:
        user_collection.insert_one(User.model_dump())
        return Response(status_code=201,content='registation successfull')

    


@app.get('/login/{userName}/{userPassword}')
async def validate_user_login(userName:str,userPassword:str):
    result =  user_collection.find_one({"userName":userName,"userPassword":userPassword},{"_id":0})
    if result:
        return HTTPException(status_code=200,detail=result)
    else:
        raise HTTPException(status_code=422,detail="user is not present")




if __name__ == "__main__":
    uvicorn.run(app, port=8000)