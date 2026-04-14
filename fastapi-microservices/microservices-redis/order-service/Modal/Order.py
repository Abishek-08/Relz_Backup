from redis_om import HashModel
from Redis.redisConnection import redis

class Order(HashModel):
    product_Id: str
    price: float
    fee: float
    total: float
    quantity: float
    status: str

    class Meta:
        database = redis