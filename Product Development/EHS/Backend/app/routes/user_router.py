from fastapi import APIRouter,Response,File,UploadFile,Form
from app.schemas.users import Users
from app.constants.string_constants import STATUS,SUCCESS
from app.constants.api_constants import LOGIN,TEST
from sqlalchemy.orm import Session
from app.dependency.mysql_dependency import db_dependency
import base64
from app.service.user_service import register_user_service,login_user_service,get_user_byid_service,get_all_user_service,update_user_service,delete_user_byid_service

user_router = APIRouter()

@user_router.get(TEST)
async def test():
    return {STATUS:"user router is running"}

@user_router.post('/')
async def register_user(
    userEmail: str = Form(...),
    userPassword: str = Form(...),
    userName: str = Form(...),
    userGender: str = Form(...),
    profileUpload: UploadFile = File(None),
    db: Session = db_dependency
):
    try:
        if profileUpload:
            file_content =  await profileUpload.read()
            if len(file_content) > 1048576:
                return Response(status_code=501, content='File size exceed than 1MB')
            encoded_image = base64.b64encode(file_content).decode("utf-8")
            user = Users(userName=userName,userEmail=userEmail,userGender=userGender,userPassword=userPassword)

            if register_user_service(user,encoded_image,db):
                return Response(status_code=200, content=SUCCESS)
            
            return Response(status_code=506,content="user already present")
            
    except Exception as e:
        return Response(status_code=500,content=f'{e}')

@user_router.post(LOGIN)
async def login_user(user:Users,response:Response,db:Session = db_dependency):
    try:
        result = login_user_service(user,db)
        if result is not None:
            response.status_code = 200
            return result
        else:
            response.status_code = 404
            return {STATUS:"Invalid user"}
        
    except Exception as e:
        response.status_code = 500
        return {STATUS:e}
    
@user_router.get('/{userId}')
async def get_user_byid(userId:int,response:Response,db:Session = db_dependency):
    try:
        result = get_user_byid_service(userId,db)
        if result is not None:
            response.status_code = 200
            return result
        else:
            response.status_code = 404
            return {STATUS:"user not found"}
        
    except Exception as e:
        response.status_code = 500
        return {STATUS:e}

@user_router.get('/')
async def get_all_user(response:Response,db:Session = db_dependency):
    try:
        result = get_all_user_service(db)
        if result is not None:
            response.status_code = 200
            return result
        response.status_code = 204
        return {STATUS:"empty userlist"}
    except Exception as e:
        response.status_code = 500
        return {STATUS: f'{e}'}
    
@user_router.put('/')
async def update_user(user:Users,response:Response,db:Session = db_dependency):
    try:
        update_user_service(user,db)
        response.status_code = 200
        return {STATUS:SUCCESS}
    except Exception as e:
        response.status_code = 400
        return {STATUS: f'{e}'}
    
@user_router.delete('/{userId}')
async def delete_user_byid(userId:int,response:Response,db:Session = db_dependency):
    try:
        delete_user_byid_service(userId,db)
        response.status_code = 200
        return {STATUS:SUCCESS}
    except Exception as e:
        response.status_code = 500
        return {STATUS: f'{e}'}

    
