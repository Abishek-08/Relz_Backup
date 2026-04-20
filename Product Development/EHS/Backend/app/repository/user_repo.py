from app.models.user import User
from app.schemas.users import Users
from sqlalchemy.orm import Session

def register_user_repo(user_data:Users,db:Session):
    db_user = User(**user_data.dict())  
    db.add(db_user)  
    db.commit()  
    db.refresh(db_user)  
    return db_user

def login_user_repo(user:Users,db:Session):
    return db.query(User).filter(User.userEmail == user.userEmail,User.userPassword == user.userPassword).first()
   

def get_user_byid_repo(userId,db:Session):
    return db.query(User).filter(User.userId == userId).first()
    

def get_all_user_repo(db:Session):
    return db.query(User).all()
    

def update_user_repo(user:Users,db:Session):
    db.query(User).filter(User.userId == user.userId).update(user.dict())
    db.commit()

def delete_user_byid_repo(userId,db:Session):
    user = db.query(User).filter(User.userId == userId).first()
    db.delete(user)
    db.commit()

def get_user_byemail_repo(userEmail,db:Session):
    user = db.query(User).filter(User.userEmail == userEmail).first()
    if user:
        return user
    return None