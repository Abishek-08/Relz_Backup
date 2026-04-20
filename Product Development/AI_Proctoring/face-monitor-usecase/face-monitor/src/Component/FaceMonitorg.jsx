import React, { useRef, useEffect, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Camera } from "@mediapipe/camera_utils";

const FaceMonitorg = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              delegate: "GPU",
            },
            numHands: 2,
          }
        );
        setHandLandmarker(landmarker);
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
      }
    };

    initializeMediaPipe();

    return () => {
      if (handLandmarker) {
        handLandmarker.close();
      }
      if (camera) {
        camera.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && handLandmarker) {
      const cam = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && videoRef.current.video) {
            await handLandmarker.detectForVideo(
              videoRef.current,
              Date.now(),
              (results) => {
                if (canvasRef.current) {
                  const canvasCtx = canvasRef.current.getContext("2d");
                  canvasCtx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                  );
                  if (results.landmarks.length > 0) {
                    for (const landmarks of results.landmarks) {
                      for (const landmark of landmarks) {
                        canvasCtx.beginPath();
                        canvasCtx.arc(
                          landmark.x * canvasRef.current.width,
                          landmark.y * canvasRef.current.height,
                          5,
                          0,
                          2 * Math.PI
                        );
                        canvasCtx.fillStyle = "red";
                        canvasCtx.fill();
                      }
                    }
                  }
                }
              }
            );
          }
        },
        width: 640,
        height: 480,
      });
      cam.start();
      setCamera(cam);
    }
  }, [handLandmarker]);
  return (
    <div>
      <video ref={videoRef} width={640} height={480} autoPlay muted />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
};

export default FaceMonitorg;
