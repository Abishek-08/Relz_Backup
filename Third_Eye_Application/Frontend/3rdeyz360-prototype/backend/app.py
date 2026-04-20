from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get('/')
async def index():
    return HTMLResponse('<h3>3rdEyZ360 FastAPI signaling backend — WebSocket at /ws/proctor</h3>')

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket('/ws/proctor')
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Log or broadcast events (in a real system, validate/authorize)
            print('Received from client:', data)
            # Echo to all for demonstration
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print('WebSocket disconnected')
