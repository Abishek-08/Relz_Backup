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

// Create 1 descriptor from a webcam frame
export const captureSingleDescriptor = async (video) => {
  const detection = await faceapi
    .detectSingleFace(video)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    console.warn("No face detected");
    return null;
  }
  return detection.descriptor;
};

// Match against multiple descriptors
export const facialRecognitionDetection = async (
  video,
  canvas,
  descriptorsArray
) => {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const detections = await faceapi
    .detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceDescriptors();

  const resized = faceapi.resizeResults(detections, displaySize);
  faceapi.draw.drawDetections(canvas, resized);
  faceapi.draw.drawFaceLandmarks(canvas, resized);

  if (descriptorsArray.length > 0 && detections.length > 0) {
    const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
      "student",
      descriptorsArray
    );

    const faceMatcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);
    const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);

    console.log("Match result:", bestMatch.toString());

    if (bestMatch.label !== "unknown") {
      console.log("✅ Student verified");
    } else {
      console.warn("❌ Face mismatch!");
    }
  }
};
