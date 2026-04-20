from fastapi import APIRouter,Response
from app.db.schema.User_schema import Users
from app.db.models.user_model import User
from app.db.dependencies.mysql_dependency import db_sql_dependency

user_router = APIRouter()


@user_router.get('/test')
async def test_user():
    return {'status':'user controller is running'}

@user_router.post('/')
async def register_user(user:Users,db:db_sql_dependency):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()

@user_router.get('/{userId}')
async def get_user_byid(userId:int,db:db_sql_dependency):
    user = db.query(User).filter(User.userId == userId).first()
    if user is not None:
        return user

@user_router.delete('/{userId}')
async def delete_user_byid(userId:int,db:db_sql_dependency):
    user = db.query(User).filter(User.userId == userId).first()
    if user is not None:
        db.delete(user)
        db.commit()

@user_router.put('/{userId}')
async def update_user_byid(userId:int,user:Users,db:db_sql_dependency):
    db.query(User).filter(User.userId == userId).update(user.dict())
    db.commit()
