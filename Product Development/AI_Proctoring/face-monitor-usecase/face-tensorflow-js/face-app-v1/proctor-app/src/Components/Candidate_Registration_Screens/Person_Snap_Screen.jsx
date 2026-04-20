import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeStepReducer,
  personSnapReducer,
} from "../../Redux/proctoringSlice";
import {
  createReferenceDescriptor,
  loadModels,
} from "../../Utilites/face_recognition";
import { useNavigate } from "react-router-dom";

const Person_Snap_Screen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [capturedImageFrame, setCapturedImageFrame] = useState(null);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    startVideo();
  }, [capturedImage]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      webcamRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const confirmCapture = async () => {
    setIsSubmitting(true);

    setTimeout(async () => {
      const descriptor = await createReferenceDescriptor(capturedImageFrame);
      console.log(descriptor);
      if (descriptor) {
        setReferenceDescriptor(descriptor);

        // // Convert to 2D tensor (array form for Redux)
        // const tensor = tf.browser.fromPixels(webcamRef.current.video);
        // const tensorData = await tensor.array();
        dispatch(personSnapReducer(descriptor));
        // localStorage.setItem(
        //   "referenceDescriptor",
        //   JSON.stringify(Array.from(descriptor))
        // );
        dispatch(changeStepReducer("step-3"));
        navigate("/assessment");
      } else {
        alert("Retake the face");
      }

      setIsSubmitting(false);
    }, 1000);
  };

  const retakeCapture = () => {
    setCapturedImage(null);
    setCapturedImageFrame(null);
  };

  const captureFace = () => {
    const videoElement = webcamRef.current;

    if (!videoElement) {
      console.error("Video element not available.");
      return;
    }

    const canvas = document.createElement("canvas");

    // ✅ Set canvas size to match video resolution
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");
    const base64 = dataURL.split(",")[1];

    setCapturedImage(base64);
    setCapturedImageFrame(videoElement);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full bg-gray-100 p-4 rounded-2xl shadow-lg">
      {/* Instructions - Lighting */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Place Yourself at Proper Lighting
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Don’t wear any mask, cap, goggle/sunglass, headphone, or earphone.
        </p>
        <div className="flex justify-center">
          <img
            src="/src/assets/proper-light.png"
            alt="lighting instruction"
            width="300"
          />
        </div>
      </div>

      {/* Instructions - Angle */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Place Yourself at Proper Angle
        </h2>
        <ul className="text-center text-sm text-gray-600 mb-6 space-y-1">
          <li>Don’t hide your face</li>
          <li>Ensure that no one else is with you during assessment</li>
        </ul>
        <div className="flex justify-center">
          <img
            src="/src/assets/webcam-focus.png"
            alt="focus instruction"
            width="300"
          />
        </div>
      </div>

      {/* Webcam / Capture Panel */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Capture Your Face
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {capturedImage
            ? "Review your captured face. Confirm to proceed or retake if needed."
            : "Place yourself centered in the frame and click Capture."}
        </p>

        <div className="relative flex justify-center mb-6">
          {!capturedImage ? (
            <>
              <div>
                <video
                  className="relative rounded-xl  border border-gray-300 shadow w-full max-w-xs"
                  ref={webcamRef}
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              <canvas className="absolute" ref={canvasRef} />
            </>
          ) : (
            <img
              src={`data:image/jpeg;base64,${capturedImage}`}
              alt="Captured"
              className="rounded-xl border border-gray-300 shadow w-full max-w-xs"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          {!capturedImage ? (
            <button
              onClick={captureFace}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-200"
            >
              Capture
            </button>
          ) : (
            <>
              <button
                onClick={retakeCapture}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-5 rounded-lg shadow transition-all duration-200"
              >
                Retake
              </button>
              <button
                onClick={confirmCapture}
                disabled={isSubmitting}
                className={`${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-medium py-2 px-5 rounded-lg shadow transition-all duration-200`}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Person_Snap_Screen;
