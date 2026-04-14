from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from fastapi.background import BackgroundTasks
import requests
from Modal.Order import Order
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/test')
async def test():
    return {'message':'Payment service is running'}

@app.post('/order')
async def create(request: Request, backgroundTask: BackgroundTasks):
    body = await request.json()

    req = requests.get("http://localhost:8080/products/%s" % body['id'])

    product = req.json()

    order = Order(
        product_Id = body['id'],
        price = product['price'],
        fee = 0.2 * product['price'],
        total = 1.2 * product['price'],
        quantity = body['quantity'],
        status = 'pending'
    )

    order.save()
    backgroundTask.add_task(order_completed, order)
    return order



def order_completed(order: Order):
    time.sleep(5)
    order.status = 'completed'
    order.save()
    

@app.get('/order/{pk}')
async def getOrderById(pk:str):
    return Order.get(pk)