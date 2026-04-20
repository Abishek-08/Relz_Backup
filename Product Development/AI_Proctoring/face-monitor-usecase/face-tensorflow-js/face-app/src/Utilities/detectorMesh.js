// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// let faceLandmarker;
// let runningMode = "VIDEO";
// let lastVideoTime = -1;

// export async function initFaceLandmarker() {
//   const filesetResolver = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );
//   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       delegate: "GPU",
//     },
//     outputFaceBlendshapes: true,
//     runningMode,
//     numFaces: 1,
//   });
// }

// export async function detectFaceMesh(video, canvas) {
//   if (!faceLandmarker) {
//     console.warn("FaceLandmarker not initialized");
//     return;
//   }

//   const ctx = canvas.getContext("2d");
//   const drawingUtils = new DrawingUtils(ctx);

//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   const startTimeMs = performance.now();
//   if (lastVideoTime !== video.currentTime) {
//     lastVideoTime = video.currentTime;
//     const results = faceLandmarker.detectForVideo(video, startTimeMs);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     if (results.faceLandmarks) {
//       for (const landmarks of results.faceLandmarks) {
//         drawLandmarks(drawingUtils, landmarks);
//       }
//     }

//     return results.faceBlendshapes || [];
//   }
// }

// function drawLandmarks(drawingUtils, landmarks) {
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_TESSELATION,
//     { color: "#C0C0C070", lineWidth: 1 }
//   );
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
//     { color: "#FF3030" }
//   );
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
//     { color: "#30FF30" }
//   );
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
//     { color: "#E0E0E0" }
//   );
//   drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
//     color: "#E0E0E0",
//   });
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
//     { color: "#FF3030" }
//   );
//   drawingUtils.drawConnectors(
//     landmarks,
//     FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
//     { color: "#30FF30" }
//   );
// }

// ----------------------------------------------------------------------------------------------

// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const { FaceLandmarker, FilesetResolver } = vision;

// let faceLandmarker;
// let runningMode = "VIDEO";
// let lastVideoTime = -1;
// let prevState = null;
// let lastAlertTime = 0;

// export async function initFaceLandmarker() {
//   const filesetResolver = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );
//   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       delegate: "GPU",
//     },
//     outputFaceBlendshapes: true,
//     runningMode,
//     numFaces: 1,
//   });
// }

// export async function detectFaceMesh(video, canvas) {
//   if (!faceLandmarker) {
//     console.warn("FaceLandmarker not initialized");
//     return;
//   }

//   const ctx = canvas.getContext("2d");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   const startTimeMs = performance.now();
//   if (lastVideoTime !== video.currentTime) {
//     lastVideoTime = video.currentTime;
//     const results = faceLandmarker.detectForVideo(video, startTimeMs);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (results.faceLandmarks?.length) {
//       const face = results.faceLandmarks[0];
//       detectMovements(face);
//     }
//   }
// }

// // Movement detection using landmark analysis
// function detectMovements(landmarks) {
//   const now = Date.now();
//   if (now - lastAlertTime < 1500) return; // alert cooldown

//   // Landmark reference points
//   const noseTip = landmarks[1]; // Nose tip
//   const upperLip = landmarks[13]; // Upper inner lip
//   const lowerLip = landmarks[14]; // Lower inner lip

//   if (!prevState) {
//     prevState = {
//       noseX: noseTip.x,
//       noseY: noseTip.y,
//       lipDistance: Math.abs(upperLip.y - lowerLip.y),
//     };
//     return;
//   }

//   const dx = noseTip.x - prevState.noseX;
//   const dy = noseTip.y - prevState.noseY;
//   const mouthOpen = Math.abs(upperLip.y - lowerLip.y);

//   const moveThreshold = 0.03; // approx 3% of frame width
//   const talkThreshold = 0.015; // for mouth open detection

//   if (dx > moveThreshold) {
//     alert("Face moved RIGHT");
//     lastAlertTime = now;
//   } else if (dx < -moveThreshold) {
//     alert("Face moved LEFT");
//     lastAlertTime = now;
//   }

//   if (dy < -0.02) {
//     alert("Face moved UPWARD");
//     lastAlertTime = now;
//   }

//   if (mouthOpen - prevState.lipDistance > talkThreshold) {
//     alert("Talking detected");
//     lastAlertTime = now;
//   }

//   // Save current values for next frame comparison
//   prevState = {
//     noseX: noseTip.x,
//     noseY: noseTip.y,
//     lipDistance: mouthOpen,
//   };
// }

// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const { FaceLandmarker, FilesetResolver } = vision;

// let faceLandmarker;
// let runningMode = "VIDEO";
// let lastVideoTime = -1;

// let movementHistory = [];
// let lastAlertDirection = null;
// let lastAlertTime = 0;

// export async function initFaceLandmarker() {
//   const filesetResolver = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );
//   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       delegate: "GPU",
//     },
//     outputFaceBlendshapes: true,
//     runningMode,
//     numFaces: 1,
//   });
// }

// export async function detectFaceMesh(video, canvas) {
//   if (!faceLandmarker) {
//     console.warn("FaceLandmarker not initialized");
//     return;
//   }

//   const ctx = canvas.getContext("2d");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   const startTimeMs = performance.now();
//   if (lastVideoTime !== video.currentTime) {
//     lastVideoTime = video.currentTime;
//     const results = faceLandmarker.detectForVideo(video, startTimeMs);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (results.faceLandmarks?.length) {
//       const face = results.faceLandmarks[0];
//       detectMovements(face);
//     }
//   }
// }

// function detectMovements(landmarks) {
//   const now = Date.now();
//   const nose = landmarks[1]; // Nose tip
//   const upperLip = landmarks[13]; // Upper inner lip
//   const lowerLip = landmarks[14]; // Lower inner lip

//   if (!nose || !upperLip || !lowerLip) return;

//   // Add current movement to history (keep last 10 frames)
//   movementHistory.push({
//     x: nose.x,
//     y: nose.y,
//     lipDistance: Math.abs(upperLip.y - lowerLip.y),
//   });
//   if (movementHistory.length > 10) movementHistory.shift();

//   if (movementHistory.length < 5) return;

//   const avgStart = movementHistory[0];
//   const avgNow = movementHistory[movementHistory.length - 1];

//   const dx = avgNow.x - avgStart.x;
//   const dy = avgNow.y - avgStart.y;
//   const mouthChange = avgNow.lipDistance - avgStart.lipDistance;

//   // Movement thresholds
//   const moveThreshold = 0.025; // ~2.5% of width
//   const talkThreshold = 0.015;
//   const cooldown = 2000; // 2 seconds

//   // Avoid alert spam
//   if (now - lastAlertTime < cooldown) return;

//   // LEFT/RIGHT detection
//   if (dx > moveThreshold && lastAlertDirection !== "right") {
//     alert("Face moved RIGHT");
//     lastAlertTime = now;
//     lastAlertDirection = "right";
//   } else if (dx < -moveThreshold && lastAlertDirection !== "left") {
//     alert("Face moved LEFT");
//     lastAlertTime = now;
//     lastAlertDirection = "left";
//   }

//   // UP detection (no down)
//   if (dy < -moveThreshold && lastAlertDirection !== "up") {
//     alert("Face moved UPWARD");
//     lastAlertTime = now;
//     lastAlertDirection = "up";
//   }

//   // TALKING detection (doesn't depend on direction)
//   if (mouthChange > talkThreshold) {
//     alert("Talking detected");
//     lastAlertTime = now;
//     lastAlertDirection = "talk";
//   }
// }

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

export async function detectFaceMesh(video, canvas, callback) {
  if (!faceLandmarker) {
    console.warn("FaceLandmarker not initialized");
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    const results = faceLandmarker.detectForVideo(video, startTimeMs);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.faceLandmarks?.length) {
      noFaceCount = 0;
      detectMovements(results.faceLandmarks[0], callback);
    } else {
      noFaceCount++;
      if (noFaceCount >= 20 && lastAlertType !== "no_face") {
        callback("No face detected");
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
  const moveThreshold = 0.05; // 3.5% width
  const mouthThreshold = 0.017; // lip opening for talking
  const alertCooldown = 2500;

  if (now - lastAlertTime < alertCooldown) return;

  // Movement classification
  if (dx > moveThreshold && lastAlertType !== "right") {
    callback("Face moved RIGHT");
    updateAlertState("right", now);
  } else if (dx < -moveThreshold && lastAlertType !== "left") {
    callback("Face moved LEFT");
    updateAlertState("left", now);
  }

  if (dy < -moveThreshold && lastAlertType !== "up") {
    callback("Face moved UPWARD");
    updateAlertState("up", now);
  }

  if (
    mouthDelta > mouthThreshold &&
    avgMouthOpen > 0.04 &&
    lastAlertType !== "talking"
  ) {
    callback("Talking detected");
    updateAlertState("talking", now);
  }
}

function updateAlertState(type, time) {
  lastAlertTime = time;
  lastAlertType = type;
}
