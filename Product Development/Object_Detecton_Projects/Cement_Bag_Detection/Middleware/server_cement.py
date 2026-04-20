from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from Modal.cement import cement
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["cement_bag"]
cement_collection = db["cement"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    return {"Application Name":"Cement Bag Counter","status":"Running"}

@app.post("/insert")
async def update_cement_count(create: cement):
    result = cement_collection.insert_one(create.dict())
    return str(result.inserted_id)
    
@app.get('/getbag/{id}')
async def get_cement_bag(id: str):
    print(id)
    result = cement_collection.find_one({"_id":ObjectId(id)},{"_id": 0})
    if result:
        return result
    else:
        raise HTTPException(status_code=404,detail="Cement Bag is not found")

@app.put("/updatebag/{id}",status_code=200,response_description="Updation success")
async def update_cement_bag(id: str,updateData: cement):
    updated_cement = updateData.model_dump(exclude_unset=True)
    result = cement_collection.update_one({"_id":ObjectId(id)},{"$set":updated_cement},upsert=True)
    print("result: ",result.modified_count)
    if result.modified_count == 0:
        raise HTTPException(status_code=512,detail="Updation Failure")

@app.delete("/deletebag/{id}",status_code=200)
async def delete_cement_bag(id: str):
    result = cement_collection.delete_one({"_id":ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404,detail="cement is not found")
    



if __name__ == "__main__":
    uvicorn.run(app, host="000.000.00.000", port=8000)