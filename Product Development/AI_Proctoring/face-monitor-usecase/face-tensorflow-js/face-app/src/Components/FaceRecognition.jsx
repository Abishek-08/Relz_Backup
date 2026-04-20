import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  createReferenceDescriptor,
  facialRecognitionDetection,
  loadModels,
} from "../Utilities/Face-Recogniton";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const descriptor = await createReferenceDescriptor(videoRef.current);
    if (descriptor) {
      setReferenceDescriptor(descriptor);
      localStorage.setItem(
        "referenceDescriptor",
        JSON.stringify(Array.from(descriptor))
      );
      alert("✅ Face captured and stored!");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && referenceDescriptor) {
        facialRecognitionDetection(
          videoRef.current,
          canvasRef.current,
          referenceDescriptor
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [referenceDescriptor]);

  return (
    <div>
      <h1>Face Recognitions App</h1>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Student Face Verification</h2>
        <div style={{ position: "relative", display: "inline-block" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="720"
            height="560"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <canvas
            ref={canvasRef}
            width="720"
            height="560"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
        <br />
        <button onClick={handleCapture} disabled={isCapturing}>
          Capture Face
        </button>
      </div>
    </div>
  );
};

export default FaceRecognition;
