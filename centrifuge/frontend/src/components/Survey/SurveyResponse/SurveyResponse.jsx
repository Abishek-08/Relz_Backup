import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BackgroundMedia from "./components/layout/BackgroundMedia";
import EntryScreen from "./components/EntryScreen";
import InternalEmailSuggest from "./components/InternalEmailSuggest";
import SurveyFlow from "./components/SurveyFlow";
import ThankyouScreen from "./components/ThankyouScreen";
import "./styles/surveyKiosk.css";
import axiosInstance from "../../../utils/axiosInstance";
import { decryptSession, encryptSession } from "../../../utils/SessionCrypto";
// import { subscribeChannel } from "../../../centrifuge/services/subscriptions";

// utils/hooks (reuse yours)
import { toMs } from "./utils/media";
import {
  restoreAnswers,
  persistAnswers,
  clearAnswers,
  ensureAnonymousId,
} from "./utils/storage";
import { getQuestionId, getType } from "./utils/surveyTypes";
import {
  validateQuestion,
  pageHasMissingRequired,
  normalizeMatrixValue,
} from "./utils/validation";
import { useQuestionTTL } from "./hooks/useQuestionTTL";
import { useIdleReset } from "./hooks/useIdleReset";
import { useSubmitWithRetry } from "./hooks/useSubmitWithRetry";
import {
  doAuthenticationForClosingFeedback,
  launchSurveyService,
  verifySurveyUser,
} from "../../../services/Services";
import { useNavigate } from "react-router-dom";
import { useSyncStatusContext } from "../../../context/SyncStatusContext";
import { sendDataToOfflineQueue } from "../../../pwa/queue/apiQueue";
import { useSelector } from "react-redux";
import { useAuth } from "../../../routes/AuthContext";

export default function SurveyResponse() {
  // stage: 'entry' | 'form' | 'thanks'
  const [stage, setStage] = useState("entry");
  const [payload, setPayload] = useState(null);
  const [answers, setAnswers] = useState(() => new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  const [anim, setAnim] = useState("right");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thank, setThank] = useState({ show: false, countdown: 0, name: "" });
  const [invalidQid, setInvalidQid] = useState(null);
  const [surveyUserEmail, setSurveyUserEmail] = useState("");

  // PWA-Implement
  const { status } = useSyncStatusContext();
  const { logout } = useAuth();

  // Centrifuge
  const showSurveyPageData = useSelector(
    (state) => state.survey.surveyShownData,
  );

  const onShowSurveyPage = (data) => {
    console.log("survey received:", data);
    setPayload(data);
    setActiveIndex(0);
    setAnswers(restoreAnswers(data?.eventId) || new Map());
  };

  // Effect to launch survey on mount
  // useEffect(() => {
  //   const email = (
  //     decryptSession(localStorage.getItem("email")) || ""
  //   ).toLowerCase();
  //   if (!email) return;

  //   launchSurveyService(email);
  // }, []);

  // Effect to handle survey data when it changes
  useEffect(() => {
    if (showSurveyPageData) {
      onShowSurveyPage(showSurveyPageData);
      console.log("show-surveypageData: ", showSurveyPageData);
    }
  }, [showSurveyPageData]);

  const navigate = useNavigate();

  // Background theme and event title
  const bgTheme = payload?.surveyInfo?.backgroundTheme || null;
  const eventName = payload?.eventName || "Event";

  // questions sorted/deduped
  const questions = useMemo(() => {
    const raw = payload?.questions ?? [];
    const byId = new Map();
    for (const q of raw) {
      const id = q?.surveyQuestionId ?? q?.id ?? q?._id;
      if (!byId.has(id)) byId.set(id, q);
    }
    const list = Array.from(byId.values());
    list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return list;
  }, [payload?.questions]);

  // persist answers
  useEffect(() => {
    if (payload?.eventId) persistAnswers(payload.eventId, answers);
  }, [answers, payload?.eventId]);

  useQuestionTTL({
    enabled: stage === "form" && !!questions.length,
    ttlMs: toMs(payload?.surveyInfo?.questionTTL ?? 120, "seconds"),
    watchValue: { activeIndex, answersSize: answers.size },
    onExpire: () => {
      setStage("entry");
      setActiveIndex(0);
      if (payload?.eventId) clearAnswers(payload.eventId);
      setAnswers(new Map());
    },
  });

  // idle reset (global)
  useIdleReset({
    enabled: true,
    timeoutMs: toMs(
      payload?.surveyInfo?.idleTimeoutValue ?? 90,
      payload?.surveyInfo?.idleTimeoutUnit ?? "seconds",
    ),
    onIdle: () => {
      setStage("entry");
      setActiveIndex(0);
      if (payload?.eventId) clearAnswers(payload.eventId);
      setAnswers(new Map());
    },
  });

  // Handles admin close from PasswordModal
  const handleCloseSurveyModal = async (pwd) => {
    try {
      const userEmail = decryptSession(localStorage.getItem("email")) || "";

      const response = await doAuthenticationForClosingFeedback(
        userEmail,
        (pwd || "").trim(),
      );

      // Robust parse
      const httpOk = response?.status >= 200 && response?.status < 300;
      const data = response?.data;

      const bodyText =
        typeof data === "string" ? data : (data?.message ?? data?.status ?? "");

      const msg = String(bodyText || "")
        .trim()
        .toLowerCase();

      const successFlag =
        data?.success === true ||
        data === true ||
        msg === "success" ||
        msg === "ok" ||
        (httpOk &&
          (msg === "success" ||
            msg === "ok" ||
            (typeof data === "string" &&
              data.trim().toLowerCase() === "success")));

      console.log(
        "Password modal response >",
        response?.data,
        "successFlag:",
        successFlag,
      );

      if (!successFlag) {
        return {
          success: false,
          message:
            (typeof data === "object" && data?.message) ||
            "Invalid login credentials. Please check your email and password.",
        };
      }

      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.log(err);
        }
      }
      logout();
      navigate("/login");

      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Authentication failed. Please try again.";
      return { success: false, message };
    }
  };

  // entry continue
  const handleEntryContinue = ({ email, mode }) => {
    if (mode === "anonymous" || !email) ensureAnonymousId();
    setSurveyUserEmail(email);
    setStage("form");
  };

  // verify email (unchanged gates)
  const verifyEmail = async (email, eventId) => {
    return await verifySurveyUser(email, eventId);
  };

  const setAnswer = useCallback(
    (qid, value) => {
      setAnswers((prev) => {
        const n = new Map(prev);
        n.set(qid, value);
        return n;
      });
      if (invalidQid === qid) setInvalidQid(null);
    },
    [invalidQid],
  );

  const submitWithRetry = useSubmitWithRetry({
    endpoint: "/surveyResponse/createMultipleSurveyResponses",
    axiosInstance,
  });

  const handleSubmit = async () => {
    if (!payload) return;

    if (pageHasMissingRequired(questions, answers)) {
      const firstInvalid = questions.find(
        (q) => !validateQuestion(q, answers.get(getQuestionId(q))),
      );
      if (firstInvalid) {
        const badId = getQuestionId(firstInvalid);
        setInvalidQid(badId);
        // also jump to it:
        const idx = questions.findIndex((q) => getQuestionId(q) === badId);
        if (idx >= 0) setActiveIndex(idx);
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const eventId = payload.eventId;
      const info = payload?.surveyInfo || {};
      const isAnonymous = !!info?.isAnonymousSurvey;
      const email = surveyUserEmail || "";
      var surveyUserId;

      // 3) thank you (seconds)
      const internal = (info?.emailMode || "external") === "internal";
      const name = internal
        ? (email.split("@")[0] || "")
            .split(".")
            .map((s) => s[0]?.toUpperCase() + s.slice(1))
            .join(" ")
        : "";
      const seconds = Math.max(1, Number(info?.thankyouTimeout ?? 5));

      if (status === "idle" || status === "online") {
        setThank({ show: true, countdown: seconds, name });
        setStage("thanks");
      }

      if (status === "idle" || status === "online") {
        // 1) create survey user
        const createRes = await axiosInstance.post(
          "/surveyUser/createSurveyUser",
          {
            surveyUserEmail: isAnonymous ? "anonymous" : email.trim(),
            eventId,
          },
        );
        surveyUserId = createRes?.data?.data?.surveyUserId;
        if (!surveyUserId) throw new Error("survey user not created");
      } else {
        setThank({ show: true, countdown: seconds, name });
        setStage("thanks");
      }

      // 2) build responses
      const responses = questions.map((q) => {
        const qid = getQuestionId(q);
        const t = getType(q);
        const raw = answers.get(qid);
        let v = null;
        if (t === "comment") v = (raw ?? "").toString();
        else if (t === "checkbox") v = Array.isArray(raw) ? raw : [];
        else if (t === "radio" || t === "dropdown") v = raw ?? "";
        else if (t === "slider" || t === "rating" || t === "star")
          v = String(raw ?? "");
        else if (t === "matrix") v = normalizeMatrixValue(q, raw);
        else v = raw ?? null;
        return { surveyQuestionId: qid, surveyResponse: v };
      });

      if (status === "idle" || status === "online") {
        await submitWithRetry({
          surveyUserId,
          eventId,
          isAnonymous,
          responses,
        });
      } else {
        setThank({ show: true, countdown: seconds, name });
        setStage("thanks");
        const offlineSuveyQueueData = {
          module: "survey",
          eventId,
          isAnonymous,
          responses,
          surveyUserEmail: isAnonymous ? "anonymous" : email.trim(),
        };
        sendDataToOfflineQueue(offlineSuveyQueueData);
      }

      // countdown then reset
      let c = seconds;
      const timer = setInterval(() => {
        c -= 1;
        setThank((s) => ({ ...s, countdown: Math.max(0, c) }));
        if (c <= 0) {
          clearInterval(timer);
          setStage("entry");
          setActiveIndex(0);
          if (payload?.eventId) clearAnswers(payload.eventId);
          setAnswers(new Map());
        }
      }, 1000);
    } catch (e) {
      console.error("submit error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kiosk-root">
      {/* <BackgroundMedia backgroundTheme={payload?.surveyInfo?.backgroundTheme} paused={stage === 'form'} /> */}

      {stage === "entry" && (
        <EntryScreen
          mode={
            payload?.surveyInfo?.isAnonymousSurvey
              ? "anonymous"
              : payload?.surveyInfo?.emailMode || "external"
          }
          InternalSuggest={(props) => (
            <InternalEmailSuggest {...props} primaryColor="#27235c" />
          )}
          onContinue={handleEntryContinue}
          onCloseSurvey={handleCloseSurveyModal}
          disabled={!!payload?.closed}
          eventName={payload?.eventName}
          verifyEmail={verifyEmail}
          eventId={payload?.eventId}
          primaryColor="#27235c"
          backgroundTheme={payload?.surveyInfo?.backgroundTheme}
        />
      )}

      {stage === "form" && (
        <SurveyFlow
          questions={questions}
          answers={answers}
          setAnswer={setAnswer}
          activeIndex={activeIndex}
          setActiveIndex={(i) => {
            setAnim(i < activeIndex ? "left" : "right");
            setActiveIndex(i);
          }}
          disabled={!!payload?.closed || isSubmitting}
          primaryColor="#27235c"
          onSubmit={handleSubmit}
          onBack={() => {
            if (activeIndex > 0) {
              setAnim("left");
              setActiveIndex((i) => i - 1);
            } else setStage("entry");
          }}
          onClearQuestion={(qid) => setAnswer(qid, null)}
          eventName={payload?.eventName}
          animDirection={anim}
          invalidQid={invalidQid}
        />
      )}

      {stage === "thanks" && (
        <ThankyouScreen
          name={thank.name}
          countdown={thank.countdown}
          isInternal={
            (payload?.surveyInfo?.emailMode || "external") === "internal"
          }
        />
      )}
    </div>
  );
}
