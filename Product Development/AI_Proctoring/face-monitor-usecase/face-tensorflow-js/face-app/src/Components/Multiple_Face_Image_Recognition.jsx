import { useEffect, useRef, useState } from "react";
import {
  captureSingleDescriptor,
  facialRecognitionDetection,
  loadModels,
} from "../Utilities/detectorMultipleFace";

function Multiple_Face_Image_Recognition() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [descriptors, setDescriptors] = useState([]);
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
    setIsCapturing(true);

    const newDescriptor = await captureSingleDescriptor(videoRef.current);
    if (newDescriptor) {
      const updated = [...descriptors, newDescriptor];
      setDescriptors(updated);
      localStorage.setItem(
        "multi_descriptors",
        JSON.stringify(updated.map((d) => Array.from(d)))
      );
      alert(`✅ Face ${updated.length} captured`);

      if (updated.length === 4) {
        alert("✅ 4 face images captured. Student registered!");
        setIsCapturing(false);
      }
    } else {
      alert("❌ Face not detected. Try again.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && descriptors.length === 4) {
        facialRecognitionDetection(
          videoRef.current,
          canvasRef.current,
          descriptors
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [descriptors]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Multi-Face Student Verification</h2>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginTop: 200,
        }}
      >
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

      <button onClick={handleCapture} disabled={descriptors.length > 4}>
        Capture Face {descriptors.length + 1}/4
      </button>
    </div>
  );
}

export default Multiple_Face_Image_Recognition;
