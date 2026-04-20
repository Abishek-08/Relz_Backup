
from app.config import forklift_counters_collection as counters_collection
import cv2

"""  Forklift Moniter util Methods """

from pymongo import ReturnDocument

async def get_next_sequence_value(sequence_name: str):
    counter = await counters_collection.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        return_document=ReturnDocument.AFTER,
        upsert=True,
    )
    return counter["sequence_value"]

# def get_next_sequence_value(sequence_name):
#     """Fetches and increments the sequence value for a given sequence name."""
#     counter = counters_collection.find_one_and_update(
#         {"_id": sequence_name},
#         {"$inc": {"sequence_value": 1}},
#         return_document=True
#     )
#     return counter["sequence_value"]

async def line_intersects_rect(line, x1, y1, x2, y2):
    """Check if a line intersects with a rectangle."""
    rect_lines = [
        ((x1, y1), (x2, y1)),  # Top
        ((x2, y1), (x2, y2)),  # Right
        ((x2, y2), (x1, y2)),  # Bottom
        ((x1, y2), (x1, y1))   # Left
    ]
    for rect_line in rect_lines:
        if cv2.clipLine(rect_line[0] + rect_line[1], line[0], line[1]):
            return True
    return False


async def serialize_document(doc):
    """Convert MongoDB document to JSON serializable format"""
    doc["id"] = str(doc["_id"])  # Convert ObjectId to string
    return doc
