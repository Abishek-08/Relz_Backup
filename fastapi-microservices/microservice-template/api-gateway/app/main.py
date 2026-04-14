# app/main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
import httpx
from app.logger.logger import get_service_logger
 
app = FastAPI(
    title="API Gateway",
    version="1.0.0",
    description="Gateway routing to microservices"
)
 
# Registered microservicesv
services = {
    "detect": "http://localhost:8080",
    "doc": "http://localhost:8090",
    "springboot":"http://localhost:8900"
}
 
# Forward the request
async def forward_request(service_name: str, service_url: str, method: str, path: str, raw_body=None, headers=None):
    logger = get_service_logger(service_name)
 
    async with httpx.AsyncClient() as client:
        url = f"{service_url}{path}"
        logger.info(f"🔁 Forwarding: {method} {url}")
        if raw_body:
            logger.debug(f"📦 Request Body: {raw_body.decode('utf-8', errors='ignore')}")
 
        response = await client.request(method=method, url=url, content=raw_body, headers=headers)
        logger.info(f"✅ Response [{response.status_code}]")
 
        return response
 
# Gateway route handler
@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(service: str, path: str, request: Request):
    if service not in services:
        raise HTTPException(status_code=404, detail="Service not found")
 
    logger = get_service_logger(service)
    logger.info(f"➡️ Incoming: {request.method} /{path}")
 
    raw_body = await request.body()
    headers = dict(request.headers)
 
    response = await forward_request(
        service_name=service,
        service_url=services[service],
        method=request.method,
        path=f"/{path}",
        raw_body=raw_body if raw_body else None,
        headers=headers
    )
 
    try:
        if "application/json" in response.headers.get("content-type", ""):
            return JSONResponse(status_code=response.status_code, content=response.json())
        else:
            return Response(status_code=response.status_code, content=response.content)
    except Exception as e:
        logger.warning(f"⚠️ Failed to parse JSON response: {e}")
        return Response(status_code=response.status_code, content=response.content)
 