from fastapi import APIRouter
from app.constants.api_constants import TEST
from app.constants.string_constants import STATUS,RUN

admin_router = APIRouter()

@admin_router.get(TEST)
async def test():
    return {STATUS: RUN}