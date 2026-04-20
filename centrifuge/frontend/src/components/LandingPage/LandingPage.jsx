import React from "react";

import RelevantZLogo from "/assets/RelevantZLogo.svg";

import { useNavigate } from "react-router-dom";

import logo from "/assets/logo.jpg";

import { LogIn } from "lucide-react";

import ApplicationLogo from "/assets/logo.jpg";

import watermark from "/assets/trace.svg";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginBtnClick = () => {
    navigate("/login");
  };

  const gradientStyle = {
    background: "linear-gradient(90deg, #E01950, #97247E)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const styledName = (
    <>
      <span style={gradientStyle}>L</span>
      <span style={gradientStyle}>i</span>
      <span style={gradientStyle}>v</span>e <span style={gradientStyle}>E</span>
      vent <span style={gradientStyle}>A</span>nalytics{" "}
      <span style={gradientStyle}>A</span>pplication
    </>
  );

  const handleNavigation = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 flex flex-col md:overflow-x-hidden md:overflow-y-auto">
      <div className="inset-0 z-0 flex justof overflow-hidden">
        <img
          src={watermark}
          alt="R2DC Logo"
          style={{
            position: "fixed",
            userSelect: "none",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "40vw",
            height: "100vh",
            objectFit: "contain",
            opacity: 0.2,
            filter:
              "blur(0px) contrast(110%) saturate(100%)       drop-shadow(0 0 2px rgba(0,0,0,0.2))",
            imageRendering: "crisp-edges",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>

      {/* Header */}
      <div className="inset-0 z-0 flex justof overflow-hidden">
        <img
          src={watermark}
          alt="R2DC Logo"
          style={{
            position: "fixed",
            userSelect: "none",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "40vw",
            height: "100vh",
            objectFit: "contain",
            opacity: 0,
            filter:
              "blur(0px) contrast(110%) saturate(100%) drop-shadow(0 0 2px rgba(0,0,0,0.2))",
            imageRendering: "crisp-edges",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>

      <div className="w-full m-0 p-0">
        <header className="w-full px-0">
          <nav
            className="w-full flex justify-between items-center px-4 py-4"
            style={{ backgroundColor: "#274c77" }}
          >
            <div className="relative flex items-center gap-3 group">
              <img
                src={ApplicationLogo}
                alt="Previous Logo"
                className="h-10 w-10 rounded-full object-cover cursor-pointer transition-all duration-200 group-hover:scale-105"
              />

              <img
                src={RelevantZLogo}
                alt="RelevantZ Logo"
                className="h-10 object-contain cursor-pointer transition-all duration-200 group-hover:scale-105"
              />
            </div>

            <button
              className="flex items-center hover:cursor-pointer gap-2 text-white text-sm px-4 py-2 rounded-md border border-white/20 hover:ring-2 hover:ring-white hover:ring-offset-1 transition"
              onClick={handleLoginBtnClick}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </nav>
        </header>
      </div>

      {/* Title */}

      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 mt-8 px-4">
        <div className="w-20 h-20 rounded-full hover:cursor-pointer flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 mb-4 md:mb-0">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 rounded-full object-cover scale-110"
          />
        </div>

        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            <span>LivEAA</span>

            <span className="ml-2 animate-pulse text-[#97247E]">Z360</span>
          </h1>

          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {styledName}
          </h3>
        </div>
      </div>

      <p className="text-lg font-bold text-black-500 max-w-md md:max-w-none mx-auto portrait:mt-4 portrait:text-center">
        AI-Powered Participations Demographics Analysis for Corporate Events
      </p>

      {/* Event Description & Cards */}

      <main className="flex-1 flex items-center justify-center relative px-4 md:px-6 mt-8">
        <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 items-start w-full">
            {/* Left Description */}

            <div className="text-left space-y-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Participations Scope Analytics
                </h2>
              </div>

              <p className="text-black-600 text-lg leading-relaxed max-w-xl text-justify portrait:max-w-full portrait:px-4 portrait:mt-2 portrait:mb-2">
                A unified platform delivering real-time analytics and actionable
                insights into event performance—empowering organizers to monitor
                key metrics, evaluate attendee engagement, and uncover
                opportunities for strategic improvement.
              </p>

              <div className="bg-gradient-to-br from-gray to-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm max-w-xl portrait:max-w-full portrait:px-4">
                <h3 className="text-gray-700 font-semibold text-base mb-3">
                  Track Events:
                </h3>

                <div
                  className="flex flex-wrap gap-2 hover:cursor-pointer"
                  onClick={() => handleNavigation()}
                >
                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-3 py-1 rounded-full text-sm border border-gray-300">
                    🧘 Yoga Day
                  </span>

                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-3 py-1 rounded-full text-sm border border-gray-300">
                    🎯 Carrom
                  </span>

                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-3 py-1 rounded-full text-sm border border-gray-300">
                    🏃 Sports
                  </span>

                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-3 py-1 rounded-full text-sm border border-gray-300">
                    🎭 Cultural
                  </span>
                </div>
              </div>
            </div>

            {/* Right Features */}

            <div
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 hover:cursor-pointer"
              onClick={() => handleNavigation()}
            >
              {[
                {
                  icon: "📅",
                  title: "Event Management",
                  desc: "Date-wise events",
                },

                { icon: "📱", title: "Media Upload", desc: "Images & videos" },

                { icon: "😃", title: "Feedback", desc: "Provide Feedback" },

                {
                  icon: "📊",
                  title: "Reports",
                  desc: "Participations analytics",
                },

                { icon: "🎯", title: "Tracking", desc: "Real-time data" },

                { icon: "📈", title: "Insights", desc: "Data analysis" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray to-gray-300 border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg hover:from-gray-50 hover:to-gray-100 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10  text-white rounded-md flex items-center justify-center mb-3 shadow-sm"
                    style={{ backgroundColor: "#274c77" }}
                  >
                    <span className="text-lg">{f.icon}</span>
                  </div>

                  <h3 className="text-gray-800 font-semibold text-sm">
                    {f.title}
                  </h3>

                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}

      <footer className="flex-shrink-0 px-4 md:px-6 py-4 text-center">
        <p className="text-sm text-black-400">
          &copy; {new Date().getFullYear()} RelevantZ. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
