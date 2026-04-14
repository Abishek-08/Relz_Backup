from fastapi import FastAPI, UploadFile, File
from app.tasks import process_face,calculateSum,odd_even
from typing import List
from pydantic import BaseModel

app = FastAPI()

class NumberList(BaseModel):
    numbers: List[int]

@app.post("/verify")
async def verify_face(file: UploadFile = File(...)):
    content = await file.read()
    task = process_face.delay(content.decode("utf-8"))
    return {"task_id": task.id}

@app.get("/task/{task_id}")
def get_task_result(task_id: str):
    result = process_face.AsyncResult(task_id)
    return {"status": result.status, "result": result.result}

@app.get("/test/{number}")
def test(number: int):
    result = calculateSum.delay(number)
    print({'result':result.id})
    print(result.ready())
    print(result.status)
    return {'result':result.get()}

 
@app.post("/oddEvenTask")
def odd_even_task(data: NumberList):
    task = odd_even.delay(data.numbers)
    return {"taskId": task.id}
 
@app.get("/oddEvenResult/{task_id}")
def get_task_result(task_id: str):
    result = odd_even.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.get() if result.ready() else None
    }