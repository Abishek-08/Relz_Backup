import React, { useState, useEffect } from "react";

import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useToast } from "../../utils/useToast.js";
import {
  login,
  registerFeedback,
  registerSurvey,
} from "../../services/Services";
import logo from "/assets/logo.jpg";
import { useAuth } from "../../routes/AuthContext.jsx";
import watermark from "/assets/trace.svg";
// import socket from "../../../socket.js";
import { decryptSession, encryptSession } from "../../utils/SessionCrypto.jsx";

const LoginPage = () => {
  const navigate = useNavigate();

  const { doLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const { success, error } = useToast();

  const [formErrors, setFormErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,

        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (name === "email") {
      error = validateEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
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

  const validateFeedback_Survey_Register = async (normalizedEmail) => {
    const feedbackRes = await registerFeedback(normalizedEmail);
    const surveyRes = await registerSurvey(normalizedEmail);

    console.log("fb: ", feedbackRes);
    console.log("s: ", surveyRes);

    if (
      feedbackRes?.feedbackInfo?.feedbackStatus === "launched" ||
      surveyRes?.surveyInfo?.surveyStatus === "launched"
    ) {
      navigate(
        `/engage/${feedbackRes ? true : false}/${surveyRes ? true : false}`,
      );
    } else {
      navigate("/homepage");
    }

    if (feedbackRes?.feedbackInfo?.feedbackStatus === "launched") {
      localStorage.setItem(
        "feedbackPayload",
        encryptSession(JSON.stringify(feedbackRes)),
      );
      localStorage.setItem("feedbackAvailable", encryptSession("true"));
    }

    if (surveyRes?.surveyInfo?.surveyStatus === "launched") {
      localStorage.setItem(
        "surveyPayload",
        encryptSession(JSON.stringify(surveyRes)),
      );
      localStorage.setItem("surveyAvailable", encryptSession("true"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const errors = {};

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const response = await login(formData);
      const { encryptedToken, user } = response.data;

      // Persist auth
      doLogin(encryptedToken, user.userType);
      const normalizedEmail = user.email?.trim().toLowerCase();
      localStorage.setItem("token", encryptedToken);
      localStorage.setItem("email", encryptSession(normalizedEmail).toString());

      if (user.userType === "ADMIN") {
        navigate("/manageEventManager", { replace: true });
        return;
      }

      validateFeedback_Survey_Register(normalizedEmail);

      success("Logged in Successfully!");
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen portrait:items-start portrait:pt-30 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 relative overflow-hidden flex items-center justify-center p-4">
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

      {/* Enhanced Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#274c77" }}
        className="fixed top-6 hover:cursor-pointer left-6 z-50 group flex items-center space-x-3 backdrop-blur-lg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:from-gray-700/95 hover:to-gray-600/95 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-xl hover:shadow-2xl hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back</span>
      </button>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Enhanced Branding */}
        <div className="text-center lg:text-left space-y-8">
          {/* Logo Section with enhanced styling */}
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-white to-gray-100 rounded-full p-1 border border-gray-300">
                <div className="w-20 h-20 rounded-full  flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-20 h-20 rounded-full object-cover scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                <span>LivEAA</span>
                <span className="ml-2 animate-pulse text-[#97247E]">Z360</span>
              </h1>
              <div className="text-3xl xl:text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700">
                  {styledName}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Welcome Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2
                className="text-3xl md:text-4xl font-black leading-tight"
                style={{ color: "#274c77" }}
              >
                Welcome{" "}
                <span className="text-black bg-clip-text bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700">
                  Back
                </span>
              </h2>
              <div
                className="w-20 h-1 rounded-full mx-auto lg:mx-0"
                style={{ backgroundColor: "#274c77" }}
              ></div>
            </div>
            {/* <p className="text-lg text-black-600 leading-relaxed max-w-md text-justify">
              Stay connected to events and monitor your progress in real time.
              Dive into your personalized event tracker to plot your journey, discover new milestones, and unleash fresh opportunities with RelevantZ.
            </p> */}
            <p className="text-lg text-black-600 leading-relaxed max-w-md text-justify portrait:max-w-full portrait:px-4">
              Stay connected to your events with a personalized dashboard that
              tracks progress and highlights key milestones.
            </p>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🎯",
                text: "Track Events",
                desc: "Monitor your participation",
              },

              { icon: "📊", text: "Stay Connected", desc: "Real-time updates" },

              {
                icon: "📍",
                text: "Discover Opportunities",
                desc: "Find new events",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-gray/80 via-gray-50/80 to-gray-100/80 backdrop-blur-lg p-4 rounded-2xl border border-gray-300/60 hover:border-gray-400/80 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative space-y-2">
                  <div className="text-2xl">{feature.icon}</div>
                  <div className="text-sm font-bold text-gray-800">
                    {feature.text}
                  </div>
                  <div className="text-xs text-gray-600">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="w-full max-w-md portrait:max-w-full portrait:px-12 portrait:py-0 portrait:min-h-[50vh]">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-400/50 to-gray-500/50 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/90 via-gray-50/90 to-gray-100/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-300/60 shadow-2xl portrait:p-12 portrait:min-h-[40vh]">
              {/* Enhanced Form Header */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur opacity-75"></div>
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: "#274c77" }}
                  >
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl portrait:text-3xl font-black text-gray-800 mb-2">
                  Sign In
                </h3>
                <p className="text-sm portrait:text-base text-gray-600 leading-relaxed">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Enhanced Login Form */}
              <form className="space-y-6">
                {/* Enhanced Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3.5 portrait:py-5 bg-white/80 border border-gray-300/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 text-sm portrait:text-lg transition-all duration-300 hover:border-gray-400"
                    />
                  </div>

                  {formErrors.email && (
                    <p className="text-xs text-red-500 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      className="w-full pl-12 pr-4 py-3.5 portrait:py-5 bg-white/80 border border-gray-300/70 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 text-sm portrait:text-lg transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {formErrors.password && (
                    <p className="text-xs text-red-500 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{formErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Enhanced Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`group relative w-full h-12 portrait:h-16 text-white rounded-xl font-bold text-sm portrait:text-lg transition-all duration-300 shadow-lg overflow-hidden ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:scale-[1.02] hover:shadow-2xl hover:from-gray-600 hover:to-gray-700"
                  }`}
                  style={{ backgroundColor: "#274c77" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center hover:cursor-pointer space-x-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 portrait:h-6 portrait:w-6 text-white"
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
                          />
                        </svg>
                        <span className="portrait:text-lg">Signing In...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 portrait:w-6 portrait:h-6 group-hover:scale-110 transition-transform duration-200" />
                        <span className="portrait:text-lg">
                          Sign In to Dashboard
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
