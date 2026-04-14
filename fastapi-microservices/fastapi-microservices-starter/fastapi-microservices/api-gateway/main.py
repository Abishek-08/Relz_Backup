# FastAPI API Gateway
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"msg": "API Gateway running"}
