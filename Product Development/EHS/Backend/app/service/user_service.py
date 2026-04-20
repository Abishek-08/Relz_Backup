from app.repository.user_repo import register_user_repo,login_user_repo,get_user_byid_repo,get_all_user_repo,update_user_repo,delete_user_byid_repo,get_user_byemail_repo
from sqlalchemy.orm import Session
from app.schemas.users import Users


def register_user_service(user:Users,image,db:Session):
    userResult = get_user_byemail_repo(user.userEmail,db)
    if userResult is None:
        user = Users(userName=user.userName,userEmail=user.userEmail,userPassword=user.userPassword,userGender=user.userGender,userProfile=image)
        return register_user_repo(user,db)
    return None
    

def login_user_service(user:Users,db:Session):
    result = login_user_repo(user,db)
    if result:
        return result
    return None

def get_user_byid_service(userId,db:Session):
    result = get_user_byid_repo(userId,db)
    if result:
        return result
    return None

def get_all_user_service(db:Session):
    result = get_all_user_repo(db)
    if result:
        return result
    return None

def update_user_service(user:Users,db:Session):
    update_user_repo(user,db)

def delete_user_byid_service(userId,db:Session):
    delete_user_byid_repo(userId,db)
