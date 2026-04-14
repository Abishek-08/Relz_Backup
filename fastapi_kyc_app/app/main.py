from fastapi import FastAPI, UploadFile, File
from app.tasks import process_face

app = FastAPI()

@app.post("/verify")
async def verify_face(file: UploadFile = File(...)):
    content = await file.read()
    task = process_face.delay(content.decode("utf-8"))
    return {"task_id": task.id}

@app.get("/task/{task_id}")
def get_task_result(task_id: str):
    result = process_face.AsyncResult(task_id)
    return {"status": result.status, "result": result.result}
