import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { validateDetection } from "../../Utilites/initial_detect";
import { initFaceLandmarker } from "../../Utilites/face_movement_detect";
import {
  facialRecognitionDetection,
  loadModels,
} from "../../Utilites/face_recognition";
import { useSelector } from "react-redux";

const Assessment_Proctoring_AI_Screen = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const referenceDescriptor = useSelector(
    (state) => state.proctoringSlice.snaps.personSnap
  );

  const [warnings, setWarnings] = useState([
    // "No Face Detected",
    // "Face Moved Left",
    // "Mobile Detected",
  ]);

  const runCoco = async () => {
    const net = await cocossd.load();

    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      console.log(obj);

      const ctx = canvasRef.current.getContext("2d");

      validateDetection(obj, video);
      facialRecognitionDetection(video, ctx, referenceDescriptor);
    }
  };

  useEffect(() => {
    runCoco();

    async function start() {
      await initFaceLandmarker();
    }
    start();

    loadModels();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
      {/* Header / Proctor Status */}
      <div className="w-full max-w-5xl mb-4">
        <div className="flex items-center justify-between bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Proctored Assessment
          </h2>
          <div className="text-sm text-green-600 font-medium animate-pulse">
            AI Proctoring Active
          </div>
        </div>
      </div>

      {/* Video + Canvas Area */}
      <div
        className={`relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-lg ${
          warnings.length > 0
            ? "border-4 border-red-500 animate-pulse" // or "animate-pulse-red" if using custom
            : "border-4 border-blue-600"
        } bg-black transition-all duration-300`}
      >
        <Webcam
          ref={webcamRef}
          muted
          audio={false}
          screenshotFormat="image/jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />

        {/* Watermark */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded z-30">
          AI Monitoring Enabled
        </div>
      </div>

      {/* Warning Alert Panel */}
      <div className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {warnings.length > 0 ? (
          warnings.map((warning, idx) => (
            <div
              key={idx}
              className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded shadow-sm text-sm flex items-center gap-2 animate-pulse"
            >
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              {warning}
            </div>
          ))
        ) : (
          <div className="text-green-600 text-sm text-center col-span-2">
            No warnings detected. You’re good!
          </div>
        )}
      </div>

      {/* Instructional Footer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Make sure your face is visible at all times. Proctoring AI is active and
        recording.
      </div>
    </div>
  );
};

export default Assessment_Proctoring_AI_Screen;
