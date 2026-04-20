import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg border-r border-gray-200 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            <img src="/src/assets/third_logo_eye.jpeg" alt="" />
          </h2>
          <nav className="space-y-4">
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
            >
              Exams
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
            >
              Candidates
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
            >
              Reports
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition"
            >
              Settings
            </a>
          </nav>
        </div>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-md hover:scale-105 transform transition">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Dashboard</h1>
            <p className="text-gray-500">Configure and monitor exam rules</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition">
              AK
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-sm">Active Exams</p>
            <h3 className="text-3xl font-bold">12</h3>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-sm">Candidates Online</p>
            <h3 className="text-3xl font-bold">245</h3>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-sm">Violations Today</p>
            <h3 className="text-3xl font-bold">37</h3>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-sm">Cameras Active</p>
            <h3 className="text-3xl font-bold">98%</h3>
          </div>
        </div>

        {/* Config Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Face Monitoring */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.01] transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              👤 Face Monitoring
            </h2>

            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700">Head Rotation Detection</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex">
                <p className="text-gray-600 mr-2">Left:</p>

                <input
                  type="checkbox"
                  className="w-6 h-6 accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex">
                <p className="text-gray-600 mr-2">Right:</p>
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex">
                <p className="text-gray-600 mr-2">Upward:</p>
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex">
                <p className="text-gray-600 mr-2">Talking:</p>
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700">Face Verification</label>
              <select className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                <option>On Login Only</option>
                <option>Continuous</option>
                <option>Periodic</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700">Two Persons Detection</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Environment Monitoring */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.01] transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              🌎 Environment Monitoring
            </h2>

            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700">Mobile Phone Detection</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700">Noise Detection</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Noise Sensitivity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Environment Monitoring */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.01] transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              🌎 Other Configurations
            </h2>

            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700">Document Required</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="mt-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🚨 Recent Alerts
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Two persons detected</span>
              <span className="text-red-600 font-medium">Exam #23</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Noise level exceeded</span>
              <span className="text-red-600 font-medium">Exam #17</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">Face mismatch detected</span>
              <span className="text-red-600 font-medium">Exam #12</span>
            </li>
          </ul>
        </div>

        {/* Save Config */}
        <div className="mt-8 flex justify-end">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition">
            💾 Save Configuration
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
