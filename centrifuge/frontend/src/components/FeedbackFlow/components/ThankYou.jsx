import React from "react";
import { CheckCircle } from "lucide-react";

export default function ThankYou({ countdown, isAnonymous, userInfo, emailSuggestions, assets }) {
  const { relevantzWatermark, testlogo } = assets;
  const matched = emailSuggestions.find((x) => x.email === userInfo.email);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 flex items-center justify-center z-[60]">
      <div className="absolute inset-0 z-50 flex items-center justify-between px-12">
        <img src={relevantzWatermark} alt="Left Logo" className="object-contain pointer-events-none select-none w-[18vw] max-w-[300px]" />
        <img src={testlogo} alt="Right Logo" className="object-contain pointer-events-none select-none opacity-80 w-[18vw] max-w-[300px]" />
      </div>

      <div className="text-center text-gray-800 max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-800 text-center">
            Thank You
            {!isAnonymous && (
              <div className="text-3xl font-medium mt-2">
                {matched?.fullName ?? userInfo.email}
              </div>
            )}
          </h1>
          <p className="text-xl mb-6 text-gray-700">Your response has been saved successfully.</p>
          <p className="text-xl text-gray-600">We truly appreciate your valuable input and time.</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 inline-block">
          {!isAnonymous && (
            <div className="flex items-center justify-center space-x-2 text-green-700 mb-3">
              <CheckCircle size={24} />
              <p className="text-lg font-semibold">Please Confirm your Feedback via Email</p>
            </div>
          )}
          <p className={`text-lg text-gray-700 ${!isAnonymous ? "mt-2" : ""}`}>
            Closing in <span className="font-bold text-[#274c77]">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
