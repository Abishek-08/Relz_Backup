// src/pages/EngagementHub.jsx (or your existing path)
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import socket from "../../../socket";
import { encryptSession, decryptSession } from "../../utils/SessionCrypto";
import { useToast } from "../../utils/useToast";
import liveaaz360Logo from "/assets/logorounded.png";
import { useAuth } from "../../routes/AuthContext";
import {
  getAllPresenceConnections,
  launchFeedbackService,
  launchSurveyService,
} from "../../services/Services";
import { useSelector } from "react-redux";
import { CircleDot, ClipboardList, MonitorSmartphone } from "lucide-react";

export default function EngagementHub() {
  const navigate = useNavigate();
  const { error, success } = useToast();
  const { isSurveyAvail, isFeedbackAvail } = useParams();
  const { logout } = useAuth();

  // Centrifuge-Implementation
  const feedbackShownData = useSelector(
    (state) => state.feedback.feedbackShownData,
  );
  const surveyShownData = useSelector((state) => state.survey.surveyShownData);

  // Add this helper to EngagementHub.jsx (top-level inside component)
  const goToSocketTracker = () => {
    // Always hydrate session from payload of active module
    const mode =
      decryptSession(localStorage.getItem("feedbackAvailable")) === "true"
        ? "feedback"
        : "survey";

    const payloadKey = mode === "survey" ? "surveyPayload" : "feedbackPayload";
    const payloadStr = decryptSession(localStorage.getItem(payloadKey));

    if (!payloadStr) {
      error("Live module not fully loaded yet.");
      return;
    }

    const p = JSON.parse(payloadStr);

    localStorage.setItem("engagementMode", encryptSession(mode));
    localStorage.setItem("selectedEventId", encryptSession(String(p.eventId)));
    localStorage.setItem(
      mode === "survey" ? "surveyMasterSocket" : "feedbackMasterSocket",
      encryptSession(p.masterSocket),
    );
    // localStorage.setItem("socket", encryptSession(socket.id));

    navigate("/socketDashboard");
  };

  const [feedbackAvailable, setFeedbackAvailable] = useState(
    decryptSession(localStorage.getItem("feedbackAvailable")) === "true",
  );
  const [surveyAvailable, setSurveyAvailable] = useState(
    decryptSession(localStorage.getItem("surveyAvailable")) === "true",
  );

  // Guard: if neither is available, go home (replace so back doesn’t come here)
  useEffect(() => {
    const noModules = !(feedbackAvailable || surveyAvailable);
    if (noModules) {
      console.log("[hub] no modules available -> go /homepage");
      navigate("/homepage", { replace: true });
    }
  }, [feedbackAvailable, surveyAvailable, navigate]);

  // Keep UI synced with AppRouter announcements
  useEffect(() => {
    const onAvailability = (e) => {
      const { module, available } = e.detail || {};
      if (module === "feedback") setFeedbackAvailable(!!available);
      if (module === "survey") setSurveyAvailable(!!available);
      console.log("[hub] availability:update", { module, available });
    };
    window.addEventListener("availability:update", onAvailability);
    return () =>
      window.removeEventListener("availability:update", onAvailability);
  }, []);

  // Logout button
  const onLogout = () => {
    success("Logged out");
    logout();
    navigate("/login", { replace: true });
  };

  const launchFeedback = () => {
    const email = (
      decryptSession(localStorage.getItem("email")) || ""
    ).toLowerCase();
    if (!email) return;
    launchFeedbackService(email);
  };

  const launchSurvey = () => {
    const email = (
      decryptSession(localStorage.getItem("email")) || ""
    ).toLowerCase();
    if (!email) return;
    launchSurveyService(email);
  };

  useEffect(() => {
    if (isFeedbackAvail) {
      launchFeedback();
    }
    if (isSurveyAvail) {
      launchSurvey();
    }
  }, [isSurveyAvail, isFeedbackAvail]);

  // Click handlers for tiles
  // When user picks FEEDBACK
  const onSelectFeedback = () => {
    // const payloadStr = decryptSession(localStorage.getItem("feedbackPayload"));
    // if (!payloadStr) return;

    if (!feedbackShownData) return;

    try {
      console.log("FeedbackShownData: ", feedbackShownData);

      const payload = feedbackShownData;
      console.log("[hub] selecting feedback with payload:", payload);

      // Clear survey keys
      localStorage.removeItem("surveyQuestions");
      localStorage.removeItem("surveyLaunched");
      localStorage.removeItem("surveyEventId");
      localStorage.removeItem("surveyEventName");
      localStorage.removeItem("surveyMasterSocket");

      // Set feedback keys (namespaced)
      localStorage.setItem(
        "feedbackQuestions",
        encryptSession(JSON.stringify(payload.questions)),
      );
      localStorage.setItem("feedbackLaunched", encryptSession("true"));
      localStorage.setItem(
        "feedbackEventId",
        encryptSession(String(payload.eventId)),
      );
      localStorage.setItem(
        "feedbackEventName",
        encryptSession(payload.eventName || ""),
      );
      localStorage.setItem(
        "feedbackMasterSocket",
        encryptSession(payload.masterSocket || ""),
      );

      // Common
      localStorage.setItem(
        "selectedEventId",
        encryptSession(String(payload.eventId)),
      );
      localStorage.setItem("engagementMode", encryptSession("feedback"));
      // localStorage.setItem("socket", encryptSession(socket.id || ""));

      navigate(`/feedbackCollection`, { replace: true });
    } catch (e) {
      console.error("[hub] Failed to parse feedbackPayload:", e);
    }
  };

  const [liveFeedbackUserCount, setLiveFeedbackUserCount] = useState(0);

  useEffect(() => {
    getAllPresenceConnections().then((res) =>
      setLiveFeedbackUserCount(Object.keys(res.presence).length),
    );
  }, []);

  console.log("presence-count: ", liveFeedbackUserCount);

  // When user picks SURVEY
  const onSelectSurvey = () => {
    // const payloadStr = decryptSession(localStorage.getItem("surveyPayload"));
    // if (!payloadStr) return;

    if (!surveyShownData) return;
    try {
      const payload = surveyShownData;
      console.log("[hub] selecting survey with payload:", payload);

      // Clear feedback keys
      localStorage.removeItem("feedbackQuestions");
      localStorage.removeItem("feedbackLaunched");
      localStorage.removeItem("feedbackEventId");
      localStorage.removeItem("feedbackEventName");
      localStorage.removeItem("feedbackMasterSocket");

      // Set survey keys (namespaced)
      localStorage.setItem(
        "surveyQuestions",
        encryptSession(JSON.stringify(payload.questions)),
      );
      localStorage.setItem("surveyLaunched", encryptSession("true"));
      localStorage.setItem(
        "surveyEventId",
        encryptSession(String(payload.eventId)),
      );
      localStorage.setItem(
        "surveyEventName",
        encryptSession(payload.eventName || ""),
      );
      localStorage.setItem(
        "surveyMasterSocket",
        encryptSession(payload.masterSocket || ""),
      );

      // Common
      localStorage.setItem(
        "selectedEventId",
        encryptSession(String(payload.eventId)),
      );
      localStorage.setItem("engagementMode", encryptSession("survey"));
      // localStorage.setItem("socket", encryptSession(socket.id || ""));

      navigate(`/surveyResponse`, { replace: true });
    } catch (e) {
      console.error("[hub] Failed to parse surveyPayload:", e);
    }
  };

  const tileBase =
    "cursor-pointer group relative rounded-2xl bg-white border border-gray-200 shadow-lg " +
    "hover:bg-gray-50 hover:scale-[1.02] transition-all p-6 flex flex-col items-center justify-center " +
    "aspect-square text-[#27235c] touch-manipulation select-none";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl relative">
        {/* Logout in top-right */}
        <button
          onClick={onLogout}
          className="cursor-pointer absolute right-0 z-50 -top-2 sm:top-0 bg-white/20 hover:bg-white/30 text-black px-4 py-2 rounded-lg border border-white/30 shadow"
          aria-label="Logout"
        >
          Logout
        </button>

        <div className="flex justify-center mb-4">
          {" "}
          <img
            src={liveaaz360Logo}
            alt="Logo"
            className="w-32 h-32 rounded-full  shadow-md bg-white p-2"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-[#27235c] drop-shadow mb-6 text-center">
          Choose where to go
        </h1>

        <div className="flex flex-wrap gap-6 justify-center">
          {/* Homepage */}
          <button
            onClick={() => navigate("/homepage", { replace: true })}
            className={`${tileBase} w-48 h-48`}
            aria-label="Homepage"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mb-3 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-8 9 8M4 10v10a2 2 0 002 2h4m4 0h4a2 2 0 002-2V10"
              />
            </svg>
            <div className="text-lg sm:text-xl font-medium">Homepage</div>
          </button>

          {/* Feedback */}
          {feedbackAvailable && (
            <button
              onClick={onSelectFeedback}
              className={`${tileBase} w-48 h-48`}
              aria-label="Feedback"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-3 opacity-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-1 7l-4-4H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4h-1l-4 4z"
                />
              </svg>
              <div className="text-lg sm:text-xl font-medium">Feedback</div>
              <div className="absolute top-3 right-3 text-xs bg-emerald-500/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CircleDot
                  className="text-red-500"
                  size={8}
                  fill="currentColor"
                  stroke="none"
                />
                {liveFeedbackUserCount} Live
              </div>
            </button>
          )}

          {/* Survey */}
          {surveyAvailable && (
            <button
              onClick={onSelectSurvey}
              className={`${tileBase} w-48 h-48`}
              aria-label="Survey"
            >
              <ClipboardList className="w-16 h-16 mb-3 opacity-90" />
              <div className="text-lg sm:text-xl font-medium">Survey</div>
              <div className="absolute top-3 right-3 text-xs bg-emerald-500/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CircleDot
                  className="text-red-500"
                  size={8}
                  fill="currentColor"
                  stroke="none"
                />
                {liveFeedbackUserCount} Live
              </div>
            </button>
          )}

          {/* Socket Tracker */}
          <button
            onClick={goToSocketTracker}
            className={`${tileBase} w-48 h-48`}
            aria-label="Socket Tracker Live Dashboard"
          >
            <MonitorSmartphone className="w-16 h-16 mb-3 opacity-90" />
            <div className="text-lg sm:text-xl font-medium text-center">
              Kiosk Tracker
            </div>
          </button>
        </div>

        <p className="text-white text-center mt-6 text-sm">
          Tip: Open a new tab to view the other module simultaneously if it is
          launched.
        </p>
      </div>
    </div>
  );
}
