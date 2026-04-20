import React, { useRef, useState, useEffect } from "react";

const CameraVideo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    // Get the video stream from the camera
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    startCamera();
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      captureImage();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Capture image from video
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert image to base64
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setImageData(imageDataUrl);

    // Send image data to Flask Backend
    sendImageToBackend(imageDataUrl);
  };

  const sendImageToBackend = async (imageDataUrl) => {
    const response = await fetch(
      "https://pongal-ar-flask-q8p1pxr7h-abishek-ks-projects-f5434f13.vercel.app/upload",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageDataUrl }),
      }
    );
    const data = await response.json();
    console.log("Backend response:", data);
    if (response.status === 200) {
      window.location.href = "https://relevantz.com/";
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraVideo;
