from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

services = {
    "products": "http://localhost:8080",
    "order": "http://localhost:8090"
}

async def forward_request(service_url: str, method: str, path: str, body=None, headers=None):
    async with httpx.AsyncClient() as client:
        url = f"{service_url}{path}"
        response = await client.request(method, url, json=body, headers=headers)
        return response

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(service: str, path: str, request: Request):
    if service not in services:
        raise HTTPException(status_code=404, detail="Service not found")

    service_url = services[service]
    body = await request.json() if request.method in ["POST", "PUT", "PATCH"] else None
    headers = dict(request.headers)
    response = await forward_request(service_url, request.method, f"/{path}", body, headers)
    return JSONResponse(status_code=response.status_code, content=response.json())