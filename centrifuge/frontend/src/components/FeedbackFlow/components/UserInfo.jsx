import React from "react";
import { X, User, Mail, ArrowRight } from "lucide-react";

export default function UserInfo({
  eventInformation,
  eventName,
  assets,
  userInfo,
  setUserInfo,
  emailError,
  setEmailError,
  emailSuggestions,
  setEmailSuggestions,
  showEmailDropdown,
  setShowEmailDropdown,
  highlightedIndex,
  setHighlightedIndex,
  highlightedRef,
  mouseDownRef,
  handleEmailInputChange,
  isEmailValid,
  onContinue,
  onCloseFeedback,
}) {
  const { floatingGif, logoFeedback, relevantzWatermark, testlogo } = assets;

  const styledName = (
    <>
      <span style={grad()}>L</span>
      <span style={grad()}>i</span>
      <span style={grad()}>v</span>e <span style={grad()}>E</span>vent{" "}
      <span style={grad()}>A</span>nalytics <span style={grad()}>A</span>pplication
    </>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 flex items-center justify-center z-[60]">
      {/* left/right logos + background (mp4/gif) exactly like original */}
      <img src={testlogo} alt="R2DC Logo"
           className="fixed top-1 right-4 w-[25vw] md:w-[25vw] lg:w-[18vw] object-contain pointer-events-none select-none opacity-80" />
      <img src={relevantzWatermark} alt="R2DC Logo"
           className="fixed top-6 left-4 w-[30vw] md:w-[30vw] lg:w-[23vw] h-auto object-contain pointer-events-none select-none" />

      {eventInformation && (eventInformation.backgroundTheme?.toLowerCase?.().endsWith(".gif") ? (
        <img
      src={
        eventInformation?.backgroundTheme &&
        eventInformation.backgroundTheme.toLowerCase() !== "default theme selected"
          ? `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_BACKGROUND_VIDEO_PATH}/${encodeURIComponent(eventInformation.backgroundTheme)}`
          : floatingGif
      }
          alt="Background"
          className="fixed inset-0 z-[-1] w-full h-full object-cover"
        />
      ) : (
        <video autoPlay loop muted playsInline preload="auto"
               className="fixed inset-0 z-[-1] w-full h-full object-cover">
          <source
            src={
              eventInformation?.backgroundTheme &&
              eventInformation.backgroundTheme.toLowerCase() !== "default theme selected"
                ? `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_BACKGROUND_VIDEO_PATH}/${encodeURIComponent(eventInformation.backgroundTheme)}`
                : floatingGif
            }
            type="video/mp4"
          />
        </video>
      ))}

      <div className="w-full max-w-xl mx-auto p-6 relative">
        <button
          onClick={onCloseFeedback}
          className="cursor-pointer absolute top-2 right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg z-[100]"
        >
          <X size={20} />
        </button>

        {/* header + title */}
        <div className="relative z-50 text-center mb-6">
          <div className="mb-4 relative">
            <div className="relative z-10 w-40 h-40 mx-auto rounded-full bg-white ring-2 ring-white -mt-4">
              <img src={logoFeedback} alt="Organization Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>
          <div className="relative z-50 p-1 text-center mb-4 bg-white/80 backdrop-blur-sm rounded-xl">
            <h1 className="text-3xl font-bold text-black/80 mb-2">{styledName}</h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto mb-4" />
          <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 inline-block shadow-lg">
            <h2 className="text-3xl font-bold">
              <span className="text-[#de3163]">{eventName}</span> Feedback
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-2xl">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-[#274c77] rounded-full flex items-center justify-center mx-auto mb-3">
              <User size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Welcome to Feedback Portal</h3>
            <p className="text-gray-600 text-sm">Jump right in - your feedback matters.</p>
          </div>

          {eventInformation?.isAnonymousFeedback ? (
            <div className="pt-4">
              <button onClick={onContinue}
                className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] transition-all font-semibold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                <ArrowRight size={16} /> <span>Continue to Feedback</span>
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-base">Organization Email</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3 text-gray-400 z-10" style={{ top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => handleEmailInputChange(e.target.value)}
                    onBlur={() => setTimeout(() => { if (!mouseDownRef.current) setShowEmailDropdown(false); mouseDownRef.current = false; }, 100)}
                    onFocus={() => { setShowEmailDropdown(true); handleEmailInputChange(userInfo.email); }}
                    placeholder="Enter your organization email"
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 ${emailError ? "border-red-400" : "border-gray-200"} bg-white text-gray-800 placeholder-gray-400 focus:border-[#274c77] focus:outline-none focus:ring-2 focus:ring-[#274c77]/20 transition-all text-base`}
                  />
                </div>

                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                {showEmailDropdown && emailSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 mt-1 max-h-40 overflow-y-auto z-20">
                    {emailSuggestions.map((emp, idx) => (
                      <div key={idx}
                           ref={idx === highlightedIndex ? highlightedRef : null}
                           className={`px-4 py-2 cursor-pointer ${idx === highlightedIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                           onMouseDown={() => {
                             mouseDownRef.current = true;
                             setUserInfo((p) => ({ ...p, email: emp.email }));
                             handleEmailInputChange(emp.email);
                             setShowEmailDropdown(false);
                             setHighlightedIndex(-1);
                           }}>
                        <div className="text-sm font-medium">{emp.fullName}</div>
                        <div className="text-xs text-gray-500">{emp.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button onClick={onContinue} disabled={!isEmailValid || !!emailError}
                  className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowRight size={16} /> <span>Continue to Feedback</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const grad = () => ({
  background: "linear-gradient(90deg, #E01950, #97247E)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});