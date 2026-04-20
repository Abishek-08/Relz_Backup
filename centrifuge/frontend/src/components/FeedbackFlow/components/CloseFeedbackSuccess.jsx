import React from "react";
import { CheckCircle } from "lucide-react";

export default function CloseFeedbackSuccess() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg mx-4 text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Feedback Session Completed!</h2>
        <p className="text-gray-600 text-lg mb-6">Thank you for collecting valuable feedback. Redirecting...</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
        </div>
        <p className="text-sm text-gray-500">Redirecting in 3 seconds</p>
      </div>
    </div>
  );
}
