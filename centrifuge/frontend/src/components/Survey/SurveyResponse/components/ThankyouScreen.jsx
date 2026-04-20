import React from "react";
import GradientBackdrop from "./GradientBackdrop";
import relevantzLogo from "/assets/Relevantz_Blue_Watermark.png";
import r2dcLogo from "/assets/R2DC_final_right_side.png";

export default function ThankYouScreen({ name, countdown, isInternal }) {
  return (
    <div className="kiosk-stage">
      <GradientBackdrop />

      <img
        src={relevantzLogo}
        alt="Left Logo"
        className="fixed left-6 top-1/2 -translate-y-1/2 w-[22vw] max-w-[280px] object-contain pointer-events-none select-none"
      />
      <img
        src={r2dcLogo}
        alt="Right Logo"
        className="fixed right-6 top-1/2 -translate-y-1/2 w-[22vw] max-w-[280px] object-contain pointer-events-none select-none opacity-90"
      />

      {/* Center content */}
      <div className="fixed inset-0 flex items-center justify-center z-[50]">
        <div className="text-center text-gray-800 max-w-2xl mx-auto p-6 sm:p-8">
          <div className="mb-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-5xl sm:text-6xl">🎉</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 text-center">
              Thank You
              {isInternal && name ? (
                <div className="text-2xl sm:text-3xl font-medium mt-2">
                  {name}
                </div>
              ) : null}
            </h1>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-700">
              Your response has been saved successfully.
            </p>
            <p className="text-lg sm:text-xl text-gray-600">
              We truly appreciate your valuable input and time.
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 sm:p-6">
            {isInternal && (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 16.17l-3.88-3.88L3.7 13.71 9 19l12-12-1.41-1.41z" />
                </svg>
                <p className="text-base sm:text-lg font-semibold">
                  Please Confirm your responses via Email
                </p>
              </div>
            )}
            <p
              className={`text-base sm:text-lg text-gray-700 ${isInternal ? "mt-3 sm:mt-4" : ""}`}
            >
              Closing in{" "}
              <span className="font-bold text-[#274c77]">{countdown}</span>{" "}
              seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
