// Renderer logic: start/stop local camera, simulate guest using screen capture.
const localVideo = document.getElementById("localVideo");
const screenVideo = document.getElementById("screenVideo");
const startHostBtn = document.getElementById("startHost");
const stopHostBtn = document.getElementById("stopHost");
const guestOnBtn = document.getElementById("simulateGuestOn");
const guestOffBtn = document.getElementById("simulateGuestOff");

let localStream = null;
let screenStream = null;
let websocket = null;

async function startLocalCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localVideo.srcObject = localStream;
    console.log("Local camera started");
    sendEventToServer({ type: "host_camera_started" });
  } catch (err) {
    console.error("getUserMedia error", err);
    alert("Unable to access camera: " + err.message);
  }
}

function stopLocalCamera() {
  if (localStream) {
    localStream.getTracks().forEach((t) => t.stop());
    localStream = null;
    localVideo.srcObject = null;
    console.log("Local camera stopped");
    sendEventToServer({ type: "host_camera_stopped" });
  }
}

async function startScreenCapture() {
  try {
    // Capture entire screen — in a real embed you'd capture the guest app window if possible.
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    screenVideo.srcObject = screenStream;
    console.log("Screen capture started");
    sendEventToServer({ type: "guest_video_started" });

    // Example: periodically send a very low-res thumbnail to server (disabled by default).
    // startThumbnailLoop();
  } catch (err) {
    console.error("getDisplayMedia error", err);
    alert("Unable to capture screen: " + err.message);
  }
}

function stopScreenCapture() {
  if (screenStream) {
    screenStream.getTracks().forEach((t) => t.stop());
    screenStream = null;
    screenVideo.srcObject = null;
    console.log("Screen capture stopped");
    sendEventToServer({ type: "guest_video_stopped" });
  }
}

// Buttons
startHostBtn.addEventListener("click", () => startLocalCamera());
stopHostBtn.addEventListener("click", () => stopLocalCamera());
guestOnBtn.addEventListener("click", async () => {
  // Give up camera to guest: stop local camera, then start screen capture (surface observation)
  stopLocalCamera();
  await startScreenCapture();
});
guestOffBtn.addEventListener("click", () => {
  // Guest finished: stop screen capture and reclaim camera
  stopScreenCapture();
  startLocalCamera();
});

// Simple WebSocket signaling to backend
function setupWebSocket() {
  try {
    websocket = new WebSocket("ws://localhost:8040/ws/proctor");
    websocket.onopen = () => console.log("WS connected");
    websocket.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        console.log("WS message", msg);
      } catch (e) {}
    };
    websocket.onclose = () => console.log("WS closed");
  } catch (e) {
    console.warn("WS setup failed", e);
  }
}

function sendEventToServer(eventObj) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(eventObj));
  }
  // Also send to main via electronAPI as demonstration
  if (window.electronAPI) {
    window.electronAPI.sendToMain(JSON.stringify(eventObj));
  }
}

// init
setupWebSocket();
