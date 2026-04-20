import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getFeedbackInformationByEventId,
  getFeedbackQuestionsByEventId,
  getEmailVerification,
  addFeedbackUserDetails,
  addFeedbackResponseDetails,
  doAuthenticationForClosingFeedback,
  searchEmployeesByEmail,
} from "../../services/Services";
import { decryptSession } from "../../utils/SessionCrypto";
import { useToast } from "../../utils/useToast";
import { useSyncStatusContext } from "../../context/SyncStatusContext";
import { openDB } from "idb";
// import socket from "../../../socket";
import floatingGif from "/assets/FeedbackDefaultTheme.mp4";
import logoFeedback from "/assets/logo_feedback.jpg";
import relevantzWatermark from "/assets/Relevantz_Blue_Watermark.png";
import poweredBy from "/assets/R2DC_PoweredBy.jpg";
import testlogo from "/assets/R2DC_final_right_side.png";
import questionicon from "/assets/questionicon.png";
import UserInfo from "./components/UserInfo";
import { CheckCircle } from "lucide-react";
import PasswordModal from "./components/PasswordModal";
import CloseFeedbackSuccess from "./components/CloseFeedbackSuccess";
import FeedbackForm from "./components/FeedbackForm";
import ThankYou from "./components/ThankYou";
import { useAuth } from "../../routes/AuthContext";
// import { disconnectCentrifuge } from "../../centrifuge/services/centrifugeClient";

const DEFAULT_THEME = "default theme selected";

export default function FeedbackResponseFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();
  const { status } = useSyncStatusContext(); // "online" | "offline" | "idle"
  const { logout } = useAuth();

  // ---- Screen state ----
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCloseFeedbackSuccess, setShowCloseFeedbackSuccess] =
    useState(false);

  // ---- Data state ----
  const [eventInformation, setEventInformation] = useState(null);
  const [feedbackQuestionResponses, setFeedbackQuestionResponses] = useState(
    [],
  );
  const [temporaryFeedbackResponses, setTemporaryFeedbackResponses] = useState(
    [],
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ---- User / input state ----
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [emailError, setEmailError] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  // ---- Admin close modal ----
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---- Thank you timer ----
  const [countdown, setCountdown] = useState(0);
  const [confirmedTimeout, setConfirmedTimeout] = useState(5);

  // ---- Fullscreen ----
  const [isFullscreenLocked, setIsFullscreenLocked] = useState(false);

  // ---- Refs ----
  const modalRef = useRef(null);
  const highlightedRef = useRef(null);
  const mouseDownRef = useRef(false);

  // ---- Offline queue mirror ----
  const [offlineQueueData, setOfflineQueueData] = useState([]);
  const [triggerQueueFetch, setTriggerQueueFetch] = useState(1);

  // ---- Boot UI helpers ----
  const [isLoading, setIsLoading] = useState(true);
  const [bootError, setBootError] = useState(null);

  // ---------- Helpers for fullscreen ----------
  const enterFullscreen = () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      setIsFullscreenLocked(true);
      return true;
    } catch (e) {
      console.error("Failed to enter fullscreen:", e);
      return false;
    }
  };

  const handleCloseFeedback = () => {
    setShowPasswordModal(true);
    setAdminPassword("");
    setPasswordError("");
  };

  useEffect(() => {
    console.log("feedback-response-flow is opened");
  }, []);

  // ---------- Admin close password ----------
  const handlePasswordSubmit = async (pwd) => {
    const userEmail = decryptSession(localStorage.getItem("email"));
    if (!userEmail) {
      setPasswordError("User email not found in session. Please log in again.");
      return;
    }
    try {
      const resp = await doAuthenticationForClosingFeedback(
        userEmail,
        (pwd ?? adminPassword).trim(),
      );
      if (resp.status === 200) {
        setShowPasswordModal(false);
        success("Feedback session closed successfully!");
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        logout();
        navigate("/login");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setPasswordError("Authentication failed. Please try again.");
    }
  };

  // ---------- Answer change ----------
  const handleResponseChange = (value) => {
    setFeedbackQuestionResponses((prev) => {
      const copy = [...prev];
      const current = copy[currentQuestionIndex];
      if (!current?.feedbackQuestionId) return copy;
      copy[currentQuestionIndex] = { ...current, answer: value };
      return copy;
    });

    setTemporaryFeedbackResponses((prev) => {
      const qId =
        feedbackQuestionResponses[currentQuestionIndex]?.feedbackQuestionId;
      const idx = prev.findIndex((r) => r.feedbackQuestionId === qId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { feedbackQuestionId: qId, feedbackResponse: value };
        return updated;
      }
      return [...prev, { feedbackQuestionId: qId, feedbackResponse: value }];
    });
  };

  const nextQuestion = () =>
    setCurrentQuestionIndex((i) =>
      i < feedbackQuestionResponses.length - 1 ? i + 1 : i,
    );
  const prevQuestion = () =>
    setCurrentQuestionIndex((i) => (i > 0 ? i - 1 : i));

  // ---------- Email input + validation ----------
  const handleEmailInputChange = (value) => {
    setUserInfo((p) => ({ ...p, email: value }));
    setShowEmailDropdown(value.length > 0);

    const fullEmailRegex = /^[a-zA-Z0-9._%+\-]+@relevantz\.com$/i;
    const complete = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!value.trim()) {
      setEmailError("");
      setIsEmailValid(false);
    } else if (complete) {
      if (!fullEmailRegex.test(value)) {
        setEmailError("Please enter a valid organization email");
        setIsEmailValid(false);
      } else {
        setEmailError("");
        setIsEmailValid(true);
      }
    } else {
      setEmailError("");
      setIsEmailValid(false);
    }
  };

  // ---------- Offline queue (IDB) ----------
  useEffect(() => {
    let cancelled = false;
    const fetchQueue = async () => {
      try {
        const db = await openDB("offline-db", 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("api-queue")) {
              db.createObjectStore("api-queue", {
                keyPath: "id",
                autoIncrement: true,
              });
            }
          },
        });
        const tx = db.transaction("api-queue", "readonly");
        const items = await tx.store.getAll();
        if (!cancelled) {
          setOfflineQueueData(
            (items || []).filter((i) => i?.data?.module === "feedback"),
          );
        }
      } catch (e) {
        console.warn("offline queue not ready, continuing without it", e);
        if (!cancelled) setOfflineQueueData([]);
      }
    };
    fetchQueue();
    return () => {
      cancelled = true;
    };
  }, [triggerQueueFetch]);

  // ---------- Simple localStorage cache helpers for offline boot ----------
  const cacheKeys = (eventId) => ({
    info: `feedback.eventInfo.${eventId}`,
    qns: `feedback.questions.${eventId}`,
  });

  const readOfflineCache = (eventId) => {
    try {
      const { info, qns } = cacheKeys(eventId);
      const cachedInfo = JSON.parse(localStorage.getItem(info) || "null");
      const cachedQns = JSON.parse(localStorage.getItem(qns) || "[]");
      return { cachedInfo, cachedQns };
    } catch {
      return { cachedInfo: null, cachedQns: [] };
    }
  };

  const writeOfflineCache = (eventId, info, qnsRaw) => {
    try {
      const { info: infoKey, qns: qnsKey } = cacheKeys(eventId);
      if (info) localStorage.setItem(infoKey, JSON.stringify(info));
      if (qnsRaw) localStorage.setItem(qnsKey, JSON.stringify(qnsRaw));
    } catch {
      // no-op
    }
  };

  // ---------- Boot sequence (offline-safe) ----------
  useEffect(() => {
    const boot = async () => {
      setIsLoading(true);
      setBootError(null);
      try {
        // eventId resolution (fallback to selectedEventId)
        const eventId =
          Number(decryptSession(localStorage.getItem("feedbackEventId"))) ||
          Number(decryptSession(localStorage.getItem("selectedEventId")));
        if (!eventId) {
          throw new Error("Missing event id");
        }

        const isOffline = status === "offline";

        if (isOffline) {
          // Try cached data first
          const { cachedInfo, cachedQns } = readOfflineCache(eventId);
          if (cachedInfo) setEventInformation(cachedInfo);
          if (cachedInfo?.thankyouTimeout)
            setConfirmedTimeout(cachedInfo.thankyouTimeout);

          if (cachedQns?.length) {
            setFeedbackQuestionResponses(
              cachedQns.map((q) => ({
                feedbackQuestionId: q.feedbackQuestionId,
                feedbackQuestion: q.feedbackQuestion,
                answer: null,
              })),
            );
          }

          if (!cachedInfo && (!cachedQns || !cachedQns.length)) {
            throw new Error("Offline and no cached event/questions available");
          }
        } else {
          // Online: fetch latest and cache
          const info = await getFeedbackInformationByEventId(eventId);
          const data = info?.data;
          if (!data || !data.feedbackStatus) {
            setEventInformation(null);
            throw new Error("Event not active or data unavailable");
          }
          setEventInformation(data);
          if (data.thankyouTimeout) setConfirmedTimeout(data.thankyouTimeout);

          const qRes = await getFeedbackQuestionsByEventId(eventId);
          const qnsRaw = qRes?.data ?? [];
          const qns = qnsRaw.map((q) => ({
            feedbackQuestionId: q.feedbackQuestionId,
            feedbackQuestion: q.feedbackQuestion,
            answer: null,
          }));
          setFeedbackQuestionResponses(qns);

          // cache for offline use
          writeOfflineCache(eventId, data, qnsRaw);
        }

        // Ensure a screen is visible
        const successFs = enterFullscreen();
        if (successFs) {
          setShowUserInfo(true);
          setShowFeedbackForm(false);
          setShowThankYou(false);
          setCurrentQuestionIndex(0);
          setUserInfo({ name: "", email: "" });
        } else {
          // Even if fullscreen fails, show something
          setShowUserInfo(true);
        }
      } catch (e) {
        console.error("Boot failed:", e);
        setBootError(e?.message || "Failed to initialize");
        // Show UserInfo so the app is never blank
        setShowUserInfo(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Only boot when this flow was launched earlier (keeps your existing behavior)
    const launched = decryptSession(localStorage.getItem("feedbackLaunched"));
    if (launched === "true") boot();
    // Re-run when connectivity changes to hydrate from cache or refetch
  }, [status]);

  // ---------- Email suggestions ----------
  useEffect(() => {
    let timer;
    const run = async () => {
      if (!userInfo.email.trim()) return setEmailSuggestions([]);
      try {
        const response = await searchEmployeesByEmail(userInfo.email);
        const list = (response?.data ?? [])
          .filter((emp) => emp.email?.trim())
          .map((emp) => ({ fullName: emp.fullName, email: emp.email }));
        setEmailSuggestions(list);
      } catch {
        setEmailSuggestions([]);
      }
    };
    if (status === "idle" || status === "online") {
      timer = setTimeout(run, 300);
    }
    return () => clearTimeout(timer);
  }, [userInfo.email, status]);

  // ---------- Thank You countdown ----------
  useEffect(() => {
    if (!showThankYou || !confirmedTimeout) return;
    setCountdown(confirmedTimeout);
    const interval = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) clearInterval(interval);
        return p - 1 >= 0 ? p - 1 : 0;
      });
    }, 1000);
    const timeout = setTimeout(
      () => {
        setShowThankYou(false);
        setShowUserInfo(true);
        setUserInfo({ email: "" });
        // reset answers
        setFeedbackQuestionResponses((prev) =>
          prev.map((q) => ({ ...q, answer: null })),
        );
        setCurrentQuestionIndex(0);
        setTemporaryFeedbackResponses([]);
      },
      confirmedTimeout * 1000 + 500,
    );
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showThankYou, confirmedTimeout]);

  // ---------- Block keys during active flow ----------
  useEffect(() => {
    const blockKeys = (e) => {
      const active = showUserInfo || showFeedbackForm || showThankYou;
      if (!active) return;
      const key = e.key?.toLowerCase?.() || "";
      if (
        key === "escape" ||
        key === "f11" ||
        ((e.ctrlKey || e.metaKey) && key === "r")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", blockKeys);
    return () => window.removeEventListener("keydown", blockKeys);
  }, [showUserInfo, showFeedbackForm, showThankYou]);

  // ---------- User info submit ----------
  const handleUserInfoSubmitFeedback = async () => {
    // Anonymous allowed?
    if (eventInformation?.isAnonymousFeedback) {
      setEmailError("");
      setIsAnonymous(true);
      setShowUserInfo(false);
      setShowFeedbackForm(true);
      return;
    }

    // Non-anonymous: validate & verify
    const email = userInfo.email.trim();
    const fullEmailRegex = /^[a-zA-Z0-9._%+\-]+@relevantz\.com$/i;
    const complete = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!complete || !fullEmailRegex.test(email)) {
      setEmailError("Please enter a valid organization email.");
      return;
    }

    try {
      const eventId = Number(
        decryptSession(localStorage.getItem("feedbackEventId")),
      );
      if (status === "idle" || status === "online") {
        const result = await getEmailVerification(email, eventId);
        const msg = (result?.message ?? "").toLowerCase();
        if (msg.includes("eligible")) {
          setIsAnonymous(false);
          setEmailError("");
          setShowUserInfo(false);
          setShowFeedbackForm(true);
        } else if (msg.includes("already submitted")) {
          setEmailError("You have already submitted feedback for this event.");
        } else {
          setEmailError("Email is not authorized for this event.");
        }
      } else {
        // Offline duplicate check in queued data
        const dup = offlineQueueData.find(
          (em) => em.data?.userPayload?.feedbackUserEmail === email,
        );
        if (dup) {
          setEmailError("You have already submitted feedback for this event.");
        } else {
          setIsAnonymous(false);
          setEmailError("");
          setShowUserInfo(false);
          setShowFeedbackForm(true);
        }
      }
    } catch (err) {
      console.error("Verification error", err);
      setEmailError("Verification failed. Please try again.");
    }
  };

  // ---------- Submit feedback ----------
  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const eventId =
        Number(
          decryptSession(localStorage.getItem("clickedFeedbackEventId")),
        ) || Number(decryptSession(localStorage.getItem("feedbackEventId")));

      const isActuallyAnonymous = !userInfo.email.trim();
      const matched = emailSuggestions.find((e) => e.email === userInfo.email);

      const userPayload = {
        feedbackUserName: isActuallyAnonymous
          ? "anonymous"
          : (matched?.fullName ?? "null"),
        feedbackUserEmail: isActuallyAnonymous
          ? "anonymous"
          : userInfo.email.trim(),
        eventId,
      };

      if (status === "online" || status === "idle") {
        const userResp = await addFeedbackUserDetails(userPayload);
        const feedbackUserId = userResp?.data?.feedbackUserId;
        if (!feedbackUserId)
          throw new Error("Feedback User ID not returned from API");

        const responsesPayload = {
          feedbackUserId,
          eventId: parseInt(eventId, 10),
          responses: temporaryFeedbackResponses,
          isAnonymous: isActuallyAnonymous,
        };
        await addFeedbackResponseDetails(responsesPayload);

        success("Submitted your Feedback!");
        setShowFeedbackForm(false);
        setShowThankYou(true);
      } else {
        // offline queue path
        const { sendDataToOfflineQueue } =
          await import("../../pwa/queue/apiQueue");
        const responsesPayload = {
          responses: temporaryFeedbackResponses,
          isAnonymous: isActuallyAnonymous,
        };
        setShowFeedbackForm(false);
        setShowThankYou(true);

        const data = { userPayload, responsesPayload, module: "feedback" };
        sendDataToOfflineQueue(data);
        setTriggerQueueFetch((n) => n + 1);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      error("Something went wrong while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Derived ----------
  const answeredCount = useMemo(
    () => feedbackQuestionResponses.filter((q) => q.answer != null).length,
    [feedbackQuestionResponses],
  );

  const eventName =
    decryptSession(localStorage.getItem("feedbackEventName")) ??
    eventInformation?.event?.eventName ??
    "";

  return (
    <>
      {/* Minimal fallback so there's never a blank page */}
      {!showUserInfo && !showFeedbackForm && !showThankYou && (
        <div style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
          {isLoading
            ? "Loading feedback screens…"
            : bootError
              ? `You're offline. Limited mode: ${bootError}`
              : null}
        </div>
      )}

      {showUserInfo && (
        <UserInfo
          eventInformation={eventInformation}
          eventName={eventName}
          assets={{ floatingGif, logoFeedback, relevantzWatermark, testlogo }}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          emailError={emailError}
          setEmailError={setEmailError}
          emailSuggestions={emailSuggestions}
          setEmailSuggestions={setEmailSuggestions}
          showEmailDropdown={showEmailDropdown}
          setShowEmailDropdown={setShowEmailDropdown}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          highlightedRef={highlightedRef}
          mouseDownRef={mouseDownRef}
          handleEmailInputChange={handleEmailInputChange}
          isEmailValid={isEmailValid}
          onContinue={handleUserInfoSubmitFeedback}
          onCloseFeedback={handleCloseFeedback}
        />
      )}

      {feedbackQuestionResponses.length > 0 && showFeedbackForm && (
        <FeedbackForm
          eventInformation={eventInformation}
          eventName={eventName}
          assets={{ poweredBy, questionicon }}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          feedbackQuestionResponses={feedbackQuestionResponses}
          onChangeAnswer={handleResponseChange}
          prevQuestion={prevQuestion}
          nextQuestion={nextQuestion}
          answeredCount={answeredCount}
          submitFeedback={submitFeedback}
          isSubmitting={isSubmitting}
        />
      )}

      {showThankYou && (
        <ThankYou
          countdown={countdown}
          isAnonymous={isAnonymous}
          userInfo={userInfo}
          emailSuggestions={emailSuggestions}
          assets={{ relevantzWatermark, testlogo }}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          passwordError={passwordError}
          onClose={() => setShowPasswordModal(false)}
          onVerify={() => handlePasswordSubmit(adminPassword)}
        />
      )}

      {showCloseFeedbackSuccess && <CloseFeedbackSuccess />}
    </>
  );
}
