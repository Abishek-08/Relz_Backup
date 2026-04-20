// import React, { useEffect, useMemo, useState } from "react";
// import { X, Lock, ArrowRight, User } from "lucide-react";
// import BackgroundMedia from "./layout/BackgroundMedia";
// import logoFeedback from "../../../../assets/logo_feedback.jpg";
// import r2dcWatermark from "../../../../assets/R2DC_final_right_side.png";
// import relevantzWatermark from "../../../../assets/Relevantz_Blue_Watermark.png";
// import { verifySurveyUser } from "../../../../services/Services";

// function lockFullscreenOnce() {
//   const el = document.documentElement;
//   if (
//     document.fullscreenElement ||
//     document.webkitFullscreenElement ||
//     document.mozFullScreenElement
//   )
//     return;
//   if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
//   else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
//   else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
// }

// export default function EntryScreen({
//   mode = "external",
//   InternalSuggest,
//   onContinue,
//   onCloseSurvey,
//   disabled,
//   eventName = "Event",
//   verifyEmail,
//   eventId,
//   primaryColor = "#27235c",
//   backgroundTheme,
// }) {
//   const [email, setEmail] = useState("");
//   const [isValid, setIsValid] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [showPwd, setShowPwd] = useState(false);
//   const [inlineMsg, setInlineMsg] = useState("");

//   useEffect(() => {
//     const setVh = () =>
//       document.documentElement.style.setProperty(
//         "--vh",
//         `${window.innerHeight * 0.01}px`,
//       );
//     setVh();
//     window.addEventListener("resize", setVh, { passive: true });
//     const onTap = () => {
//       lockFullscreenOnce();
//       window.removeEventListener("pointerdown", onTap);
//     };
//     window.addEventListener("pointerdown", onTap, { passive: true });
//     lockFullscreenOnce();
//     return () => window.removeEventListener("resize", setVh);
//   }, []);

//   const proceed = async () => {
//     if (disabled || busy) return;
//     if (mode === "anonymous") return onContinue?.({ email: null, mode });
//     if (!isValid) return;
//     setBusy(true);
//     setInlineMsg("");
//     try {
//       const { status } = await verifySurveyUser(email.trim(), eventId);
//       if (status === "already-submitted") {
//         setInlineMsg("You have already submitted this survey.");
//         return;
//       }
//       if (status === "not-authorized") {
//         setInlineMsg("This email is not authorized for this event.");
//         return;
//       }
//       onContinue?.({ email: email.trim(), mode });
//     } finally {
//       setBusy(false);
//     }
//   };

//   const gradientStyle = useMemo(
//     () => ({
//       background: "linear-gradient(90deg,#E01950,#97247E)",
//       WebkitBackgroundClip: "text",
//       WebkitTextFillColor: "transparent",
//     }),
//     [],
//   );
//   const styledName = useMemo(
//     () => (
//       <>
//         <span style={gradientStyle}>LivEAA </span>
//         <span className="text-black/80">Live Event Analytics Application</span>
//       </>
//     ),
//     [gradientStyle],
//   );

//   return (
//     <div className="kiosk-stage">
//       {/* ENTRY uses video/GIF background */}
//       <BackgroundMedia backgroundTheme={backgroundTheme} />

//       {/* Corner logos like your reference */}
//       <img
//         src={relevantzWatermark}
//         alt="Left Logo"
//         className="corner-logo-left"
//       />
//       <img src={r2dcWatermark} alt="Right Logo" className="corner-logo-right" />

//       {/* Floating close at bottom-right */}
//       <button
//         onClick={() => setShowPwd(true)}
//         className="floating-close cursor-pointer"
//         aria-label="Close Survey"
//         title="Close Survey"
//       >
//         <X size={18} />
//       </button>

//       {/* Center card (smaller, no internal scroll) */}
//       <div className="kiosk-center">
//         <div className="w-full max-w-[520px] md:max-w-[680px] bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-5 md:p-6">
//           {/* Rounded center logo */}
//           <div className="mb-4">
//             <div className="w-32 h-32 md:w-36 md:h-36 mx-auto rounded-full bg-white shadow-xl ring-2 ring-white -mt-2 overflow-hidden">
//               <img
//                 src={logoFeedback}
//                 alt="Organization Logo"
//                 className="w-full h-full object-contain rounded-full"
//               />
//             </div>
//           </div>

//           {/* Styled title */}
//           <div className="text-center mb-4">
//             <div className="inline-block px-3 py-2 rounded-xl">
//               <h1 className="text-2xl md:text-2xl font-bold">{styledName}</h1>
//             </div>
//             <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto my-3" />
//             <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
//               <h2 className="text-2xl md:text-2xl font-bold">
//                 <span className="text-[#de3163]">{eventName}</span> Survey
//               </h2>
//             </div>
//           </div>

//           {/* Welcome */}
//           <div className="text-center mb-4">
//             <div className="w-12 h-12 bg-[#274c77] rounded-full flex items-center justify-center mx-auto mb-3">
//               <User size={20} className="text-white" />
//             </div>
//             <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
//               Welcome to Survey Portal
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Jump right in - your response matters.
//             </p>
//           </div>

//           {/* Modes */}
//           {mode === "anonymous" ? (
//             <div className="pt-2">
//               <button
//                 onClick={proceed}
//                 className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
//               >
//                 <ArrowRight size={16} className="inline mr-2" />
//                 Continue to Survey
//               </button>
//             </div>
//           ) : mode === "external" ? (
//             <ExternalEmail
//               value={email}
//               onChange={setEmail}
//               onValid={setIsValid}
//               onContinue={proceed}
//               busy={busy}
//               primaryColor={primaryColor}
//               disabled={disabled}
//             />
//           ) : (
//             <div className="space-y-2">
//               <label className="block text-gray-700 font-semibold mb-1 text-base">
//                 Organization Email
//               </label>
//               <InternalSuggest
//                 onPick={(picked) => {
//                   setEmail(picked);
//                   setIsValid(true);
//                 }}
//                 onValidityChange={setIsValid}
//                 onChange={(typed) => setEmail(typed)}
//                 primaryColor={primaryColor}
//               />
//               <div className="pt-3">
//                 <button
//                   onClick={proceed}
//                   disabled={!isValid || disabled || busy}
//                   className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center space-x-2 cursor-pointer"
//                 >
//                   <ArrowRight size={16} />
//                   <span>{busy ? "Checking…" : "Continue to Survey"}</span>
//                 </button>
//                 {inlineMsg && <p className="mt-2 text-sm text-red-600 text-center">{inlineMsg}</p>}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Password modal */}
//       {showPwd && (
//         <div className="kiosk-modal-overlay">
//           <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-5">
//             <PasswordModal
//               onClose={() => setShowPwd(false)}
//               onSubmit={onCloseSurvey}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ExternalEmail({
//   value,
//   onChange,
//   onValid,
//   onContinue,
//   busy,
//   primaryColor,
//   disabled,
// }) {
//   const [err, setErr] = useState("");
//   useEffect(() => {
//     const full = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const ok = full.test((value || "").trim());
//     setErr(value && !ok ? "Enter a valid email" : "");
//     onValid?.(ok);
//   }, [value, onValid]);
//   return (
//     <div className="space-y-2">
//       <input
//         type="email"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="Enter your email"
//         className={`w-full px-3 py-3 rounded-xl border-2 ${err ? "border-red-400" : "border-gray-200"} bg-white text-gray-800 placeholder-gray-400 focus:border-[${primaryColor}] focus:outline-none`}
//         autoCorrect="off"
//         autoCapitalize="none"
//         inputMode="email"
//       />
//       {err && <p className="text-red-500 text-sm">{err}</p>}
//       <div className="pt-3">
//         <button
//           onClick={onContinue}
//           disabled={!value || !!err || disabled || busy}
//           className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center space-x-2 cursor-pointer"
//         >
//           <ArrowRight size={16} />
//           <span>{busy ? "Checking…" : "Continue to Feedback"}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// function PasswordModal({ onClose, onSubmit }) {
//   const [pwd, setPwd] = useState("");
//   return (
//     <>
//       <div className="text-center mb-4">
//         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
//           <Lock size={28} className="text-red-600" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-800">
//           Authentication Required
//         </h3>
//         <p className="text-gray-600">Enter your password to close survey</p>
//       </div>
//       <div className="space-y-3">
//         <input
//           type="password"
//           value={pwd}
//           onChange={(e) => setPwd(e.target.value)}
//           placeholder="Admin password"
//           className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#27235c]"
//         />
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={async () => {
//               await onSubmit?.(pwd);
//               setPwd("");
//               onClose?.();
//             }}
//             disabled={!pwd.trim()}
//             className="px-4 py-2 rounded-lg bg-[#27235c] text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
//           >
//             Verify
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Lock, ArrowRight, User } from "lucide-react";
import BackgroundMedia from "./layout/BackgroundMedia";
import GradientBackdrop from "./GradientBackdrop"; // gradient fallback behind video

import logoFeedback from "/assets/logo_feedback.jpg";
import r2dcWatermark from "/assets/R2DC_final_right_side.png";
import relevantzWatermark from "/assets/Relevantz_Blue_Watermark.png";
import { useSyncStatusContext } from "../../../../context/SyncStatusContext";
import { openDB } from "idb";

// Keep fullscreen stable on iOS
function lockFullscreenOnce() {
  const el = document.documentElement;
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement
  )
    return;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
}

export default function EntryScreen({
  mode = "external", // "anonymous" | "internal" | "external"
  InternalSuggest, // your internal email suggest component
  onContinue,
  onCloseSurvey,
  disabled,
  eventName = "Event",
  verifyEmail,
  eventId,
  primaryColor = "#27235c",
  backgroundTheme, // DB theme passed in
}) {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inlineMsg, setInlineMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const busyRef = useRef(false);
  const reqSeq = useRef(0);

  // PWA Implementation
  const { status } = useSyncStatusContext();
  const [offlineQueueData, setOfflineQueueData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const db = await openDB("offline-db", 1);
      const allItems = await db.getAll("api-queue");
      setOfflineQueueData(
        allItems.filter((item) => item.data.module === "survey"),
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") setShowPwd(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const setVh = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    setVh();
    window.addEventListener("resize", setVh, { passive: true });
    const onTap = () => {
      lockFullscreenOnce();
      window.removeEventListener("pointerdown", onTap);
    };
    window.addEventListener("pointerdown", onTap, { passive: true });
    lockFullscreenOnce();
    return () => window.removeEventListener("resize", setVh);
  }, []);

  const proceed = async () => {
    // Hard guard by ref (faster than waiting for React state to disable button)
    if (disabled || busyRef.current) return;

    // For anonymous, just continue
    if (mode === "anonymous") {
      onContinue?.({ email: null, mode });
      return;
    }
    if (!isValid) return;

    // Lock immediately
    busyRef.current = true;
    setBusy(true);

    // Capture sequence id for this attempt
    const mySeq = ++reqSeq.current;

    try {
      if (status === "idle" || status === "online") {
        if (verifyEmail && eventId) {
          const result = await verifyEmail(email.trim(), eventId);

          // If this response is not the latest, discard it (prevents jumps)
          if (mySeq !== reqSeq.current) return;

          // Robust extraction of a status string
          const statusText =
            result?.status ??
            result?.message ??
            result?.data?.status ??
            result?.data?.message ??
            (typeof result?.data === "string" ? result.data : "") ??
            (typeof result === "string" ? result : "");

          const normalized = String(statusText || "")
            .trim()
            .toLowerCase();

          const alreadySubmitted = [
            "already-submitted",
            "already submitted",
            "already_submitted",
          ].includes(normalized);
          const notAuthorized = [
            "not-authorized",
            "not authorized",
            "not_authorized",
            "forbidden",
          ].includes(normalized);

          if (alreadySubmitted) {
            setInlineMsg("You have already submitted this survey.");
            return;
          }

          if (notAuthorized) {
            setInlineMsg("This email is not authorized for this event.");
            return;
          }
        }
      } else {
        if (offlineQueueData.find((em) => em.data.surveyUserEmail === email)) {
          setInlineMsg("You have already submitted this survey.");
          return;
        }
      }

      onContinue?.({ email: email.trim(), mode });
    } finally {
      if (mySeq === reqSeq.current) {
        busyRef.current = false;
        setBusy(false);
      }
    }
  };

  const clearInlineMsgIfChanged = (next) => {
    if (next.trim() !== (email || "").trim()) {
      setInlineMsg("");
    }
  };

  // Title "LivEAA Live Event Analytics Application" — LivEAA in gradient, one line
  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(90deg,#E01950,#97247E)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }),
    [],
  );
  const styledName = useMemo(
    () => (
      <>
        <span style={gradientStyle}>L</span>
        <span style={gradientStyle}>i</span>
        <span style={gradientStyle}>v</span>e{" "}
        <span style={gradientStyle}>E</span>
        vent <span style={gradientStyle}>A</span>nalytics{" "}
        <span style={gradientStyle}>A</span>pplication
      </>
    ),
    [gradientStyle],
  );

  return (
    <div className="kiosk-stage">
      {/* Show gradient immediately; video renders over it when available */}
      <GradientBackdrop />
      <BackgroundMedia backgroundTheme={backgroundTheme} />

      {/* Corner logos (your exact placement look) */}
      <img
        src={relevantzWatermark}
        alt="Left Logo"
        className="fixed top-6 left-4 w-[30vw] md:w-[30vw] lg:w-[23vw] h-auto object-contain pointer-events-none select-none"
      />
      <img
        src={r2dcWatermark}
        alt="Right Logo"
        className="fixed top-1 right-4 w-[25vw] md:w-[25vw] lg:w-[18vw] object-contain pointer-events-none select-none opacity-80"
      />

      {/* Floating Close button (keep on screen) */}
      <button
        onClick={() => setShowPwd(true)}
        className="cursor-pointer fixed bottom-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg z-[100]
                   hover:bg-gray-900 focus:outline-none"
        aria-label="Close Survey"
        title="Close Survey"
      >
        <X size={20} />
      </button>

      {/* Center card — your Tailwind card, slightly smaller and no internal scroll */}
      <div className="kiosk-center">
        <div className="w-full max-w-xl mx-auto p-6 relative">
          {/* Rounded center logo */}
          <div className="relative z-50 text-center mb-6">
            <div className="mb-4 relative">
              <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-white shadow-2xl ring-2 ring-white -mt-2">
                <img
                  src={logoFeedback}
                  alt="Organization Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>

            <div className="relative z-50 p-1 text-center mb-4 bg-white/80 backdrop-blur-sm rounded-xl">
              <h1 className="text-3xl font-bold text-black/80 mb-2">
                {styledName}
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto mb-4" />
            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 inline-block shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-[#de3163]">{eventName}</span> Survey
              </h2>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-[#274c77] rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={20} className="text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                Welcome to Survey Portal
              </h3>
              <p className="text-gray-600 text-sm">
                Jump right in - your response matters.
              </p>
            </div>

            {/* Modes */}
            {mode === "anonymous" ? (
              <div className="pt-4">
                <button
                  onClick={proceed}
                  className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
                >
                  <ArrowRight size={16} className="inline mr-2" />
                  Continue to Survey
                </button>
                {/* Inline message area (if any blocking message) */}
                {inlineMsg && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {inlineMsg}
                  </p>
                )}
              </div>
            ) : mode === "external" ? (
              <ExternalEmail
                value={email}
                onChange={setEmail}
                onValid={setIsValid}
                onContinue={proceed}
                busy={busy}
                primaryColor={primaryColor}
                disabled={disabled}
                inlineMsg={inlineMsg}
                onClearInlineMsg={() => setInlineMsg("")}
              />
            ) : (
              <>
                {/* Internal email with suggestions */}
                <div className="relative">
                  <label className="block text-gray-700 font-semibold mb-2 text-base">
                    Organization Email
                  </label>

                  <div
                    className={
                      inlineMsg ? "ring-2 ring-red-400 rounded-xl p-1" : ""
                    }
                  >
                    <InternalSuggest
                      onPick={(picked) => {
                        setEmail(picked);
                        setIsValid(true);
                      }}
                      onValidityChange={(ok) => setIsValid(ok)}
                      onChange={(typed) => {
                        clearInlineMsgIfChanged(typed);
                        setEmail(typed);
                        // setInlineMsg("");
                      }}
                      primaryColor={primaryColor}
                    />
                  </div>
                  {/* <<< PLACE INLINE MSG EXACTLY HERE >>> */}
                  {inlineMsg && (
                    <p className="mt-2 text-sm text-red-600 text-center">
                      {inlineMsg}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={proceed}
                    disabled={!isValid || disabled || busy}
                    className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <ArrowRight size={16} />
                    <span>{busy ? "Checking…" : "Continue to Survey"}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password modal */}

      {showPwd && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70]"
          onClick={() => setShowPwd(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PasswordModal
              onClose={() => setShowPwd(false)}
              onSubmit={onCloseSurvey}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExternalEmail({
  value,
  onChange,
  onValid,
  onContinue,
  busy,
  primaryColor,
  disabled,
  inlineMsg,
  onClearInlineMsg,
}) {
  const [err, setErr] = useState("");
  useEffect(() => {
    const full = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = full.test((value || "").trim());
    setErr(value && !ok ? "Enter a valid email" : "");
    onValid?.(ok);
  }, [value, onValid]);

  return (
    <div className="space-y-2">
      <label className="sr-only">Email</label>
      <input
        type="email"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onClearInlineMsg?.();
        }}
        placeholder="Enter your email"
        className={`w-full px-3 py-3 rounded-xl border-2 ${err ? "border-red-400" : "border-gray-200"} bg-white text-gray-800 placeholder-gray-400 focus:outline-none`}
        autoCorrect="off"
        autoCapitalize="none"
        inputMode="email"
      />

      {/* Inline verify message for external too */}
      {inlineMsg && (
        <p className="mt-2 text-sm text-red-600 text-center">{inlineMsg}</p>
      )}
      {err && <p className="text-red-500 text-sm">{err}</p>}

      <div className="pt-3">
        <button
          onClick={onContinue}
          disabled={!value || !!err || disabled || busy}
          className="w-full px-6 py-3 bg-[#274c77] text-white rounded-xl hover:bg-[#1e3a5f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center space-x-2 cursor-pointer"
        >
          <ArrowRight size={16} />
          <span>{busy ? "Checking…" : "Continue to Survey"}</span>
        </button>
      </div>
    </div>
  );
}

function PasswordModal({ onClose, onSubmit }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!pwd.trim() || loading) return;
    setErr("");
    setLoading(true);
    try {
      const res = await onSubmit?.(pwd);

      if (!res?.success) {
        setErr(res?.message || "Incorrect password. Please try again.");
        return; // DO NOT CLOSE
      }

      onClose?.(); // SUCCESS
    } catch {
      setErr("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => (e.key === "Enter" ? handleVerify() : null);

  return (
    <div
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[400px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock size={28} className="text-red-600" />
      </div>
      <h3 className="text-xl text-center font-bold text-gray-800">
        Authentication Required
      </h3>
      <p className="text-gray-600 text-center ">
        Enter your password to close survey
      </p>

      <div className="space-y-2 pt-4">
        <label className="block font-medium">Password</label>

        <input
          type="password"
          value={pwd}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setPwd(e.target.value);
            setErr("");
          }}
          placeholder="Admin password"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#27235c]"
        />

        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex gap-3 justify-end mt-2">
          <button
            className="px-4 py-3 p-2 cursor-pointer bg-[#27235c] rounded-2xl text-white"
            onClick={() => {
              setPwd("");
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-3 p-2 cursor-pointer bg-[#27235c] rounded-2xl text-white"
            onClick={handleVerify}
            disabled={!pwd.trim() || loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
