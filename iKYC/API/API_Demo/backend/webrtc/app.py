# fastapi-webrtc/app.py
import base64
import json
import asyncio
import cv2
import uuid
from typing import Dict
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from kafka_producer import get_producer, send_frame_to_kafka
from kafka_results_consumer import start_results_consumer
 
 
app = FastAPI()
pcs: Dict[str, RTCPeerConnection] = {}
ws_connections: Dict[str, WebSocket] = {}
 
 
class FrameProcessor(VideoStreamTrack):
    def __init__(self, track, session_id: str):
        super().__init__()
        self.track = track
        self.session_id = session_id
        self.counter = 0
 
 
    async def recv(self):
        frame = await self.track.recv()
        # sample frames to control throughput
        self.counter += 1
        if self.counter % 2 != 0:
            return frame
 
 
        img = frame.to_ndarray(format="bgr24")
        success, buffer = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
        if not success:
            return frame
 
 
        b64 = base64.b64encode(buffer).decode('ascii')
        payload = {
        'session_id': self.session_id,
        'timestamp': asyncio.get_event_loop().time(),
        'frame_jpeg_b64': b64
        }
 
 
        # fire-and-forget send; get_producer() ensures init
        asyncio.create_task(send_frame_to_kafka(payload))
 
 
        return frame
 
 
@app.post('/offer')
async def offer(request: Request):
    data = await request.json()
    sdp = data.get('sdp')
    session_id = data.get('session_id') or str(uuid.uuid4())
 
    pc = RTCPeerConnection()
    pcs[session_id] = pc
 
 
    @pc.on('track')
    def on_track(track):
        if track.kind == 'video':
            proc = FrameProcessor(track, session_id)
            pc.addTrack(proc)
 
 
    offer = RTCSessionDescription(sdp=sdp['sdp'], type=sdp['type'])
    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
 
 
    return {'session_id': session_id, 'sdp': {'type': pc.localDescription.type, 'sdp': pc.localDescription.sdp}}
 
 
@app.post('/hangup')
async def hangup(data: Dict):
    session_id = data.get('session_id')
    pc = pcs.pop(session_id, None)
    if pc:
        await pc.close()
    ws = ws_connections.pop(session_id, None)
    if ws:
        await ws.close()
    return {'status': 'closed'}
 
 
@app.websocket('/ws/{session_id}')
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    ws_connections[session_id] = websocket
    try:
        while True:
            # option to receive pings/commands
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_connections.pop(session_id, None)
 
 
async def forward_results_loop():
    async for result in start_results_consumer():
        session_id = result.get('session_id')
        if not session_id:
            continue
        ws = ws_connections.get(session_id)
        if ws:
            # send without awaiting to avoid blocking the consumer loop
            asyncio.create_task(ws.send_json(result))
 
 
@app.on_event('startup')
async def startup_event():
    # start background forwarder
    asyncio.create_task(forward_results_loop())
 
 
@app.on_event('shutdown')
async def shutdown_event():
    for pc in list(pcs.values()):
        await pc.close()
 
 
