import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

let faceLandmarker;
let runningMode = "VIDEO";
let lastVideoTime = -1;

let movementHistory = [];
let mouthHistory = [];
let lastAlertType = null;
let lastAlertTime = 0;
let noFaceCount = 0;

export async function initFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "CPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1,
  });
}

export async function detectFaceMesh(video, callback) {
  console.log("Detected Face movement");
  if (!faceLandmarker) {
    console.warn("FaceLandmarker not initialized");
    return;
  }

  //   const ctx = canvas.getContext("2d");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;

  const startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    const results = faceLandmarker.detectForVideo(video, startTimeMs);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.faceLandmarks?.length) {
      noFaceCount = 0;
      detectMovements(results.faceLandmarks[0], callback);
    } else {
      noFaceCount++;
      if (noFaceCount >= 20 && lastAlertType !== "no_face") {
        callback("No face detected");
        alert("no face");
        lastAlertTime = Date.now();
        lastAlertType = "no_face";
      }
    }
  }
}

function detectMovements(landmarks, callback) {
  const now = Date.now();
  const nose = landmarks[1];
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];

  if (!nose || !upperLip || !lowerLip) return;

  // Maintain history
  movementHistory.push({ x: nose.x, y: nose.y, ts: now });
  mouthHistory.push(Math.abs(upperLip.y - lowerLip.y));
  if (movementHistory.length > 15) movementHistory.shift();
  if (mouthHistory.length > 15) mouthHistory.shift();

  if (movementHistory.length < 10) return;

  // Get average position difference
  const start = movementHistory[0];
  const end = movementHistory[movementHistory.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const avgMouthOpen =
    mouthHistory.reduce((a, b) => a + b, 0) / mouthHistory.length;
  const mouthDelta = mouthHistory[mouthHistory.length - 1] - mouthHistory[0];

  // Thresholds (tuned for accuracy)
  const moveThreshold = 0.035; // 3.5% width
  const mouthThreshold = 0.01; // lip opening for talking
  const alertCooldown = 2500;

  if (now - lastAlertTime < alertCooldown) return;

  // Movement classification
  if (dx > moveThreshold && lastAlertType !== "right") {
    callback("Face moved RIGHT");
    alert("move right");

    updateAlertState("right", now);
  } else if (dx < -moveThreshold && lastAlertType !== "left") {
    callback("Face moved LEFT");
    alert("left");
    updateAlertState("left", now);
  }

  if (dy < -moveThreshold && lastAlertType !== "up") {
    callback("Face moved UPWARD");
    updateAlertState("up", now);
    alert("upward");
  }

  if (
    mouthDelta > mouthThreshold &&
    avgMouthOpen > 0.04 &&
    lastAlertType !== "talking"
  ) {
    callback("Talking detected");
    updateAlertState("talking", now);
    alert("talking");
  }
}

function updateAlertState(type, time) {
  lastAlertTime = time;
  lastAlertType = type;
}
