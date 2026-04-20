
from app.config import forklift_violations_collection as violations_collection
from fastapi import HTTPException

async def get_violation_history():
    cursor = violations_collection.find()
    return await cursor.to_list(length=None)


def delete_violation_record(id: str):
    try:
        obj_id = int(id)
        violation = violations_collection.find_one({"_id": obj_id})
        if not violation:
            raise HTTPException(status_code=404, detail="Violation not found")

        violations_collection.delete_one({"_id": obj_id})
        return HTTPException(status_code=200,detail="Violation deleted successfully")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))