from fastapi import APIRouter,Response
from app.repository.forklift_repo import get_violation_history,delete_violation_record
from app.utilis.forklift_moniter_utils import serialize_document
from fastapi.responses import StreamingResponse
from app.constants.api_constants import VIOLATIONS,FORKLIFT_PROCESS_FRAME,DELETE_VIOLATIONS,LATEST_COUNTS
from app.Applications.Forklift_Moniter.forklift_main import process_frame,latest_counts


forklift_router = APIRouter()

@forklift_router.get(VIOLATIONS)
async def get_forklift_violations_history():
    """
    This End Point used for get all the Violation Record : Forklift
    Returns:
       list violation data's
    """
    violations = await get_violation_history()
    return [await serialize_document(v) for v in violations] # Convert ObjectId to string


@forklift_router.delete(DELETE_VIOLATIONS)
async def delete_forklift_violation(id :str):
   """
   Delete a single forklift violation entry by ID.
   """
   return delete_violation_record(id)

@forklift_router.get(LATEST_COUNTS)
async def get_latest_counts():
    """
    Fetch the latest detected counts of forklifts and persons.
    """
    return latest_counts

@forklift_router.get(FORKLIFT_PROCESS_FRAME)
async def process_frame_endpoint():
    """
    Endpoint to process a single video frame.
    """
    return StreamingResponse(process_frame(), media_type="multipart/x-mixed-replace; boundary=frame")
