import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Settings as SettingsIcon,
  FilePlus2,
  ChevronDown,
  ChevronUp,
  Eye,
  History,
  ArrowLeft,
} from "lucide-react";
import {
  getAllEventCategoriesMinimal,
  getEventsByCategoryMinimal,
  getSurveyQuestionsByEventCategoryId,
  getSurveyQuestionsByEventAndEventCategoryId,
  addSurveyQuestionsAndLaunchFeedback,
  getEventById,
  launchSurveyService,
} from "../../../services/Services";
import { decryptSession } from "../../../utils/SessionCrypto";
import { useToast } from "../../../utils/useToast";
// import socket from "../../../../socket";

import EventFilterBar from "../SurveyBuilderComponents/EventFilterBar";
import SettingsPanel from "../SurveyBuilderComponents/SettingsPanel";
import QuestionComposer from "../SurveyBuilderComponents/QuestionComposer";
import QuestionLibrary from "../SurveyBuilderComponents/QuestionLibrary";
import StickyActions from "../SurveyBuilderComponents/StickyActions";
import Canvas from "../SurveyBuilderComponents/Canvas";
import Inspector from "../SurveyBuilderComponents/Inspector";
import { encryptSession } from "../../../utils/SessionCrypto";
import ThemePreviewModal from "../SurveyBuilderComponents/ThemePreviewModal";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import { stripInlineTags } from "../../../utils/richText";

export default function SurveyBuilderPage() {
  const { success, error } = useToast();

  /* session values */
  const sessionCategoryId = Number(
    decryptSession(localStorage.getItem("eventCategoryId")),
  );
  const sessionEventId = decryptSession(
    localStorage.getItem("selectedEventId"),
  );
  const surveyOwnerEmail = decryptSession(localStorage.getItem("email"));
  // const masterSocket =
  //   decryptSession(localStorage.getItem("masterSocket")) || "123jhv";

  /* data */
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [categoryId, setCategoryId] = useState(sessionCategoryId || null);
  // const [eventId, setEventId] = useState(
  //   sessionEventId && !Number.isNaN(Number(sessionEventId))
  //     ? Number(sessionEventId)
  //     : null,
  // );

  //;atest one
  const sessionEventIdNum =
    sessionEventId && !Number.isNaN(Number(sessionEventId))
      ? Number(sessionEventId)
      : null;
  const [filterEventId, setFilterEventId] = useState(sessionEventIdNum);

  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  /* ui */
  const [showSettings, setShowSettings] = useState(true); // open by default
  const [showInspector, setShowInspector] = useState(true); // collapsible inspector
  const [search, setSearch] = useState("");
  const dSearch = useDeferredValue(search);
  const [selectedPrev, setSelectedPrev] = useState(new Set());
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  /* settings (defaults + strict validation later) */
  const [responseMode, setResponseMode] = useState("anonymous");
  const [emailMode, setEmailMode] = useState(null);
  const [themeChoice, setThemeChoice] = useState("default"); // 'default' | 'custom'
  const [themeFile, setThemeFile] = useState(null);
  const [thankyouTimeout, setThankyouTimeout] = useState("5"); // default; editable as text
  const [idleTimeoutValue, setIdleTimeoutValue] = useState("10"); // default minutes
  const [idleTimeoutUnit, setIdleTimeoutUnit] = useState("minutes");
  const [isEditingTimeouts, setIsEditingTimeouts] = useState(false);
  const [showThemePreview, setShowThemePreview] = useState(false);

  /* loaders */
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [addingSelected, setAddingSelected] = useState(false);

  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");

  /* helpers */
  const normalize = (s = "") =>
    stripInlineTags(s).toLowerCase().replace(/\s+/g, " ").trim();
  const uniqueTrimmed = (arr = []) => {
    const seen = new Set();
    return (arr || [])
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter((v) => {
        if (!v) return false;
        const k = stripInlineTags(v).toLowerCase(); // compare plain text
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  };

  const preserveCanvasScroll = (fn) => {
    const el = document.querySelector("[data-canvas-scroll]");
    const y = el ? el.scrollTop : null;
    fn();
    requestAnimationFrame(() => {
      if (el && y !== null) el.scrollTop = y;
    });
  };

  /* categories */
  useEffect(() => {
    (async () => {
      setLoadingCats(true);
      try {
        const res = await getAllEventCategoriesMinimal();
        const list = Array.isArray(res?.data) ? res.data : [];
        setCategories(list);
        if (!categoryId && list.length) setCategoryId(list[0].eventCategoryId);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* events */
  useEffect(() => {
    if (!categoryId) return;
    (async () => {
      setLoadingEvents(true);
      try {
        const res = await getEventsByCategoryMinimal(categoryId);
        const list = Array.isArray(res?.data) ? res.data : [];
        setEvents(list);
      } catch {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [categoryId]);

  console.log("filtered event Id,", filterEventId);
  console.log("ession event Id,", sessionEventIdNum);

  //For getting event name
  useEffect(() => {
    if (!sessionEventIdNum) return;
    (async () => {
      try {
        const res = await getEventById(sessionEventIdNum);
        const eventName = res?.data?.eventName;
        console.log(
          "Event name fetched:",
          res,
          "Session Event Id:",
          sessionEventIdNum,
        );
        setEventName(eventName);
      } catch {
        setEventName("null");
      }
    })();
  }, [sessionEventIdNum]);

  const pageEventCategoryId = Number(
    decryptSession(localStorage.getItem("eventCategoryId")),
  );

  const preserveScroll = (fn) => {
    const doc = document.scrollingElement || document.documentElement;
    const winY = doc.scrollTop;

    const center = document.querySelector("[data-canvas-scroll]");
    const centerY = center ? center.scrollTop : null;

    fn();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (center && centerY !== null)
          center.scrollTo({ top: centerY, behavior: "instant" });
        doc.scrollTop = winY;
      });
    });
  };

  /* previous questions */
  useEffect(() => {
    if (!categoryId) return;

    setLoadingPrev(true);

    const fetchData = async () => {
      try {
        const res = filterEventId
          ? await getSurveyQuestionsByEventAndEventCategoryId(
              categoryId,
              filterEventId,
            )
          : await getSurveyQuestionsByEventCategoryId(categoryId);

        setPreviousQuestions(Array.isArray(res?.data) ? res.data : []);
      } catch {
        setPreviousQuestions([]);
      } finally {
        setLoadingPrev(false);
      }
    };

    fetchData();
  }, [categoryId, filterEventId]);

  /* filter prev list */
  const filteredPrevious = useMemo(() => {
    const list = Array.isArray(previousQuestions) ? previousQuestions : [];
    const needle = (dSearch || "").toLowerCase().trim();
    if (!needle) return list;
    return list.filter((q) =>
      (q.surveyQuestion || "").toLowerCase().includes(needle),
    );
  }, [previousQuestions, dSearch]);

  /* auto-select last question so inspector isn’t blank */
  useEffect(() => {
    if (questions.length && !activeQuestionId)
      setActiveQuestionId(questions[questions.length - 1].id);
    if (!questions.length) setActiveQuestionId(null);
  }, [questions, activeQuestionId]);

  /* question ops */
  const addPreviousQuestion = (pq, silent = false) => {
    const exists = questions.some(
      (q) =>
        normalize(q.text) === normalize(pq.surveyQuestion) &&
        q.type === pq.surveyQuestionType,
    );
    if (exists) {
      error("This question is already added.");
      return false;
    }

    setQuestions((prev) => [
      ...prev,
      {
        id: `${pq.surveyQuestionId || Date.now()}-${prev.length + 1}`,
        text: pq.surveyQuestion,
        type: pq.surveyQuestionType,
        options: ["checkbox", "radio", "dropdown"].includes(
          pq.surveyQuestionType,
        )
          ? uniqueTrimmed(pq.surveyCheckBoxOptions || [])
          : [],
        matrixRows: uniqueTrimmed(pq.matrixQnLabels || []),
        scaleLabels: uniqueTrimmed(pq.scaleLabels || []),
        scaleMin: ["rating", "slider", "star"].includes(pq.surveyQuestionType)
          ? (pq.scaleMin ?? 0)
          : 0,
        scaleMax: ["rating", "slider", "star"].includes(pq.surveyQuestionType)
          ? (pq.scaleMax ?? 5)
          : pq.surveyQuestionType === "matrix"
            ? Math.max(1, (pq.scaleLabels || []).length || 1)
            : 5,
        required: !!pq.required,
        displayOrder: prev.length + 1,
      },
    ]);
    if (!silent) {
      success("Question added.");
    }
    return true;
  };

  const onUpdate = (id, changes) =>
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, ...changes } : q));
      const edited = next.find((q) => q.id === id);
      if (!edited) return prev;

      // duplicate warning when text/type changes
      const textChanged = Object.prototype.hasOwnProperty.call(changes, "text");
      const typeChanged = Object.prototype.hasOwnProperty.call(changes, "type");

      if (textChanged || (typeChanged && changes.type !== edited.type)) {
        const desired = (
          ("text" in changes ? changes.text : edited.text) || ""
        ).trim();
        const desiredType = "type" in changes ? changes.type : edited.type;
        if (desired) {
          const dupExists = next.some(
            (qq) =>
              qq.id !== id &&
              qq.type === desiredType &&
              (qq.text || "").trim().toLowerCase() === desired.toLowerCase(),
          );
          edited.dupWarning = dupExists;
        } else {
          edited.dupWarning = false;
        }
      }

      // enforce scale label count ≤ points
      if (["rating", "slider", "star", "matrix"].includes(edited.type)) {
        const points =
          edited.type === "matrix"
            ? Math.max(1, (edited.scaleLabels || []).filter(Boolean).length)
            : Math.max(
                1,
                Number(edited.scaleMax ?? 0) - Number(edited.scaleMin ?? 0) + 1,
              );
        if ((edited.scaleLabels || []).filter(Boolean).length > points) {
          // trim extra labels
          edited.scaleLabels = (edited.scaleLabels || []).slice(0, points);
          error("Trimmed extra scale labels to match the selected scale.");
        }
      }

      return next.map((q) => (q.id === id ? edited : q));
    });

  /* add new */
  const addNewQuestion = (newQ) => {
    const text = (newQ.text || "").trim();
    if (!text) {
      error("Question text is required.");
      return;
    }

    const isDup = questions.some(
      (q) => normalize(q.text) === normalize(text) && q.type === newQ.type,
    );
    if (isDup) {
      error("Same question with same type already exists.");
      return;
    }

    const rawOptions = (newQ.options || []).map((s) => String(s || ""));
    const seen = new Set();
    const options = [];
    rawOptions.forEach((o) => {
      const k = stripInlineTags(o).toLowerCase().trim();
      if (!k) return;
      if (!seen.has(k)) {
        seen.add(k);
        options.push(o);
      }
    });
    const trimmed = rawOptions.filter(Boolean).length - options.length;

    const rows = uniqueTrimmed(newQ.matrixRows || []);
    const labels = uniqueTrimmed(newQ.scaleLabels || []);

    if (
      ["checkbox", "radio", "dropdown"].includes(newQ.type) &&
      options.length === 0
    ) {
      error("Add at least one non-empty option.");
      return;
    }
    if (newQ.type === "matrix" && (!rows.length || !labels.length)) {
      error("Matrix needs at least one Row and one Column.");
      return;
    }

    // scale validation & label count ≤ points
    let scaleMin = Number(newQ.scaleMin ?? 0);
    let scaleMax = Number(newQ.scaleMax ?? 5);
    if (["rating", "slider", "star"].includes(newQ.type)) {
      if (
        !(
          Number.isFinite(scaleMin) &&
          Number.isFinite(scaleMax) &&
          scaleMin < scaleMax
        )
      ) {
        error("Scale must be valid and min < max.");
        return;
      }
      const pts = scaleMax - scaleMin + 1;
      if (labels.length > pts) {
        error("Scale labels exceed number of points.");
        return;
      }
    }
    if (newQ.type === "matrix") {
      scaleMin = 1;
      scaleMax = Math.max(1, labels.length || 1);
    }

    setQuestions((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        text,
        type: newQ.type,
        options,
        matrixRows: rows,
        scaleLabels: labels,
        scaleMin,
        scaleMax,
        required: !!newQ.required,
        starWeights: newQ.starWeights || [],
        displayOrder: prev.length + 1,
      },
    ]);
    setActiveQuestionId(null);
    success(
      `Question added.${trimmed > 0 ? " Duplicate options trimmed." : ""}`,
    );
  };

  const handleUpdateQuestion = (id, changes) => {
    preserveCanvasScroll(() =>
      setQuestions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      ),
    );
  };

  const handleAddSelected = async () => {
    if (selectedPrev.size === 0) return;
    setAddingSelected(true);
    try {
      let added = 0;

      preserveScroll(() => {
        const keys = Array.from(selectedPrev);
        keys.forEach((key) => {
          const pq = filteredPrevious.find(
            (item, idx) =>
              (item.surveyQuestionId ?? `${item.surveyQuestion}-${idx}`) ===
              key,
          );
          if (!pq) return;
          const normalized = (pq.surveyQuestion || "").trim().toLowerCase();
          const exists = questions.some(
            (qq) =>
              qq.type === pq.surveyQuestionType &&
              (qq.text || "").trim().toLowerCase() === normalized,
          );
          if (!exists) {
            // silent add (no toast)
            addPreviousQuestion(pq, true);
            added++;
          }
        });
      });

      if (added > 0) success(`Added ${added} question${added > 1 ? "s" : ""}.`);
    } finally {
      setSelectedPrev(new Set());
      setAddingSelected(false);
    }
  };

  /* live preview (new tab) with robust media tag) */

  function openPreviewInNewTab() {
    const data = {
      questions,
      themeChoice,
      responseMode,
      emailMode,
      thankyouTimeout,
      idleTimeoutValue,
      idleTimeoutUnit,
    };

    // Persist a Blob URL for the file (do NOT revoke it here)
    const payload = { ...data };

    if (themeChoice === "custom" && themeFile) {
      const blobUrl = URL.createObjectURL(themeFile);
      payload.themeUrl = blobUrl;
      payload.themeType = themeFile.type || null;
      payload.themeIsVideo =
        !!themeFile.type && themeFile.type.startsWith("video/");
    } else {
      payload.themeUrl = null; // preview page will use fish.mp4
      payload.themeType = "image/gif";
      payload.themeIsVideo = false; // default fish.mp4 is a video
    }

    try {
      localStorage.setItem(
        "encSurveyPreview",
        encryptSession(JSON.stringify(payload)),
      );
    } catch {
      localStorage.setItem(
        "encSurveyPreview",
        encryptSession(JSON.stringify(payload)),
      );
    }

    window.open("/surveyPreview", "_blank");
  }

  const launchSurveyPublish = () => {
    const email = decryptSession(localStorage.getItem("email"))
      ?.trim()
      .toLowerCase();
    if (email) {
      launchSurveyService(email);
    }
  };

  /* launch (final validation) */
  const launchSurvey = async () => {
    if (themeChoice === "custom" && !themeFile) {
      error(
        "Please upload a GIF or MP4 for the custom theme, or switch to Default.",
      );
      return;
    }
    if (!questions.length) {
      error("Add at least one question.");
      return;
    }
    if (questions.some((q) => q.dupWarning)) {
      error("Resolve duplicate questions before launching.");
      return;
    }

    if (thankyouTimeout !== "") {
      const ty = Number(thankyouTimeout);
      if (!Number.isFinite(ty) || ty < 0 || ty > 30) {
        error("Thank you timeout must have an value between 0–30 seconds.");
        return;
      }
    }
    const idle = Number(idleTimeoutValue);
    if (idleTimeoutUnit === "minutes") {
      if (!Number.isFinite(idle) || idle < 10 || idle > 99) {
        error("Idle timeout (minutes) must be between 10 and 99.");
        return;
      }
    } else {
      if (!Number.isFinite(idle) || idle < 1 || idle > 10) {
        error("Idle timeout (hours) must be between 1 and 10.");
        return;
      }
    }

    const apiQuestions = questions.map((q, idx) => {
      const trim = (arr = []) =>
        (arr || []).map((s) => (s || "").trim()).filter(Boolean);

      const isMatrix = q.type === "matrix";
      const opts = ["checkbox", "radio", "dropdown"].includes(q.type)
        ? trim(q.options)
        : [];
      const rows = isMatrix ? trim(q.matrixRows) : [];
      const labels = ["rating", "slider", "star", "matrix"].includes(q.type)
        ? trim(q.scaleLabels)
        : [];

      return {
        surveyQuestion: q.text,
        surveyQuestionType: q.type,
        surveyCheckBoxOptions: opts,
        matrixQnLabels: rows,
        scaleLabels: labels,
        scaleMin: ["rating", "slider", "star"].includes(q.type)
          ? q.scaleMin
          : isMatrix
            ? 1
            : undefined,
        scaleMax: ["rating", "slider", "star"].includes(q.type)
          ? q.scaleMax
          : isMatrix
            ? Math.max(1, labels.length || 1)
            : undefined,
        required: !!q.required,
        displayOrder: idx + 1,
      };
    });

    const formData = new FormData();
    formData.append(
      "eventId",
      String(sessionEventIdNum ?? sessionEventId ?? ""),
    );
    formData.append("surveyOwnerEmail", surveyOwnerEmail ?? "");
    formData.append("masterSocket", "true");
    formData.append("isAnonymousSurvey", String(responseMode === "anonymous"));
    if (responseMode === "email") {
      if (!emailMode) {
        error("Please select Internal or External for email mode.");
        return;
      }
      formData.append("emailMode", emailMode);
    }
    formData.append(
      "thankyouTimeout",
      thankyouTimeout === ""
        ? "0"
        : String(Math.min(30, Math.max(0, Number(thankyouTimeout)))),
    );
    formData.append("idleTimeoutValue", String(idleTimeoutValue || ""));
    formData.append("idleTimeoutUnit", idleTimeoutUnit);
    formData.append("questions", JSON.stringify(apiQuestions));
    if (themeChoice === "custom" && themeFile)
      formData.append("backgroundTheme", themeFile);

    setLaunching(true);
    try {
      await addSurveyQuestionsAndLaunchFeedback(formData);
      success("Survey launched!");

      localStorage.setItem("surveyLaunched", encryptSession("true").toString());
      localStorage.setItem(
        "surveyEventId",
        encryptSession(String(sessionEventId)).toString(),
      );
      // localStorage.setItem("socket", encryptSession(socket.id).toString());
      // localStorage.setItem("masterSocket", encryptSession("true").toString());

      // Emit sockets for survey (mirror feedback flow)

      launchSurveyPublish();

      navigate("/surveyResponse");
    } catch (e) {
      console.error(e);
      error("Failed to launch survey.");
    } finally {
      setLaunching(false);
    }
  };

  const activeQuestion =
    questions.find((q) => q.id === activeQuestionId) || null;

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-100">
        {/* Header */}
        <header className="relative px-4 md:px-6 py-4 flex items-center">
          {/* Back button on the left */}
          <button
            onClick={() => {
              localStorage.removeItem("selectedEventId");
              navigate(`/events/${pageEventCategoryId}`);
            }}
            style={{ backgroundColor: "#274c77" }}
            className="cursor-pointer absolute left-4 md:left-6 group flex items-center space-x-3 backdrop-blur-lg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:opacity-80 transition-all duration-300 border border-gray-600/50 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300" />
            <span>Back to Events</span>
          </button>

          {/* Centered heading */}
          <h1 className="mx-auto text-3xl font-bold text-[#274c77] flex items-center gap-2">
            <ListChecks size={20} /> Creating Survey for {eventName}
          </h1>
        </header>

        {/* SETTINGS (open by default; enhanced layout) */}
        <div className="px-4 md:px-6">
          <div className="bg-white rounded-xl shadow">
            <button
              type="button"
              className="cursor-pointer w-full flex items-center justify-between px-4 py-3"
              onClick={() => setShowSettings((v) => !v)}
              aria-expanded={showSettings}
            >
              <span className="text-sm font-semibold text-[#274c77] inline-flex items-center gap-2">
                <SettingsIcon size={16} /> Survey Settings
              </span>
              {showSettings ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            <AnimatePresence initial={false}>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="px-4 pb-4">
                    <SettingsPanel
                      responseMode={responseMode}
                      setResponseMode={setResponseMode}
                      emailMode={emailMode}
                      setEmailMode={setEmailMode}
                      themeChoice={themeChoice}
                      setThemeChoice={setThemeChoice}
                      themeFile={themeFile}
                      setThemeFile={setThemeFile}
                      isEditingTimeouts={isEditingTimeouts}
                      setIsEditingTimeouts={setIsEditingTimeouts}
                      thankyouTimeout={thankyouTimeout}
                      setThankyouTimeout={setThankyouTimeout}
                      idleTimeoutValue={idleTimeoutValue}
                      setIdleTimeoutValue={setIdleTimeoutValue}
                      idleTimeoutUnit={idleTimeoutUnit}
                      setIdleTimeoutUnit={setIdleTimeoutUnit}
                      onSaveTimeouts={() => {
                        // validate on save (requested behavior #5)
                        if (thankyouTimeout !== "") {
                          const ty = Number(thankyouTimeout);
                          if (!Number.isFinite(ty) || ty < 0 || ty > 30) {
                            error(
                              "Max 30 seconds allowed for Thank you timeout.",
                            );
                            return false;
                          }
                        }
                        const idle = Number(idleTimeoutValue);
                        if (idleTimeoutUnit === "minutes") {
                          if (
                            !Number.isFinite(idle) ||
                            idle < 10 ||
                            idle > 99
                          ) {
                            error("Minutes must be 10–99.");
                            return false;
                          }
                        } else {
                          if (!Number.isFinite(idle) || idle < 1 || idle > 10) {
                            error("Hours must be 1–10.");
                            return false;
                          }
                        }
                        return true;
                      }}
                      error={error}
                      onOpenThemePreview={() => {
                        if (themeChoice === "custom" && !themeFile) {
                          error("Upload a theme first.");
                          return;
                        }
                        setShowThemePreview(true);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main grid: Left Library + Canvas + Inspector */}
        <div className="px-4 md:px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_380px] gap-3 lg:gap-4 min-h-0">
            {/* LEFT: Previous Questions (viewport-capped; inner body scrolls; footer always visible) */}
            <aside className=" bg-white rounded-xl shadow flex flex-col min-h-0 self-start h-auto lg:sticky lg:top-4 lg:h-[calc(100vh-112px)] ">
              <div className="bg-white rounded-xl shadow flex flex-col h-[calc(100vh-112px)] min-h-0">
                {/* Header */}
                <div className="px-4 py-3 border-b bg-white sticky top-0 z-10 rounded-t-xl">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#274c77]">
                    <span className="inline-flex items-center justify-center w-5 h-4 rounded text-[10px]">
                      <History />
                    </span>
                    Previous Questions
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-b">
                  <EventFilterBar
                    categories={categories}
                    events={events}
                    categoryId={categoryId}
                    eventId={filterEventId}
                    onCategoryChange={setCategoryId}
                    onEventChange={setFilterEventId}
                  />
                  <div className="px-3 pb-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Search
                    </label>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search previous questions..."
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 overflow-y-auto rounded-b-xl">
                  <QuestionLibrary
                    loading={loadingPrev}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    eventId={filterEventId}
                    setEventId={setFilterEventId}
                    search={search}
                    setSearch={setSearch}
                    list={filteredPrevious}
                    questions={questions}
                    selectedPrev={selectedPrev}
                    setSelectedPrev={setSelectedPrev}
                    addOne={addPreviousQuestion}
                    addSelected={handleAddSelected}
                    addingSelected={addingSelected}
                    error={error}
                  />
                </div>
              </div>
            </aside>

            {/* CENTER: Composer + Canvas */}
            <div className="space-y-6 ">
              <section className="bg-white rounded-xl p-4 md:p-6 shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#274c77] flex items-center gap-2">
                    <FilePlus2 size={16} /> Question Composer
                  </h3>
                </div>
                <div className="mt-3">
                  <QuestionComposer onSubmit={addNewQuestion} error={error} />
                </div>
              </section>

              <Canvas
                questions={questions}
                onUpdate={handleUpdateQuestion}
                onDelete={(id) =>
                  preserveCanvasScroll(() =>
                    setQuestions((prev) =>
                      prev
                        .filter((q) => q.id !== id)
                        .map((q, i) => ({ ...q, displayOrder: i + 1 })),
                    ),
                  )
                }
                onDuplicate={(q) =>
                  preserveCanvasScroll(() => {
                    const base = q.text || "";
                    let name = base;
                    let i = 1;
                    while (
                      questions.some(
                        (it) =>
                          it.type === q.type &&
                          it.text.trim().toLowerCase() ===
                            name.trim().toLowerCase(),
                      )
                    ) {
                      name = `${base} (${i++})`;
                    }
                    setQuestions((prev) => [
                      ...prev,
                      {
                        ...q,
                        id: `copy-${Date.now()}`,
                        text: name,
                        displayOrder: prev.length + 1,
                      },
                    ]);
                    success("Question duplicated.");
                  })
                }
                onMoveUp={(id) =>
                  preserveCanvasScroll(() => {
                    const idx = questions.findIndex((q) => q.id === id);
                    if (idx <= 0) return;
                    const reordered = [...questions];
                    const [it] = reordered.splice(idx, 1);
                    reordered.splice(idx - 1, 0, it);
                    setQuestions(
                      reordered.map((q, i) => ({ ...q, displayOrder: i + 1 })),
                    );
                  })
                }
                onMoveDown={(id) =>
                  preserveCanvasScroll(() => {
                    const idx = questions.findIndex((q) => q.id === id);
                    if (idx < 0 || idx >= questions.length - 1) return;
                    const reordered = [...questions];
                    const [it] = reordered.splice(idx, 1);
                    reordered.splice(idx + 1, 0, it);
                    setQuestions(
                      reordered.map((q, i) => ({ ...q, displayOrder: i + 1 })),
                    );
                  })
                }
                onReorder={(reordered) => setQuestions(reordered)}
                setActiveQuestionId={setActiveQuestionId}
                isDraggable={true}
              />
            </div>

            <Inspector
              open={showInspector}
              setOpen={setShowInspector}
              hasSelection={!!activeQuestion}
              question={activeQuestion}
              onUpdate={(changes) => {
                if (!activeQuestion) return;
                onUpdate(activeQuestion.id, changes);
              }}
            />
          </div>
        </div>

        <ThemePreviewModal
          open={showThemePreview}
          onClose={() => setShowThemePreview(false)}
          file={themeChoice === "custom" ? themeFile : null}
        />

        {/* Sticky actions (z-index high to avoid overlap) */}
        <div className="px-4 md:px-6  flex-shrink-0">
          <StickyActions
            onPreview={() => {
              if (!questions.length) {
                error("Add at least one question to preview.");
                return;
              }
              openPreviewInNewTab();
            }}
            onLaunch={launchSurvey}
            launching={launching}
          />
        </div>
      </div>
    </>
  );
}
