import React from "react";
import { Lock } from "lucide-react";

export default function PasswordModal({
  adminPassword,
  setAdminPassword,
  passwordError,
  onClose,
  onVerify,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Enter your password to close feedback session</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#274c77] focus:outline-none transition-all"
            />
          </div>

          {passwordError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{passwordError}</div>}

          <div className="flex space-x-3 pt-4">
            <button onClick={onClose} className="cursor-pointer flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold">
              Cancel
            </button>
            <button onClick={onVerify} disabled={!adminPassword.trim()}
              className="cursor-pointer flex-1 px-4 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold">
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
