import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "../Utilities/Detector";

const FaceMesh = () => {
  const inputResolution = {
    width: 1080,
    height: 900,
  };
  const videoConstraints = {
    width: inputResolution.width,
    height: inputResolution.height,
    facingMode: "user",
  };

  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current);
    setLoaded(true);
  };

  return (
    <div>
      <Webcam
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ visibility: "visible", position: "absolute" }}
        videoConstraints={videoConstraints}
        onLoadedData={handleVideoLoad}
      />
      <canvas
        ref={canvasRef}
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ position: "absolute" }}
      />
    </div>
  );
};

export default FaceMesh;
