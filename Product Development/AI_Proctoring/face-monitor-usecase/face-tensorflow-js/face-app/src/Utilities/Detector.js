import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawFaceMesh";

export const runDetector = async (video, canvas) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    console.log("Detected Person's FaceMesh coordinates: ", faces);
    const ctx = canvas.getContext("2d");
    requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);
  };
  detect(detector);
};

// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import { drawMesh } from "./drawFaceMesh";

// let prevPosition = null;

// export const runDetector = async (video, canvas) => {
//   const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
//   const detectorConfig = { runtime: "mediapipe" };
//   const detector = await faceLandmarksDetection.createDetector(
//     model,
//     detectorConfig
//   );

//   const detect = async (net) => {
//     const estimationConfig = { flipHorizontal: false };
//     const faces = await net.estimateFaces(video, estimationConfig);

//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (faces.length > 0) {
//       const keypoints = faces[0].keypoints;

//       // Draw face mesh
//       drawMesh(faces[0], ctx);

//       // Analyze face movement
//       detectMovement(keypoints);
//     }

//     requestAnimationFrame(() => detect(net));
//   };

//   detect(detector);
// };

// function detectMovement(keypoints) {
//   const nose = keypoints.find((point) => point.name === "noseTip");
//   const leftEye = keypoints.find((point) => point.name === "leftEye");
//   const rightEye = keypoints.find((point) => point.name === "rightEye");
//   const upperLip = keypoints.find((point) => point.name === "lipsUpperInner");
//   const lowerLip = keypoints.find((point) => point.name === "lipsLowerInner");

//   if (!nose || !leftEye || !rightEye || !upperLip || !lowerLip) return;

//   if (!prevPosition) {
//     prevPosition = {
//       noseX: nose.x,
//       noseY: nose.y,
//       lipDistance: Math.abs(upperLip.y - lowerLip.y),
//     };
//     return;
//   }

//   const dx = nose.x - prevPosition.noseX;
//   const dy = nose.y - prevPosition.noseY;
//   const lipDistance = Math.abs(upperLip.y - lowerLip.y);

//   // Horizontal movement
//   if (dx > 10) {
//     alert("Face moved right");
//   } else if (dx < -10) {
//     alert("Face moved left");
//   }

//   // Vertical movement
//   if (dy < -10) {
//     alert("Face moved upward");
//   }

//   // Talking detection (mouth opening)
//   if (lipDistance - prevPosition.lipDistance > 8) {
//     alert("Talking detected");
//   }

//   // Update previous position
//   prevPosition = {
//     noseX: nose.x,
//     noseY: nose.y,
//     lipDistance,
//   };
// }
