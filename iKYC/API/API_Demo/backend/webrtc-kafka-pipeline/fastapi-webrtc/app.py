import os
import asyncio
import base64
import json
import cv2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from kafka_producer import send_frame_to_kafka
from kafka_results_consumer import start_results_consumer

app = FastAPI()
# serve client directory (mounted by docker-compose)
app.mount("/client", StaticFiles(directory="../client"), name="client")

# map session_id -> websocket
ws_connections = {}

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    ws_connections[session_id] = websocket

    # background: forward detection results for this session
    async def forward_results():
        async for result in start_results_consumer():
            sid = result.get("session_id")
            if sid == session_id:
                try:
                    await websocket.send_json(result)
                except Exception:
                    pass

    forward_task = asyncio.create_task(forward_results())

    try:
        while True:
            data = await websocket.receive_text()
            # expect data URL "data:image/jpeg;base64,..."
            if data.startswith("data:"):
                header, b64 = data.split(",", 1)
                payload = {
                    "session_id": session_id,
                    "frame_jpeg_b64": b64
                }
                # produce to kafka asynchronously
                asyncio.create_task(send_frame_to_kafka(payload))
    except WebSocketDisconnect:
        pass
    finally:
        forward_task.cancel()
        ws_connections.pop(session_id, None)

@app.get("/")
async def root():
    return {"msg": "FastAPI WebSocket frame ingestion service. Open /client/index.html for demo."}
