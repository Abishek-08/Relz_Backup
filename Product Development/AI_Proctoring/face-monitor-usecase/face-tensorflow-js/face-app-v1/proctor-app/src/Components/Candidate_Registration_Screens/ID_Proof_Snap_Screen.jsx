import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { changeStepReducer, idProofReducer } from "../../Redux/proctoringSlice";

const ID_Proof_Snap_Screen = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const [IDProofImage, setIDProofImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureIDProof = useCallback(() => {
    const screenShotImage = webcamRef.current.getScreenshot();
    setIDProofImage(screenShotImage);
  }, []);

  const confirmIDProof = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      dispatch(idProofReducer(IDProofImage));
      dispatch(changeStepReducer("step-3"));
    }, 1500); // simulate delay
  };

  const retakeIDProof = () => {
    setIDProofImage(null);
  };

  return (
    <div className="grid grid-cols-1 bg-white rounded-2xl shadow-lg gap-6 w-full bg-gray-100 p-4 lg:grid-cols-2 gap-4">
      <div className="z-20  p-6  w-full transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Instruction
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          <ul>
            <li>Place the IDCard closely and clearly to webcam </li>
          </ul>
        </p>

        <div className="relative flex justify-center mb-10">
          <img
            src="/src/assets/ID_Card-1.png"
            height={550}
            width={550}
            alt="light-instruction"
          />
        </div>
      </div>

      <div className={`z-20 p-6 w-full transition-all duration-300`}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Capture your ID-Proof
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {IDProofImage
            ? "Review your captured ID-Card. Confirm to proceed or retake if needed."
            : "Place your ID-Card center in the frame and click capture."}
        </p>

        <div className="relative flex justify-center mb-6">
          {!IDProofImage ? (
            <div className="relative">
              <Webcam
                height={400}
                width={400}
                ref={webcamRef}
                screenshotFormat="image/png"
                className="rounded-xl border border-gray-300 shadow"
                videoConstraints={{
                  facingMode: "user",
                }}
              />
              {/* Camera overlay frame */}

              <div className="absolute bottom-2 right-2 text-xs bg-black text-white px-2 py-1 rounded bg-opacity-50">
                Exam Proctoring
              </div>
            </div>
          ) : (
            <img
              src={IDProofImage}
              alt="Captured ID"
              className="rounded-xl border border-gray-300 shadow w-full max-w-xs"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!IDProofImage ? (
            <button
              onClick={captureIDProof}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-200"
            >
              Capture
            </button>
          ) : (
            <>
              <button
                onClick={retakeIDProof}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-5 rounded-lg shadow transition-all duration-200"
              >
                Retake
              </button>
              <button
                onClick={confirmIDProof}
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
                      className="animate-spin h-4 w-4 mr-1 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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

export default ID_Proof_Snap_Screen;
