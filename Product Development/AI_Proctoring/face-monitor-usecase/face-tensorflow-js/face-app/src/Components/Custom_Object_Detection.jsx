import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRect } from "../Utilities/Utilities";

const Custom_Object_Detection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const isDetectingRef = useRef(false); // to prevent overlapping detection

  // Load the model
  const loadModel = async () => {
    await tf.setBackend("webgl");
    await tf.ready();
    const model = await tf.loadGraphModel("/model_web/model.json");
    modelRef.current = model;
    console.log("✅ Model loaded");
    detectFrame();
  };

  // Main detection loop
  const detectFrame = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      modelRef.current &&
      !isDetectingRef.current
    ) {
      isDetectingRef.current = true;

      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const inputTensor = tf.tidy(() =>
        tf.browser
          .fromPixels(video)
          .resizeNearestNeighbor([640, 640]) // Change if your model expects a different size
          .expandDims(0)
          .div(255.0)
      );

      const prediction = await modelRef.current.executeAsync(inputTensor);

      // TODO: Parse prediction and draw boxes here
      console.log("Prediction:", prediction);

      const ctx = canvasRef.current.getContext("2d");
      //   drawRect(prediction, ctx);

      tf.dispose([inputTensor, prediction]);
      isDetectingRef.current = false;
    }

    // Schedule next frame
    requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        muted
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          margin: "auto",
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          margin: "auto",
          zIndex: 8,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
};

export default Custom_Object_Detection;
