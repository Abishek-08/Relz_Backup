from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Modal.Product import Product


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)



@app.get('/test')
async def test():
    return {'message':'Product service is running'}

@app.get('/products')
def all():
    return [format(pk) for pk in Product.all_pks()]


def format(pk: str):
    product = Product.get(pk)

    return {
        'id': product.pk,
        'name': product.name,
        'price': product.price,
        'quantity': product.quantity
    }

@app.post('/products')
async def create(product:Product):
    return product.save()

@app.get('/products/{id}')
async def getById(id:str):
    return Product.get(id)

@app.delete('/products/{id}')
async def deleteById(id: str):
    return Product.delete(id)


