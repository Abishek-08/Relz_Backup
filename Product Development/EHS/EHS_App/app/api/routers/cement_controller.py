from fastapi import APIRouter

cement_router = APIRouter()

@cement_router.get('/test')
async def test():
    return {"status":"cement Router is running"}
