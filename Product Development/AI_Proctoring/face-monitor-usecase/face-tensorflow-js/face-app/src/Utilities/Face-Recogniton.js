// import * as faceapi from "face-api.js";

// const MODEL_URL = "/models";

// Promise.all([
//   faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
//   faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//   faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
// ])
//   .then((val) => {
//     // console here gives an array of undefined
//     console.log(val);
//     console.log("Model loaded");
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log("model not loaded");
//   });

// export const facialRecognitionDetection = async (video, canvas) => {
//   const displaySize = { width: video.videoWidth, height: video.videoHeight };
//   faceapi.matchDimensions(canvas, displaySize);

//   const detections = await faceapi
//     .detectAllFaces(video)
//     .withFaceLandmarks()
//     .withFaceDescriptors();

//   const resized = faceapi.resizeResults(detections, displaySize);
//   faceapi.draw.drawDetections(canvas, resized);
//   faceapi.draw.drawFaceLandmarks(canvas, resized);

//   const inputImage = await faceapi.fetchImage("/path/to/input/image.jpg"); // Replace with your input image


// };




// src/detector.js
import * as faceapi from "face-api.js";
 
const MODEL_URL = "/models";
 
export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    console.log("Models loaded successfully");
  } catch (error) {
    console.error("Model loading failed:", error);
  }
};
 
export const createReferenceDescriptor = async (video) => {
  const detection = await faceapi
    .detectSingleFace(video)
    .withFaceLandmarks()
    .withFaceDescriptor();
 
  if (!detection) {
    console.warn("No face detected for reference");
    return null;
  }
  return detection.descriptor;
};

export const facialRecognitionDetection = async (video, canvas, referenceDescriptor) => {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);
 
  const detections = await faceapi
    .detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceDescriptors();
 
  const resized = faceapi.resizeResults(detections, displaySize);
  faceapi.draw.drawDetections(canvas, resized);
  faceapi.draw.drawFaceLandmarks(canvas, resized);
 
  if (referenceDescriptor && detections.length > 0) {
    const faceMatcher = new faceapi.FaceMatcher(referenceDescriptor, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
    console.log("Match result:", bestMatch.toString());
 
    if (bestMatch.label !== "unknown") {
      console.log("✅ Student verified");
    } else {
      console.warn("❌ Face mismatch! Not the same student.");
    }
  }
};
 