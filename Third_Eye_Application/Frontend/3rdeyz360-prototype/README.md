# 3rdEyZ360 Prototype (Electron + FastAPI)

This prototype demonstrates the **camera give-up / reclaim** flow and **surface-based proctoring** using:
- An Electron front-end that owns the camera (host).
- A simulated "guest video" mode using `getDisplayMedia()` (to stand in for Teams/Meet).
- A FastAPI backend that accepts WebSocket events for simple signaling.

## How it works (prototype)
1. Start the host camera (left video) — 3rdEyZ360 has camera.
2. Click "Simulate Guest Video ON" — renderer stops local camera and starts screen capture (right video). Host gives up camera.
3. During guest video, 3rdEyZ360 can analyze the guest app's video by observing the captured screen.
4. Click "Simulate Guest Video OFF" — screen capture stops and the host reclaims the camera.

## Run the backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Run the Electron app
Make sure you have Node.js and Electron installed.
```bash
cd electron
npm install
npx electron .
```
On some systems you can run `npm start` if you add electron to dependencies.

## Notes and next steps
- In a production integration with MS Teams / Google Meet, wrap/iframe/embed the guest app (or instruct users to join via browser) and capture that window specifically (if policy and technical constraints allow).
- Add authentication and secure signaling for WebSocket.
- If embedding in Chromium/Electron, you can search `desktopCapturer.getSources()` to list windows and pick the guest window by title.
- For performance, send low-resolution thumbnails to the backend for AI processing or run models locally (ONNX/TensorFlow.js).
