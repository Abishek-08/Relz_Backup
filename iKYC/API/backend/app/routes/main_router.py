import io
import base64
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.logger.logger import get_logger
from PIL import Image, UnidentifiedImageError
from fastapi.responses import JSONResponse
from app.application.Documents_verification.validate_front_document import validate_document, DOCUMENT_CLASSES
from app.application.Documents_verification.validate_back_document import validate_back_document, DOCUMENT_BACK_CLASSES
from app.utilis.blur_validation import is_blurry
from app.application.Face_verification.face_verification import verify_face

 
main_router = APIRouter()
logger = get_logger()

@main_router.get('/test')
async def test():
    logger.info('demo-router is running')
    return {'status': 'demo-router is running'}
 
@main_router.post('/multiplefile')
async def test_multiple_image(files: list[UploadFile]):
    return {"filenames": [file.filename for file in files]}
 
@main_router.post("/validate/front")
async def validate_api(file: UploadFile = File(...), doc_type: str = Form(...)):
    if doc_type not in DOCUMENT_CLASSES:
        raise HTTPException(status_code=400, detail="Unsupported document type.")
 
    valid_classes = DOCUMENT_CLASSES.get(doc_type, set())
    if not valid_classes:
        return JSONResponse(content={"status": "not_supported", "document_type": doc_type})
 
    try:
        # Read uploaded file in memory
        contents = await file.read()
 
        # Blur check
        if is_blurry(contents):
            return JSONResponse(
                content={"status": "blurry", "reason": "Image is too blurry, please re-upload."}
            )
 
        # YOLO validation
        result = validate_document(contents, valid_classes, doc_type)
        return JSONResponse(content=result)
 
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Cannot open the selected image.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
@main_router.post("/validate/back")
async def validate_api(file: UploadFile = File(...), doc_type: str = Form(...)):
    # Check supported type
    if doc_type not in DOCUMENT_BACK_CLASSES:
        return JSONResponse(
            content={"error": f"{doc_type} is mismatch document type"},
            status_code=400
        )
 
    try:
        # Load image directly from uploaded file (in memory)
        image_data = await file.read()
        
         # Blur check
        if is_blurry(image_data):
            return JSONResponse(
                content={"status": "blurry", "reason": "Image is too blurry, please re-upload."}
            )
            
        image = Image.open(io.BytesIO(image_data))
 
    except Exception as e:
        return JSONResponse(content={"error": f"Invalid image: {e}"}, status_code=400)
 
    # Validate
    result = validate_back_document(image, doc_type)  # Removed valid_classes argument
    return result
    
@main_router.post("/validate/full")
async def validate_full_document(
    front_file: UploadFile = File(...),
    back_file: UploadFile = File(...),
    doc_type: str = Form(...)
):
    errors = {}
    front_result = None
    back_result = None

    # Check if doc_type is supported for both front and back
    if doc_type not in DOCUMENT_CLASSES:
        errors["front"] = f"Unsupported front document type: {doc_type}"
    if doc_type not in DOCUMENT_BACK_CLASSES:
        errors["back"] = f"Unsupported back document type: {doc_type}"

    # --- FRONT VALIDATION ---
    if "front" not in errors:
        try:
            front_contents = await front_file.read()

            if is_blurry(front_contents):
                errors["front"] = "Front image is too blurry, please re-upload."
            else:
                valid_front_classes = DOCUMENT_CLASSES.get(doc_type, set())
                if not valid_front_classes:
                    errors["front"] = f"No valid classes found for front document type: {doc_type}"
                else:
                    front_result = validate_document(front_contents, valid_front_classes, doc_type)

        except UnidentifiedImageError:
            errors["front"] = "Cannot open the front image."
        except Exception as e:
            errors["front"] = f"Front validation error: {str(e)}"

    # --- BACK VALIDATION ---
    if "back" not in errors:
        try:
            back_contents = await back_file.read()

            if is_blurry(back_contents):
                errors["back"] = "Back image is too blurry, please re-upload."
            else:
                back_image = Image.open(io.BytesIO(back_contents))
                back_result = validate_back_document(back_image, doc_type)

        except UnidentifiedImageError:
            errors["back"] = "Cannot open the back image."
        except Exception as e:
            errors["back"] = f"Back validation error: {str(e)}"

    # --- FINAL DECISION BASED ON VALIDATION RESULTS ---
    failed_reasons = {}

    # Check front result
    if not front_result or front_result.get("status") != "valid":
        failed_reasons["front"] = front_result or {"error": "Front validation failed or returned unexpected format"}

    # Check back result
    if not back_result or not back_result.get("is_valid", False):
        failed_reasons["back"] = back_result or {"error": "Back validation failed or returned unexpected format"}

    if not errors and not failed_reasons:
        return JSONResponse(content={
            "status": "success",
            "document_type": doc_type,
            "front_validation": front_result,
            "back_validation": back_result
        })
    else:
        return JSONResponse(content={
            "status": "failed",
            "document_type": doc_type,
            "errors": {**errors, **failed_reasons},
            "front_validation": front_result,
            "back_validation": back_result
        }, status_code=400)


    
@main_router.post("/validate/face")
async def face_verification(
    original_document: UploadFile = File(...),
    live_face: UploadFile = File(...)
    ):
    encoded_original_document = base64.b64encode(await original_document.read()).decode('utf-8')
    encoded_live_face = base64.b64encode(await live_face.read()).decode('utf-8')
 
    return verify_face(encoded_original_document, encoded_live_face)
