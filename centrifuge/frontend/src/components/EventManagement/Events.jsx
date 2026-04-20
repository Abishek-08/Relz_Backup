import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Info,
  Upload,
  Image,
  BarChart3,
  X,
  Plus,
  Camera,
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  FileText,
  Database,
  Search,
  BadgeQuestionMark,
  CircleQuestionMark,
  XCircle,
  LockKeyholeOpen,
  Save,
  ListTodoIcon,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import MediaGallery from "./MediaGallery";
import MediaUploader from "./MediaUploader";
import UploadedMediaManager from "./UploadedMediaManager.jsx";
import { data, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  ArrowRight,
  Send,
  Check,
  Lock,
  CheckCircle,
} from "lucide-react";
import liveaaLogo from "/assets/logo.jpg";
import logoFeedback from "/assets/logo_feedback.jpg";
// import socket from "../../../socket.js";

import floatingGif from "/assets/FeedbackDefaultTheme.mp4";

import {
  addEvent,
  getEventsByEventCategoryId,
  getEventById,
  getResourcesByEventId,
  getGenderAnalytics,
  getEventCategoryByEventCategoryId,
  updateEvent,
  deleteEvent,
  addFeedbackQuestion,
  getFeedbackQuestionsByEventId,
  doAuthenticationForClosingFeedback,
  addFeedbackUserDetails,
  addFeedbackResponseDetails,
  getFeedbackResponsesByEventId,
  searchEmployeesByEmail,
  getAllFeedbackQuestions,
  updateFeedbackInformation,
  getFeedbackInformationByEventId,
  getQuestionsByEventCategory,
  getQuestionsByEventCategoryAndEventId,
  getEmailVerification,
  updateFeedbackReOpen,
  launchFeedbackService,
} from "../../services/Services";
import { useToast } from "../../utils/useToast.js";
import NoEventSelected from "./NoEventSelected";
import { toast } from "sonner";
import FeedbackResponse from "./FeedbackResponse";
import DashboardEvents from "./DashboardEvents";
import watermark from "/assets/trace.svg";
import relevantzWatermark from "/assets/Relevantz_Blue_Watermark.png";
import poweredBy from "/assets/R2DC_PoweredBy.jpg";
import r2dclogo from "/assets/R2DC_Feedback_Test.png";
import testlogo from "/assets/R2DC_final_right_side.png";
import questionicon from "/assets/questionicon.png";
import ButtonLoader from "../../utils/ButtonLoader.jsx";
import { encryptSession, decryptSession } from "../../utils/SessionCrypto.jsx";
import Loader from "../Loader/Loader.jsx";
import { FaFilePdf } from "react-icons/fa";
import { sendDataToOfflineQueue } from "../../pwa/queue/apiQueue.js";
import { useSyncStatusContext } from "../../context/SyncStatusContext.js";
import { openDB } from "idb";

const statusColors = {
  Created: "bg-blue-500 text-white",
  Inprogress: "bg-yellow-300 text-black",
  Completed: "bg-green-500 text-white",
};

const Events = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error } = useToast();
  const [countdown, setCountdown] = useState(0);
  const eventCategoryId = Number(
    decryptSession(localStorage.getItem("eventCategoryId")),
  );
  const eventObjIdForSurveyReport = decryptSession(
    localStorage.getItem("eventObjId"),
  );

  console.log("for survey id", eventObjIdForSurveyReport);
  const [eventCategory, setEventCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [oneEvent, setOneEvent] = useState(null);
  const [genderAnalytics, setGenderAnalytics] = useState(null);
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedEventId, setSelectedEventId] = useState(null);
  const [emailError, setEmailError] = useState("");
  const hasShownToast = useRef(false);

  const [
    selectedFeedbackCompletedEventId,
    setSelectedFeedbackCompletedEventId,
  ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({ text: "" });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackQuestionResponses, setFeedbackQuestionResponses] = useState(
    [],
  );
  const [isFullscreenLocked, setIsFullscreenLocked] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [showThankYou, setShowThankYou] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showFinalThankYou, setShowFinalThankYou] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCloseFeedbackSuccess, setShowCloseFeedbackSuccess] =
    useState(false);
  const [selectedFeedbackEventId, setSelectedFeedbackEventId] = useState(null);
  const [showFeedbackResponse, setShowFeedbackResponse] = useState(false);
  const [temporaryFeedbackResponses, setTemporaryFeedbackResponses] = useState(
    [],
  );

  const [selectedEventId, setSelectedEventId] = useState("");
  const [feedbackModalEventId, setFeedbackModalEventId] = useState("");

  const [questionBankLoading, setQuestionBankLoading] = useState(false);
  const [questionBankError, setQuestionBankError] = useState(null);
  const [rawQuestionResponse, setRawQuestionResponse] = useState(null);
  const token = localStorage.getItem("token");

  const [feedbackResponseData, setFeedbackResponseData] = useState([]);
  const [showForceCloseModal, setShowForceCloseModal] = useState(false);
  const eventImagesURL = `${
    import.meta.env.VITE_BACKEND_BASE_URL
  }/uploads/images`;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionBank, setQuestionBank] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedQuestion, setDraggedQuestion] = useState(null);
  const [allowAnonymous, setAllowAnonymous] = useState(null);
  const eventFeedbackInformationId = Number(
    decryptSession(localStorage.getItem("feedbackEventId")),
  );
  const [eventInformation, setEventInformation] = useState(null);
  const [thankYouTimeout, setThankYouTimeout] = useState(5); // for editing
  const [confirmedTimeout, setConfirmedTimeout] = useState(5); // saved value
  const [isEditingTimeout, setIsEditingTimeout] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const DEFAULT_THEME = "default theme selected";
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const [confirmedIdleTimeoutValue, setConfirmedIdleTimeoutValue] =
    useState(20);
  const [confirmedIdleTimeoutUnit, setConfirmedIdleTimeoutUnit] =
    useState("minutes");
  const [idleTimeoutValue, setIdleTimeoutValue] = useState(
    confirmedIdleTimeoutValue || 20,
  );
  const [idleTimeoutUnit, setIdleTimeoutUnit] = useState(
    confirmedIdleTimeoutUnit || "minutes",
  );

  const [isEditingIdleTimeout, setIsEditingIdleTimeout] = useState(false);

  const [idleTimeoutError, setIdleTimeoutError] = useState("");
  const [idleTimeoutSuccess, setIdleTimeoutSuccess] = useState(false);

  const backgroundBaseURL = `${import.meta.env.VITE_BACKEND_BASE_URL}${
    import.meta.env.VITE_BACKGROUND_VIDEO_PATH
  }`;

  const [previewOpen, setPreviewOpen] = useState(false);

  const inputRef = useRef(null);

  const [hydrated, setHydrated] = useState(false);

  // PWA-Implement
  const { status } = useSyncStatusContext();
  const [offlineQueueData, setOfflineQueueData] = useState();
  const [triggetOfflineQueueFetch, setTriggerOfflineQueueFetch] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const db = await openDB("offline-db", 1);
      const allItems = await db.getAll("api-queue");
      setOfflineQueueData(
        allItems.filter((item) => item.data.module === "feedback"),
      );
    };
    fetchData();
  }, [triggetOfflineQueueFetch]);

  function toMilliseconds(value, unit = "minutes") {
    switch (unit) {
      case "hours":
        return value * 60 * 60 * 1000;
      case "minutes":
        return value * 60 * 1000;
      case "seconds":
        return value * 1000;
      default:
        return value * 60 * 1000;
    }
  }

  useEffect(() => {
    const enc = localStorage.getItem("selectedEventId");
    if (enc) {
      const id = Number(decryptSession(enc));
      if (Number.isFinite(id) && id > 0) {
        setSelectedEventId(id);
      }
    }
    setHydrated(true);
  }, []);

  const formatDate = (input) => {
    if (!input) return "Invalid date";

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return "Invalid date";

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year} - ${hours}:${minutes}${ampm}`;
  };

  useEffect(() => {
    if (showReopenModal && eventInformation) {
      setAllowAnonymous(eventInformation.isAnonymousFeedback);
      setConfirmedTimeout(eventInformation.thankyouTimeout);
      setThankYouTimeout(eventInformation.thankyouTimeout);
      setConfirmedIdleTimeoutUnit(eventInformation.idleTimeoutUnit);
      setConfirmedIdleTimeoutValue(eventInformation.idleTimeoutValue);

      const theme = eventInformation.backgroundTheme?.toLowerCase();
      const isCustom = theme && theme !== DEFAULT_THEME;

      setUseCustomTheme(isCustom);

      if (isCustom) {
        setFeedbackEditUploadedFile({
          name: theme,
          type: theme.endsWith(".gif") ? "image/gif" : "video/mp4",
          url: `${backgroundBaseURL}/${encodeURIComponent(theme)}`,
        });

        setUploadedBackgroundThemeFile(null);
      } else {
        setUploadedBackgroundThemeFile(null);
      }
    }
  }, [showReopenModal]);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait && !hasShownToast.current) {
        toast.info(
          "For best experience, please rotate your device to landscape view",
        );
        hasShownToast.current = true;
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  useEffect(() => {
    if (isEditingTimeout && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTimeout]);

  useEffect(() => {
    if (isEditingIdleTimeout && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingIdleTimeout]);

  const filteredList = filteredEvents.filter((event) =>
    searchTerm.toLowerCase() === "all events"
      ? true
      : event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReopenFeedback = async () => {
    try {
      setIsLoading(true);
      const eventId = Number(
        decryptSession(localStorage.getItem("selectedEventId")),
      );
      const email = decryptSession(localStorage.getItem("email"))
        ?.trim()
        .toLowerCase();

      if (!eventId) {
        console.warn("Missing eventId — set it when feedback launches.");
        return;
      }
      if (!email) {
        console.warn(
          "Missing email — set it in localStorage when user info is collected.",
        );
        return;
      }

      // Store socket info
      // localStorage.setItem("socket", encryptSession(masterSocket).toString());

      localStorage.setItem(
        "feedbackLaunched",
        encryptSession("true").toString(),
      );
      localStorage.setItem(
        "feedbackEventId",
        encryptSession(String(eventId)).toString(),
      );

      const formData = new FormData();
      formData.append("masterSocket", "true");
      formData.append("isAnonymousFeedback", allowAnonymous);
      formData.append("thankyouTimeout", thankYouTimeout);
      formData.append("idleTimeoutValue", idleTimeoutValue);
      formData.append("idleTimeoutUnit", idleTimeoutUnit);

      if (useCustomTheme && feedbackEditUploadedFile?.url instanceof File) {
        formData.append("backgroundTheme", feedbackEditUploadedFile.url);
      } else if (useCustomTheme && feedbackEditUploadedFile?.name) {
        formData.append("backgroundTheme", feedbackEditUploadedFile.name);
      } else if (!useCustomTheme) {
        formData.append("backgroundTheme", "Default Theme Selected");
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await updateFeedbackReOpen(eventId, formData);

      if (response?.status === 200) {
        success("Feedback reopened successfully!");
        // socket.emit("launchFeedback", email);
        // socket.emit("idleTimeoutUnit", confirmedIdleTimeoutUnit);
        // socket.emit("idleTimeoutValue", confirmedIdleTimeoutValue);

        const updatedInfo = await getFeedbackInformationByEventId(eventId);
        setEventInformation(updatedInfo.data);
        localStorage.setItem(
          "feedbackEventName",
          encryptSession(updatedInfo.data.event?.eventName).toString(),
        );

        const questionRes = await getFeedbackQuestionsByEventId(eventId);
        setFeedbackQuestionResponses(questionRes.data);

        const fullscreenSuccess = await enterFullscreen();
        if (fullscreenSuccess) {
          navigate("/feedbackCollection");
        }

        setShowReopenModal(false);
      } else {
        error("Failed to reopen feedback");
      }
    } catch (err) {
      console.error("Error reopening feedback:", err);
      error("Something went wrong while reopening feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeoutSubmit = () => {
    const timeoutValue = Number(thankYouTimeout);

    if (isNaN(timeoutValue) || timeoutValue < 1 || timeoutValue > 15) {
      setTimeoutError(true);
      setShowConfirmation(false);
      setTimeout(() => {
        setTimeoutError(false);
      }, 1000);
    } else {
      setConfirmedTimeout(timeoutValue);
      setTimeoutError(false);
      setIsEditingTimeout(false);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 1000);
    }
  };

  const [formData, setFormData] = useState({
    eventName: "",
    eventPoster: null,
    eventDescription: "",
    eventDate: "",
    createdBy: "",
    eventCategoryId: 0,
  });
  const [editedEvent, setEditedEvent] = useState({
    eventPoster: "",
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventStatus: "",
    eventOrganizer: "",
  });
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const modalRef = useRef();
  const highlightedRef = useRef(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const mouseDownRef = useRef(false);
  const [useCustomTheme, setUseCustomTheme] = useState(false);
  const [uploadedBackgroundThemeFile, setUploadedBackgroundThemeFile] =
    useState(null);
  const [uploadError, setUploadError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const email = decryptSession(localStorage.getItem("email"));
  const [feedbackEditUploadedFile, setFeedbackEditUploadedFile] =
    useState(null);

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be under 50MB.");
      setUploadedBackgroundThemeFile(null);
    } else {
      setUploadError("");
      setUploadedBackgroundThemeFile(file);
      setFeedbackEditUploadedFile({
        name: file.name,
        type: file.type,
        url: file,
      });
    }
  };

  useEffect(() => {
    handleEmailInputChange(userInfo.email);
  }, [userInfo.email]);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPasswordModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowPasswordModal(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key === "Enter" && adminPassword.trim()) {
        handlePasswordSubmit(adminPassword);
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [adminPassword]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowFeedbackModal(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowFeedbackModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setIsModalOpen]);

  useEffect(() => {
    const contentZone = document.querySelector(".content-zone");
    const contentRect = contentZone?.getBoundingClientRect();

    const emojiContainer = document.querySelector(".emoji-layer");
    if (!emojiContainer || !contentRect) return;

    const emojis = emojiContainer.querySelectorAll(".emoji");

    emojis.forEach((emoji) => {
      let top, left;
      let attempts = 0;

      do {
        top = Math.random() * window.innerHeight;
        left = Math.random() * window.innerWidth;
        attempts++;
      } while (
        top > contentRect.top &&
        top < contentRect.bottom &&
        left > contentRect.left &&
        left < contentRect.right &&
        attempts < 10
      );

      emoji.style.top = `${top}px`;
      emoji.style.left = `${left}px`;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowFeedbackResponse(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFeedbackResponse(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const blockExitKeys = (e) => {
      const isModalActive = showUserInfo || showFeedbackForm || showThankYou;

      if (!isModalActive) return;

      if (e.key === "Escape") {
        e.preventDefault();
      }

      if (e.key === "F11") {
        e.preventDefault();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", blockExitKeys);
    return () => window.removeEventListener("keydown", blockExitKeys);
  }, [showUserInfo, showFeedbackForm, showThankYou]);

  useEffect(() => {
    const sessionQuestions = decryptSession(
      localStorage.getItem("feedbackQuestions"),
    );
    const parsedQuestions = sessionQuestions
      ? JSON.parse(sessionQuestions)
      : feedbackQuestionResponses;

    const initializedResponses = parsedQuestions.map((q) => ({
      feedbackQuestionId: q.feedbackQuestionId,
      feedbackQuestion: q.feedbackQuestion,
      answer: null,
    }));

    setFeedbackQuestionResponses(initializedResponses);
  }, []);

  useEffect(() => {
    const eventName =
      modalData?.eventName ||
      decryptSession(localStorage.getItem("feedbackEventName"));
    const eventId =
      modalData?.eventId ||
      Number(decryptSession(localStorage.getItem("feedbackEventId")));

    setModalData({ eventName, eventId });
  }, []);

  const handleResponseChange = (value) => {
    const updatedResponses = [...feedbackQuestionResponses];
    const currentQuestion = updatedResponses[currentQuestionIndex];
    if (!currentQuestion?.feedbackQuestionId) {
      console.error(
        "FeedbackQuestionId missing at index",
        currentQuestionIndex,
        currentQuestion,
      );
      return;
    }
    updatedResponses[currentQuestionIndex] = {
      ...currentQuestion,
      answer: value,
    };
    setFeedbackQuestionResponses(updatedResponses);
    const questionId = currentQuestion.feedbackQuestionId;
    setTemporaryFeedbackResponses((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.feedbackQuestionId === questionId,
      );
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          feedbackQuestionId: questionId,
          feedbackResponse: value,
        };
      } else {
        updated = [
          ...prev,
          { feedbackQuestionId: questionId, feedbackResponse: value },
        ];
      }
      console.log("Temporary Responses Array:", updated);
      return updated;
    });
  };

  const handleFeedbackResponseClick = (event) => {
    setSelectedFeedbackEventId(event.eventId);

    navigate("/feedbackResponse", {
      state: { feedbackData: feedbackResponseData, eventId: event.eventId },
    });
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userInfo.email.trim()) {
        setEmailSuggestions([]);
        return;
      }
      try {
        const response = await searchEmployeesByEmail(userInfo.email);
        const data = response.data;
        const validEmails = data
          .filter((emp) => emp.email && emp.email.trim() !== "")
          .map((emp) => ({
            fullName: emp.fullName,
            email: emp.email,
          }));
        setEmailSuggestions(validEmails);
      } catch (err) {
        console.error("Axios error fetching email suggestions:", err);
        setEmailSuggestions([]);
      }
    };
    var debounce;
    if (status === "idle" || status === "online") {
      debounce = setTimeout(fetchSuggestions, 300);
    }
    return () => clearTimeout(debounce);
  }, [userInfo.email]);

  useEffect(() => {
    if (showEmailConfirmation && timeLeft > 0 && !emailConfirmed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !emailConfirmed) {
      handleTimerExpired();
    }
  }, [timeLeft, showEmailConfirmation, emailConfirmed]);

  const handleTimerExpired = () => {
    setShowThankYou(false);
    setShowEmailConfirmation(false);
    setShowUserInfo(false);
    setShowFeedbackForm(true);
    console.log("Timer expired - showing feedback form");
  };

  const handleCloseFeedback = () => {
    setShowPasswordModal(true);
    setAdminPassword("");
    setPasswordError("");
  };

  const markAsComplete = async () => {
    try {
      const eventId = Number(
        decryptSession(localStorage.getItem("selectedEventId")),
      );
      if (!eventId) {
        console.warn("No event ID found in localStorage.");
        return;
      }

      const payload = { feedbackStatus: "Completed" };
      const response = await updateFeedbackInformation(eventId, payload);
      localStorage.removeItem("feedbackEventId");
      success("Feedback closed successfully!");
      const updateFeedbackResponse =
        await getFeedbackInformationByEventId(eventId);
      setEventInformation(updateFeedbackResponse.data);
      setShowCloseModal(false);
    } catch (error) {
      console.error("Error marking feedback as completed:", error);
    }
  };

  const handlePasswordSubmit = async (passwordParam) => {
    const passwordToUse = passwordParam ?? adminPassword;
    const userEmail = decryptSession(localStorage.getItem("email"));

    if (!userEmail) {
      setPasswordError("User email not found in session. Please log in again.");
      return;
    }

    try {
      const response = await doAuthenticationForClosingFeedback(
        userEmail,
        passwordToUse.trim(),
      );

      if (response.status === 200) {
        setShowPasswordModal(false);
        success("Feedback session closed successfully!");

        // const masterSocket = decryptSession(
        //   localStorage.getItem("masterSocket"),
        // );
        // const currentSocket = decryptSession(localStorage.getItem("socket"));

        localStorage.setItem(
          "feedbackLaunched",
          encryptSession("false").toString(),
        );
        localStorage.setItem(
          "feedbackClosedByMaster",
          encryptSession("true").toString(),
        );
        navigate("/socketDashboard");

        localStorage.clear();

        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }

        navigate("/login");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setPasswordError("Authentication failed. Please try again.");
    }
  };

  ///////////////////////
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    };
  };

  const [eventCategoryIdRefetch, setEventCategoryIdRefetch] = useState(1);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventCategoryId = Number(
          decryptSession(localStorage.getItem("eventCategoryId")),
        );
        if (!eventCategoryId) {
          console.warn("Missing eventCategoryId");
          return;
        }

        const response = await getEventsByEventCategoryId(eventCategoryId);
        setEvents(response.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [eventCategoryIdRefetch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredEvents(filtered);
  };

  const loadQuestionBank = async (eventId = null) => {
    setQuestionBankLoading(true);
    setQuestionBankError(null);
    setRawQuestionResponse(null);
    try {
      const eventCategoryId = Number(
        decryptSession(localStorage.getItem("eventCategoryId")),
      );
      let questions = [];
      let response = null;
      if (eventCategoryId && eventId) {
        const data = await getQuestionsByEventCategoryAndEventId(
          eventCategoryId,
          eventId,
        );
        response = { data };
      } else if (eventCategoryId) {
        response = await getQuestionsByEventCategory(eventCategoryId);
      } else {
        response = await getAllFeedbackQuestions();
      }
      const responseData = response?.data ?? response ?? null;
      setRawQuestionResponse(responseData);
      let candidateArray = [];
      if (Array.isArray(responseData)) {
        candidateArray = responseData;
      } else if (responseData && typeof responseData === "object") {
        if (Array.isArray(responseData.data))
          candidateArray = responseData.data;
        else if (Array.isArray(responseData.result))
          candidateArray = responseData.result;
        else {
          const maybe = Object.values(responseData).find((v) =>
            Array.isArray(v),
          );
          candidateArray = Array.isArray(maybe) ? maybe : [];
        }
      }
      questions = (candidateArray || []).map((q, idx) => ({
        id: q?.id ?? q?.feedbackQuestionId ?? `q-${idx}`,
        feedbackQuestion: (
          q?.feedbackQuestion ??
          q?.question ??
          q?.text ??
          ""
        ).toString(),
        ...q,
      }));
      // ✅ Remove duplicates
      const seen = new Set();
      const uniqueQuestions = [];
      for (const q of questions) {
        const text = (q.feedbackQuestion || "")
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .trim();
        if (text && !seen.has(text)) {
          seen.add(text);
          uniqueQuestions.push(q);
        }
      }
      setQuestionBank(uniqueQuestions);
      setFilteredQuestions(uniqueQuestions);
    } catch (err) {
      console.error("Error loading question bank (safe):", err);
      setQuestionBank([]);
      setFilteredQuestions([]);
      setQuestionBankError(err?.message ?? String(err));
      setRawQuestionResponse(err?.response ?? String(err));
    } finally {
      setQuestionBankLoading(false);
    }
  };
  // ✅ Now this effect only calls it once at start
  useEffect(() => {
    loadQuestionBank(); // initial load (all questions)
  }, []);

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    loadQuestionBank(eventId); // ✅ now it works
  };

  const handleModalEventChange = (e) => {
    const eventId = e.target.value;
    setFeedbackModalEventId(eventId);
    loadQuestionBank(eventId);
  };

  const handlePreview = () => {
    setPreviewModal({
      visible: true,

      item: contextMenu.item,
    });

    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleUserInfoSubmitFeedback = async () => {
    const eventId = Number(
      decryptSession(localStorage.getItem("feedbackEventId")),
    );

    // Anonymous flow
    if (eventInformation?.isAnonymousFeedback && isAnonymous) {
      console.log("Anonymous submission");
      setEmailError("");
      setShowUserInfo(false);
      setShowFeedbackForm(true);
      return;
    }

    // Email required flow
    const email = userInfo.email.trim();
    const fullEmailRegex = /^[a-zA-Z0-9._%+-]+@relevantz\.com$/i;
    const isCompleteEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validate email format
    if (!fullEmailRegex) {
      setEmailError("Please enter valid email.");
      return;
    }

    if (!isCompleteEmail || !fullEmailRegex.test(email)) {
      setEmailError("Please enter a valid organization email.");
      return;
    }

    // Verify email eligibility
    try {
      console.log("Verifying email:", email);
      console.log("Using event ID:", eventId);

      console.log("pwaaaa: ", status);

      if (status === "idle" || status === "online") {
        const result = await getEmailVerification(email, eventId);
        const message = result?.message?.toLowerCase() || "";

        if (message.includes("eligible")) {
          console.log("Email verified and eligible:", result);
          setEmailError("");
          setShowUserInfo(false);
          setShowFeedbackForm(true);
        } else if (message.includes("already submitted")) {
          setEmailError("You have already submitted feedback for this event.");
        } else {
          setEmailError("Email is not authorized for this event.");
        }
      } else {
        if (
          offlineQueueData.find(
            (em) => em.data.userPayload.feedbackUserEmail === email,
          )
        ) {
          setEmailError("You have already submitted feedback for this event.");
        } else {
          console.log("no-email");
          setEmailError("");
          setShowUserInfo(false);
          setShowFeedbackForm(true);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setEmailError("Verification failed. Please try again.");
    }
  };

  const organizationData = {
    name: "Live Event Analytics Application",
    logo: { liveaaLogo },
  };

  const handleFeedbackClick = (event) => {
    setModalData(event);
    setShowFeedbackModal(true);
    setFeedbackQuestions([]);
    setCurrentQuestion({ text: "" });
  };

  const addQuestion = () => {
    const newText = currentQuestion.text.trim();
    if (newText) {
      const isDuplicate = feedbackQuestions.some(
        (q) => q.text.trim().toLowerCase() === newText.toLowerCase(),
      );
      if (isDuplicate) {
        error("This question already exists!");
        return;
      }
      const newQuestion = { id: Date.now() + Math.random(), text: newText };
      setFeedbackQuestions([...feedbackQuestions, newQuestion]);
      setCurrentQuestion({ text: "" });
      setSearchQuery("");
      success("Question added successfully!");
    }
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

  const addQuestionFromBank = (question) => {
    const questionExists = feedbackQuestions.some(
      (q) => q.feedbackQuestion === question.feedbackQuestion,
    );
    if (!questionExists) {
      const newQuestion = {
        id: Date.now(),
        text: question.feedbackQuestion,
      };
      setFeedbackQuestions([...feedbackQuestions, newQuestion]);
    }
  };

  const removeQuestion = (id) => {
    setFeedbackQuestions(feedbackQuestions.filter((q) => q.id !== id));
    if (editingQuestionId === id) {
      setEditingQuestionId(null);
      setEditingQuestionText("");
    }
  };

  const startEditing = (question) => {
    setEditingQuestionId(question.id);
    setEditingQuestionText(question.text);
  };

  const saveEdit = (id) => {
    const newText = editingQuestionText.trim();
    if (newText) {
      const isDuplicate = feedbackQuestions.some(
        (q) =>
          q.id !== id && q.text.trim().toLowerCase() === newText.toLowerCase(),
      );
      if (isDuplicate) {
        error("Duplicate question not allowed!");
        return;
      }
      setFeedbackQuestions(
        feedbackQuestions.map((q) =>
          q.id === id ? { ...q, text: newText } : q,
        ),
      );
    }
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const previewSource = feedbackEditUploadedFile
    ? feedbackEditUploadedFile
    : eventInformation?.backgroundTheme
      ? {
          name: eventInformation.backgroundTheme,
          type: eventInformation.backgroundTheme.endsWith(".gif")
            ? "image/gif"
            : "video/mp4",
          url: `${backgroundBaseURL}/${encodeURIComponent(
            eventInformation.backgroundTheme,
          )}`,
        }
      : null;

  const cancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullscreenLocked(true);
      return true;
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      return false;
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreenLocked(false);
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  };

  useEffect(() => {
    const launched = decryptSession(localStorage.getItem("feedbackLaunched"));
    const email = decryptSession(localStorage.getItem("email"))
      ?.trim()
      .toLowerCase();

    // if (launched === "true" && email) {
    //   if (!socket.connected) {
    //     socket.connect();
    //   }
    //   socket.emit("register", email);
    // }
  }, []); // run after thank-you reset

  useEffect(() => {
    if (showThankYou && confirmedTimeout > 0) {
      setCountdown(confirmedTimeout);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timeout = setTimeout(
        () => {
          setShowThankYou(false);
          setCurrentQuestionIndex(0);
          setFeedbackQuestionResponses({});
          setUserInfo({ name: "", email: "" });

          const email = decryptSession(localStorage.getItem("email"))
            ?.trim()
            .toLowerCase();
          // if (email) {
          //   if (!socket.connected) {
          //     socket.connect();
          //   }
          //   socket.emit("register", email);
          //   console.log(`Re‑registered socket ${socket.id} for ${email}`);
          // }
        },
        confirmedTimeout * 1000 + 500,
      );

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showThankYou, confirmedTimeout]);

  useEffect(() => {
    if (
      showFeedbackForm &&
      feedbackQuestionResponses.length > 0 &&
      !feedbackQuestionResponses[currentQuestionIndex]?.answer
    ) {
      let remainingTime = 120; // 2 minutes

      const logInterval = setInterval(() => {
        remainingTime -= 1;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        console.clear();
        console.log(
          `⏱️ Time left for question ${
            currentQuestionIndex + 1
          }: ${minutes}m ${seconds}s`,
        );

        if (remainingTime <= 0) {
          clearInterval(logInterval);
        }
      }, 1000);

      const ttlTimer = setTimeout(() => {
        if (!feedbackQuestionResponses[currentQuestionIndex]?.answer) {
          console.clear();
          console.log(
            `⏰ Question ${
              currentQuestionIndex + 1
            } unanswered after 2 minutes. Showing user info and resetting form.`,
          );

          const resetResponses = feedbackQuestionResponses.map((q) => ({
            ...q,
            answer: null,
          }));
          setFeedbackQuestionResponses(resetResponses);
          setCurrentQuestionIndex(0);

          setShowFeedbackForm(false);
          setShowUserInfo(true);
        }
      }, 120000); // 2 minutes

      return () => {
        clearTimeout(ttlTimer);
        clearInterval(logInterval);
      };
    }
  }, [currentQuestionIndex, feedbackQuestionResponses, showFeedbackForm]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullscreenLocked && event.key === "F11") {
        event.preventDefault();
        return false;
      }
    };

    const handleFullscreenChange = () => {
      if (
        isFullscreenLocked &&
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement
      ) {
        setTimeout(() => {
          if (isFullscreenLocked) {
            enterFullscreen();
          }
        }, 100);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [isFullscreenLocked]);

  // useEffect(() => {
  //   const loadQuestionBank = async () => {
  //     try {
  //       const questions = await getAllFeedbackQuestions();
  //       const uniqueQuestions = Array.from(
  //         new Map(
  //           questions.data.map((q) => [q.feedbackQuestion.toLowerCase(), q])
  //         ).values()
  //       );
  //       setQuestionBank(uniqueQuestions);
  //       setFilteredQuestions(uniqueQuestions);
  //     } catch (error) {
  //       console.error("Error fetching question bank:", error);
  //     }
  //   };
  //   loadQuestionBank();
  // }, []);

  useEffect(() => {
    const query = (searchQuery || "").toLowerCase();
    try {
      const filtered = (questionBank || []).filter((question) => {
        const text = (question?.feedbackQuestion ?? "")
          .toString()
          .toLowerCase();
        return text.includes(query);
      });
      setFilteredQuestions(filtered);
    } catch (err) {
      console.error("Error filtering questions:", err);
      setFilteredQuestions([]);
    }
  }, [searchQuery, questionBank]);

  const formatNameFromEmail = (email) => {
    if (!email) return "";
    const namePart = email.split("@")[0];
    const nameSegments = namePart.split(".");
    const formattedName = nameSegments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
    return formattedName;
  };

  useEffect(() => {
    if (email) {
      const formattedName = formatNameFromEmail(email);
      setFormData((prev) => ({
        ...prev,
        createdBy: formattedName,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        createdBy: "",
      }));
    }
  }, [email]);

  // useEffect(() => {
  //   const query = searchQuery.toLowerCase();
  //   const filtered = questionBank.filter((question) =>
  //     question.feedbackQuestion.toLowerCase().includes(query)
  //   );
  //   setFilteredQuestions(filtered);
  // }, [searchQuery, questionBank]);

  const launchFeedback = async (selectedEventId) => {
    if (!selectedEventId) {
      error(
        "No event selected. Please choose an event before launching feedback.",
      );
      return;
    }
    localStorage.setItem(
      "selectedEventId",
      encryptSession(String(selectedEventId)).toString(),
    );
    if (feedbackQuestions.length === 0) {
      error("Please add at least one question");
      return;
    }
    setIsLaunching(true);
    try {
      const email = decryptSession(localStorage.getItem("email"));
      if (!email?.trim().toLowerCase()) {
        console.warn("No email found in localStorage");
        error("User email not found");
        return;
      }

      for (let question of feedbackQuestions) {
        const formData = new FormData();
        formData.append("eventId", selectedEventId);
        formData.append("feedbackQuestion", question.text);
        formData.append("email", email);
        formData.append("masterSocket", "true");
        formData.append("isAnonymousFeedback", allowAnonymous);
        formData.append("thankyouTimeout", confirmedTimeout);
        formData.append("idleTimeoutValue", confirmedIdleTimeoutValue);
        formData.append("idleTimeoutUnit", confirmedIdleTimeoutUnit);

        if (uploadedBackgroundThemeFile) {
          formData.append("backgroundTheme", uploadedBackgroundThemeFile);
        }

        const res = await addFeedbackQuestion(formData);
        if (!res || !(res.status === 200 || res.status === 201)) {
          error("Failed to add feedback question");
          return;
        }
      }

      const response = await getFeedbackQuestionsByEventId(selectedEventId);
      if (!response || !(response.status === 200 || response.status === 201)) {
        error("Failed to fetch feedback questions");
        return;
      }
      setFeedbackQuestionResponses(response.data);
      localStorage.setItem(
        "feedbackEventId",
        encryptSession(String(selectedEventId)).toString(),
      );
      localStorage.setItem(
        "feedbackLaunched",
        encryptSession("true").toString(),
      );
      // localStorage.setItem("socket", encryptSession(socket.id).toString());
      // localStorage.setItem("masterSocket", encryptSession("true").toString());

      // socket.emit("launchFeedback", email);
      // launchFeedbackService(email);
      // socket.emit("idleTimeoutUnit", confirmedIdleTimeoutUnit);
      // socket.emit("idleTimeoutValue", confirmedIdleTimeoutValue);

      launchFeedbackService(email);

      const fullscreenSuccess = await enterFullscreen();
      if (fullscreenSuccess) {
        setShowFeedbackModal(false);
        navigate("/feedbackCollection");
      }
    } catch (err) {
      console.error("Error during feedback launch:", err);
      error("Something went wrong while launching feedback");
    } finally {
      setIsLaunching(false);
    }
  };

  useEffect(() => {
    const storedQuestions = decryptSession(
      localStorage.getItem("feedbackQuestions"),
    );
    if (storedQuestions) {
      setFeedbackQuestions(JSON.parse(storedQuestions));
    }
    const email = decryptSession(
      localStorage.getItem("email")?.trim().toLowerCase(),
    );
    // if (email) {
    //   socket.emit("register", email);
    // }
    const launched = decryptSession(localStorage.getItem("feedbackLaunched"));
    if (launched === "true") {
      enterFullscreen().then((success) => {
        if (success) {
          setShowFeedbackModal(false);
          setShowUserInfo(true);
          setCurrentQuestionIndex(0);
          setUserInfo({ name: "", email: "" });
        }
      });
    }
  }, []);

  // const handleUserInfoSubmit = () => {
  //   if (!isAnonymous && !userInfo.email.trim()) {
  //     error("Please fill in both name and email fields");
  //     return;
  //   }
  //   setShowUserInfo(false);
  //   setShowFeedbackForm(true);
  // };

  // const handleUserInfoSubmit = () => {
  //   // If anonymous feedback is NOT allowed, enforce non-anonymous

  //   if (!eventInformation?.isAnonymousFeedback) {
  //     setIsAnonymous(false);
  //   }

  //   if (!isAnonymous && !userInfo.email.trim()) {
  //     error("Please fill in both name and email fields");

  //     return;
  //   }

  //   setShowUserInfo(false);

  //   setShowFeedbackForm(true);
  // };

  // const handleEmailInputChange = (value) => {
  //   setUserInfo({ ...userInfo, email: value });
  //   setShowEmailDropdown(value.length > 0);

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (value && !emailRegex.test(value)) {
  //     setEmailError("Please enter a valid email address");
  //   } else {
  //     setEmailError("");
  //   }
  // };

  // const handleEmailInputChange = (value) => {
  //   setUserInfo({ ...userInfo, email: value });
  //   setShowEmailDropdown(value.length > 0);

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (value && !emailRegex.test(value)) {
  //     setEmailError("Please enter a valid email address");
  //   } else {
  //     setEmailError("");
  //   }
  // };
  const handleEmailInputChange = (value) => {
    setUserInfo({ ...userInfo, email: value });
    setShowEmailDropdown(value.length > 0);

    const fullEmailRegex = /^[a-zA-Z0-9._%+-]+@relevantz\.com$/i;
    const isCompleteEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (value.trim().length === 0) {
      setEmailError("");
      setIsEmailValid(false);
      return;
    }

    if (isCompleteEmail) {
      if (!fullEmailRegex.test(value)) {
        setEmailError("Please enter a valid organization email");
        setIsEmailValid(false);
      } else {
        setEmailError("");
        setIsEmailValid(true);
      }
    } else {
      setEmailError(""); // Don't show error while typing incomplete email
      setIsEmailValid(false);
    }

    const filtered = emailSuggestions.filter((emp) =>
      emp.email.toLowerCase().includes(value.toLowerCase()),
    );
    setEmailSuggestions(filtered);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    const match = emailSuggestions.find(
      (emp) => emp.email.toLowerCase() === userInfo.email.toLowerCase(),
    );
    if (match) {
      setShowEmailDropdown(false);
      setHighlightedIndex(-1);
    }
  }, [userInfo.email, emailSuggestions]);

  const handleEmailSuggestionKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < emailSuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && emailSuggestions[highlightedIndex]) {
        e.preventDefault();
        const selectedEmail = emailSuggestions[highlightedIndex].email;
        setUserInfo((prev) => ({ ...prev, email: selectedEmail }));
        handleEmailInputChange(selectedEmail);
        setShowEmailDropdown(false); // ✅ close dropdown
        setHighlightedIndex(-1);
      }
    }
  };

  // const selectEmailSuggestion = (email) => {
  //   setUserInfo({ ...userInfo, email });
  //   setShowEmailDropdown(false);
  // };

  const selectEmailSuggestion = (email) => {
    setUserInfo({ ...userInfo, email });
    setShowEmailDropdown(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // const nextQuestion = () => {
  //   if (currentQuestionIndex < feedbackQuestions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //   }
  // };
  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      console.log("Next clicked, current index:", prevIndex);
      if (prevIndex < feedbackQuestionResponses.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // useEffect(() => {
  //   if (modalData) {
  //     const formattedDate = modalData.eventDate
  //       ? new Date(modalData.eventDate).toISOString().slice(0, 16)
  //       : "";
  //     setEditedEvent({
  //       eventPoster: `${eventImagesURL}/${modalData.eventPoster}`,
  //       eventName: modalData.eventName,
  //       eventDescription: modalData.eventDescription,
  //       eventDate: formattedDate,
  //       eventStatus: modalData.eventStatus,
  //       eventOrganizer: modalData.eventOrganizer,
  //     });
  //     setIsEditing(false);
  //   }
  // }, [modalData]);

  useEffect(() => {
    if (modalData) {
      const parsedDate = modalData.eventDate
        ? new Date(modalData.eventDate)
        : null;

      setEditedEvent({
        eventPoster: `${eventImagesURL}/${modalData.eventPoster}`,
        eventName: modalData.eventName,
        eventDescription: modalData.eventDescription,
        eventDate: parsedDate,
        eventStatus: modalData.eventStatus,
        eventOrganizer: modalData.eventOrganizer,
      });
      setIsEditing(false);
    }
  }, [modalData]);

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("eventName", editedEvent.eventName);
      formData.append("eventDescription", editedEvent.eventDescription);
      formData.append("eventDate", editedEvent.eventDate);
      formData.append("eventStatus", editedEvent.eventStatus);
      formData.append("eventOrganizer", editedEvent.eventOrganizer);
      if (editedEvent.posterFile) {
        formData.append("eventPoster", editedEvent.posterFile);
      }
      await updateEvent(modalData.eventId, formData);
      success("Updated successfully");
      setShowModal(false);
      const refreshed = await getEventsByEventCategoryId(
        modalData.eventCategory?.eventCategoryId,
      );
      setEvents(refreshed.data);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const matchedSuggestion = emailSuggestions.find(
    (suggestion) => suggestion.email === userInfo.email,
  );

  useEffect(() => {
    localStorage.setItem(
      "selectedEventId",
      encryptSession(String(selectedEventId)).toString(),
    );
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const filtered = events.filter((events) =>
      events.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  useEffect(() => {
    const fetchEventCategoryByEventCategoryId = async () => {
      try {
        const response =
          await getEventCategoryByEventCategoryId(eventCategoryId);
        setEventCategory(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEventCategoryByEventCategoryId();
  }, []);

  // useEffect(() => {
  //   const fetchEventsByEventCategoryId = async () => {
  //     try {
  //       const response = await getEventsByEventCategoryId(eventCategoryId);
  //       setEvents(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch events:", error);
  //     }
  //   };
  //   fetchEventsByEventCategoryId();
  // }, []);

  useEffect(() => {
    const fetchEventsByEventCategoryId = async () => {
      try {
        const response = await getEventsByEventCategoryId(eventCategoryId);
        setEvents(response.data);
        console.log(response.data);
        // The line that automatically set the selected event ID has been removed.
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEventsByEventCategoryId();
  }, []);

  useEffect(() => {
    const fetchEventById = async () => {
      if (!selectedEventId) return;
      try {
        const response = await getEventById(selectedEventId);
        setOneEvent(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEventById();
  }, [selectedEventId]);

  useEffect(() => {
    const fetchResourcesByEventId = async () => {
      if (!selectedEventId) return;
      try {
        const response = await getResourcesByEventId(selectedEventId);
        setResources(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchResourcesByEventId();
  }, [selectedEventId]);

  useEffect(() => {
    const fetchGenderAnalytics = async () => {
      if (!selectedEventId) return;
      try {
        const response = await getGenderAnalytics(selectedEventId);
        setGenderAnalytics(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchGenderAnalytics();
  }, [selectedEventId]);

  useEffect(() => {
    const fetchEventInformationByEventId = async () => {
      const eventId =
        decryptSession(localStorage.getItem("feedbackEventId")) ||
        decryptSession(localStorage.getItem("selectedEventId"));

      const idToUse = eventFeedbackInformationId || eventId;

      if (!idToUse) {
        console.log("No valid event ID found");
        setEventInformation(null);
        return;
      }

      try {
        const response = await getFeedbackInformationByEventId(idToUse);

        if (!response?.data || !response.data.feedbackStatus) {
          console.log("No feedback data found for this event");
          setEventInformation(null); // ✅ Clear stale data
          return;
        }

        const eventData = response.data;
        setEventInformation(eventData);

        if (eventData.thankyouTimeout) {
          setConfirmedTimeout(eventData.thankyouTimeout);
          setThankYouTimeout(eventData.thankyouTimeout);
        }

        if (eventData.idleTimeoutValue && eventData.idleTimeoutUnit) {
          setConfirmedIdleTimeoutValue(eventData.idleTimeoutValue);
          setConfirmedIdleTimeoutUnit(eventData.idleTimeoutUnit);
        }

        console.log("Fetched Event Info:", eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        setEventInformation(null);
      }
    };

    fetchEventInformationByEventId();
  }, [
    eventFeedbackInformationId,
    Number(decryptSession(localStorage.getItem("feedbackEventId"))),
    Number(decryptSession(localStorage.getItem("selectedEventId"))),
  ]);

  useEffect(() => {
    if (!showUserInfo || !eventInformation) return;

    console.log("idle value: ", eventInformation.idleTimeoutValue);
    console.log("idle unit: ", eventInformation.idleTimeoutUnit);

    const durationMs = toMilliseconds(
      eventInformation.idleTimeoutValue,
      eventInformation.idleTimeoutUnit,
    );

    const timeout = setTimeout(() => {
      // const socketId = decryptSession(localStorage.getItem("socket"));
      // const masterSocketId = decryptSession(
      //   localStorage.getItem("masterSocket"),
      // );

      // if (socketId !== masterSocketId) {
      //   if (socket && typeof socket.disconnect === "function") {
      //     socket.disconnect();
      //   }
      localStorage.clear();
      navigate("/login");
      // }
    }, durationMs);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showUserInfo, navigate, eventInformation]);

  const handleMediaUploadSuccess = () => {
    success("Media's uploaded successfully", { duration: 10000 });
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        eventPoster: file,
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (!formData.startingDate) {
      setFormData((prev) => ({
        ...prev,
        startingDate: new Date(),
      }));
    }
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (
        !formData.eventName &&
        !formData.eventDescription &&
        !formData.startingDate &&
        !formData.createdBy &&
        !formData.eventPoster
      ) {
        error("Please fill all the highlighted fields");
        return;
      }
      if (!formData.eventName) {
        error("Event name is required.");
        return;
      }
      if (!formData.eventDescription) {
        error("Event description is required.");
        return;
      }
      if (!formData.startingDate) {
        error("Event date is required.");
        return;
      }
      if (!formData.createdBy) {
        error("Event organizer is required.");
        return;
      }
      if (!formData.eventPoster) {
        error("Event poster is required.");
        return;
      }
      console.log("Poster:", formData.eventPoster);
      console.log("Category ID:", eventCategoryId);
      console.log("Date:", formData.startingDate);
      console.log("Organizer:", formData.createdBy);
      const formPayload = new FormData();
      formPayload.append("eventName", formData.eventName);
      formPayload.append("eventPoster", formData.eventPoster);
      formPayload.append("eventDate", formData.startingDate);
      formPayload.append("eventDescription", formData.eventDescription);
      formPayload.append("eventCategoryId", eventCategoryId);
      formPayload.append("eventOrganizer", formData.createdBy);
      const response = await addEvent(formPayload);
      console.log("After hitting api", response);
      if (response.status === 201) {
        localStorage.setItem("eventCreated", "true");
        setIsModalOpen(false);
        setFormData({
          eventCategoryName: "",
          eventCategoryLogo: null,
          eventCategoryDescription: "",
        });
        success("Event created Successfully!")
        setEventCategoryIdRefetch(
          (eventCategoryIdRefetch) => eventCategoryIdRefetch + 1,
        );
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;

      console.error("API Error:", apiMessage);
      error(apiMessage || "Failed to create new Event", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      eventPoster: null,
    }));
  };

  const handleInfoClick = (event) => {
    setModalData(event);
    setShowModal(true);
  };

  const handleDelete = (eventId, categoryId) => {
    toast((t) => (
      <div className="space-y-2">
        <p className="text-sm">Are you sure you want to delete this event?</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await deleteEvent(eventId);
                if (response.status === 200) {
                  toast.success("Event deleted successfully");
                  setShowModal(false);
                  window.location.reload();
                  const updatedResponse =
                    await getEventsByEventCategoryId(categoryId);
                  setEvents(updatedResponse.data);
                } else {
                  toast.error(response.data?.message || "Failed to delete");
                }
              } catch (err) {
                toast.error("Something went wrong while deleting");
                console.error("Delete failed", err);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const renderContentByStatus = () => {
    if (!oneEvent) {
      return (
        <p className="text-white/60">Select an event to view its details.</p>
      );
    }
    switch (oneEvent.eventStatus) {
      case "Created":
        return (
          <div className="space-y-6 -mt-2">
            <MediaUploader
              eventId={selectedEventId}
              onUploadSucess={handleMediaUploadSuccess}
            />
          </div>
        );
      case "Inprogress":
        return (
          <div className="space-y-6 -mt-2">
            <UploadedMediaManager resources={resources} />
          </div>
        );
      //     case "Completed":
      // return (
      //   <div className="space-y-6 -mt-2">
      //     {selectedEventId ? (
      //       <MediaGallery
      //         media={genderAnalytics}
      //         analytics={genderAnalytics}
      //         resources={resources}
      //         selectedEventId={selectedEventId}
      //       />
      //     ) : (
      //       <MediaGallery
      //         media={genderAnalytics}
      //         analytics={genderAnalytics}
      //         resources={resources}
      //         selectedEventId={selectedEventId}
      //       />
      //     )}
      //   </div>
      // );

      case "Completed":
        if (!hydrated || !resources.length) {
          return <Loader message="Fetching Data..." />;
        }

        return (
          <div className="space-y-6 -mt-2">
            <MediaGallery
              media={genderAnalytics}
              analytics={genderAnalytics}
              resources={resources}
              selectedEventId={selectedEventId}
            />
          </div>
        );

      default:
        return (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              {events.eventName}
            </h3>
            <p className="text-white/80 text-base mb-4">
              {events.eventDescription}
            </p>
            <div className="text-white/60 space-y-1">
              <p>
                Status: <span className="capitalize">{events.eventStatus}</span>
              </p>
              <p>Event Date: {events.eventDate}</p>
              <p>Created Date: {events.createdAt}</p>
            </div>
          </div>
        );
    }
  };

  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const eventId =
        Number(
          decryptSession(localStorage.getItem("clickedFeedbackEventId")),
        ) ||
        Number(decryptSession(localStorage.getItem("feedbackEventId"))) ||
        modalData?.eventId;

      const isActuallyAnonymous = !userInfo.email.trim();

      const userPayload = {
        feedbackUserName: isActuallyAnonymous
          ? "anonymous"
          : matchedSuggestion?.fullName || "null",
        feedbackUserEmail: isActuallyAnonymous
          ? "anonymous"
          : userInfo.email.trim(),
        eventId: eventId,
      };

      var responsesPayload = {};

      // const userResponse = await addFeedbackUserDetails(userPayload);
      if (status === "online" || status === "idle") {
        const userResponse = await addFeedbackUserDetails(userPayload);
        console.log("usr: ", userResponse);
        if (!userResponse?.data?.feedbackUserId) {
          throw new Error("Feedback User ID not returned from API");
        }

        const feedbackUserId = userResponse.data.feedbackUserId;

        responsesPayload = {
          feedbackUserId,
          eventId: parseInt(eventId),
          responses: temporaryFeedbackResponses,
          isAnonymous: isActuallyAnonymous,
        };

        await addFeedbackResponseDetails(responsesPayload);
        success("Submitted your Feedback!");
        setShowFeedbackForm(false);
        setShowThankYou(true);
      }

      if (status === "offline") {
        responsesPayload = {
          responses: temporaryFeedbackResponses,
          isAnonymous: isActuallyAnonymous,
        };
        setShowFeedbackForm(false);
        setShowThankYou(true);
        const data = { userPayload, responsesPayload, module: "feedback" };
        sendDataToOfflineQueue(data);
        setTriggerOfflineQueueFetch(
          (triggetOfflineQueueFetch) => triggetOfflineQueueFetch + 1,
        );
      }

      console.log("offlineQueueData: ", offlineQueueData);

      const timeoutDuration =
        confirmedTimeout && confirmedTimeout >= 1 && confirmedTimeout <= 15
          ? confirmedTimeout * 1000 + 500
          : 5500;

      setTimeout(() => {
        setShowThankYou(false);
        setTemporaryFeedbackResponses([]);
        setShowUserInfo(true);
        setUserInfo({ email: "" });
        const resetResponses = feedbackQuestionResponses.map((q) => ({
          ...q,
          answer: null,
        }));
        setFeedbackQuestionResponses(resetResponses);
        setCurrentQuestionIndex(0);
      }, timeoutDuration);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      error("Something went wrong while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextAreaChange = (e) => {
    const value = e.target.value;
    setCurrentQuestion({ ...currentQuestion, text: value });
    setSearchQuery(value);
  };

  const handleDragStart = (e, question) => {
    setDraggedQuestion(question);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDropQuestion = (e) => {
    e.preventDefault();
    if (draggedQuestion) {
      const isDuplicate = feedbackQuestions.some(
        (q) =>
          q.text.trim().toLowerCase() ===
          draggedQuestion.feedbackQuestion.trim().toLowerCase(),
      );

      if (isDuplicate) {
        error("This question already exists!");
      } else {
        addQuestionFromBank(draggedQuestion);
        success("Question added successfully!");
      }

      setDraggedQuestion(null);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 flex flex-col overflow-hidden">
      <Navbar
        isMobile={isMobile}
        eventTitle={eventCategory?.eventCategoryName || ""}
        events={events}
        onSearch={(query) => setSearchTerm(query)}
        onAddEvent={() => setIsModalOpen(true)}
        onSelectEvent={(eventId) => {
          setSelectedEventId(eventId);
        }}
        selectedEventId={selectedEventId}
      />
      {isProcessing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center border border-white/20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-white">
              Processing media...
            </p>
            <p className="text-sm text-white/70 mt-2">
              Analyzing gender distribution in your content
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-1 mt-16 overflow-hidden">
        {/* Sidebar */}
        {!isMobile && (
          <div className="w-[22%] border-r border-black/25 flex flex-col overflow-hidden">
            <div className="p-4 flex-shrink-0">
              <button
                onClick={() => {
                  localStorage.removeItem("selectedEventId");
                  navigate("/viewAllEvents");
                }}
                style={{ backgroundColor: "#274c77" }}
                className="w-full z-50 group flex justify-center mb-2 hover:cursor-pointer items-center space-x-3 backdrop-blur-lg text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:from-gray-700/95 hover:to-gray-600/95 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Categories</span>
              </button>
              <h2 className="text-xl font-bold text-gray mb-4">
                {eventCategory?.eventCategoryName} - Events
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ backgroundColor: "#274c77" }}
                className="w-full hover:cursor-pointer text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm lg:text-base"
              >
                <Plus size={22} />
                Add New Event
              </button>
            </div>
            <div
              className="relative flex-1 overflow-y-auto px-4 pb-4 border-t border-black/25 pt-4 
  [&::-webkit-scrollbar]:w-1.5 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:bg-transparent 
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  [&::-webkit-scrollbar-thumb:hover]:bg-gray-500
  [&::-webkit-scrollbar-thumb]:transition-colors"
            >
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/20 to-transparent z-10" />
              <ul className="space-y-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <li
                      key={event.eventId}
                      onClick={() => {
                        setSelectedEventId(event.eventId);
                        localStorage.setItem(
                          "selectedEventId",
                          encryptSession(String(event.eventId)).toString(),
                        );
                        localStorage.setItem(
                          "eventObjId",
                          encryptSession(String(event._id)).toString(),
                        );
                        localStorage.setItem(
                          "selectedEventId",
                          encryptSession(String(event.eventId)).toString(),
                        );
                        setUploadedMedia([]);
                      }}
                      className={`relative cursor-pointer p-3 rounded-lg flex items-center justify-between transition-all duration-200 ${
                        event.eventId === selectedEventId
                          ? "text-white font-semibold"
                          : "bg-white/50 text-gray-800 hover:bg-white/20"
                      }`}
                      style={
                        event.eventId === selectedEventId
                          ? { backgroundColor: "#274c77" }
                          : {}
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={`${eventImagesURL}/${event.eventPoster}`}
                            alt="sub-event"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span
                            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              statusColors[event.eventStatus]
                            }`}
                          />
                        </div>
                        <div className="relative group max-w-[150px]">
                          <span className="block truncate text-sm">
                            {event.eventName}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {event.eventName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative group">
                          <Info
                            size={18}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfoClick(event);
                            }}
                            className="cursor-pointer hover:text-white/70"
                          />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Info
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-black italic text-center mt-4">
                    No events found
                  </p>
                )}
              </ul>
            </div>
          </div>
        )}
        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            isMobile ? "w-full" : ""
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3">
            {console.log("eventInformation:", eventInformation)}
            {console.log("feedbackStatus:", eventInformation?.feedbackStatus)}
            {oneEvent && (
              <>
                {/* 1. Event Name */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`px-3 py-1 rounded-full text-1xl font-medium inline-flex items-center overflow-hidden whitespace-nowrap text-ellipsis ${
                      statusColors[oneEvent.eventStatus]
                    }`}
                    title={oneEvent.eventName}
                  >
                    Event Name: {oneEvent.eventName}
                  </div>
                </div>
                <div className="flex items-center justify-end w-full mb-4 px-4 gap-4 flex-wrap">
                  {/* 2. Reopen or Close Feedback (conditionally shown) */}
                  {oneEvent.isFeedbackLaunched === true &&
                    eventInformation?.event.eventId === oneEvent.eventId && (
                      <>
                        {eventInformation.email?.toLowerCase() ===
                          decryptSession(
                            localStorage.getItem("email"),
                          )?.toLowerCase() &&
                          eventInformation.feedbackStatus
                            ?.toLowerCase()
                            .trim() === "completed" && (
                            <div
                              className="px-2 py-1 rounded-full text-sm font-medium text-white flex items-center space-x-2 cursor-pointer hover:opacity-80 bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowReopenModal(true);
                              }}
                            >
                              <LockKeyholeOpen size={16} />
                              <span>Reopen Feedback</span>
                            </div>
                          )}
                        {eventInformation.email?.toLowerCase() ===
                          decryptSession(
                            localStorage.getItem("email")?.toLowerCase(),
                          ) &&
                          eventInformation.feedbackStatus
                            ?.toLowerCase()
                            .trim() === "launched" && (
                            <div
                              className="px-2 py-1 rounded-full text-sm font-medium text-white flex items-center space-x-2 cursor-pointer hover:opacity-80 bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCloseModal(true);
                              }}
                            >
                              <XCircle size={16} />
                              <span>Close Feedback</span>
                            </div>
                          )}
                      </>
                    )}
                  {/* 3. Create or View Feedback & Survey */}
                  <div className="flex flex-wrap gap-3">
                    {/* Feedback */}
                    {oneEvent.isFeedbackLaunched === false ? (
                      <button
                        type="button"
                        style={{ backgroundColor: "#274c77" }}
                        className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.setItem(
                            "clickedFeedbackEventId",
                            encryptSession(String(oneEvent.eventId)).toString(),
                          );
                          handleFeedbackClick(oneEvent);
                        }}
                      >
                        <MessageSquare size={16} />
                        <span>Create Feedback</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 cursor-pointer hover:opacity-80 bg-green-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedbackCompletedEventId(oneEvent.eventId);
                          handleFeedbackResponseClick(oneEvent);
                        }}
                      >
                        <FileText size={16} />
                        <span>View Feedback Responses</span>
                      </button>
                    )}

                    {/* Survey */}
                    {oneEvent.isSurveyLaunched === false ? (
                      <button
                        type="button"
                        style={{ backgroundColor: "#274c77" }}
                        className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 cursor-pointer hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/surveyQuestionConfiguration");
                        }}
                      >
                        <ListTodoIcon size={16} />
                        <span>Create Survey</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 cursor-pointer hover:opacity-80 bg-green-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          // your handler for viewing survey report
                          navigate(`/reports/${eventObjIdForSurveyReport}`);
                        }}
                      >
                        <FileText size={16} />
                        <span>View Survey Report</span>
                      </button>
                    )}
                  </div>

                  {/* 4. Event Status */}
                  <div className="flex-shrink-0">
                    <div
                      className={`px-3 py-1 rounded-full text-1xl font-medium flex items-center ${
                        statusColors[oneEvent.eventStatus]
                      }`}
                    >
                      Event Status: {oneEvent.eventStatus}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Content Area */}
            {events.length === 0 ? (
              <NoEventSelected openModal={() => setIsModalOpen(true)} />
            ) : oneEvent ? (
              renderContentByStatus()
            ) : (
              <DashboardEvents
                events={events}
                media={genderAnalytics}
                resources={resources}
              />
            )}
          </div>
        </div>
        {showCloseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Close Feedback</h2>
              <p className="mb-6">
                Are you sure you want to close this feedback session?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={markAsComplete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {showReopenModal && (
          <div
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-8"
            onClick={() => setShowReopenModal(false)}
          >
            <div
              className="bg-white shadow-2xl w-full max-w-[60vw] h-[60vh] flex flex-col rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white"
                style={{
                  background: "linear-gradient(135deg, #274c77, #5a7db8)",
                }}
              >
                <button
                  className="cursor-pointer absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:rotate-90 transition-all"
                  onClick={() => setShowReopenModal(false)}
                >
                  <X size={20} />
                </button>
                <h3 className="text-3xl font-bold text-center leading-tight">
                  Reopen Feedback for {eventInformation.event?.eventName}
                </h3>
                <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-4"></div>
              </div>

              {/* Body */}
              {/* Body */}
              <div className="p-6 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Left Column */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    {/* Feedback Mode */}
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-base font-semibold text-gray-700 mb-2">
                        Feedback Mode Selection
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="anonymousFeedback"
                            value="anonymous"
                            checked={
                              eventInformation.isAnonymousFeedback === true
                            }
                            onChange={() => {
                              setAllowAnonymous(true);
                              setEventInformation((prev) => ({
                                ...prev,
                                isAnonymousFeedback: true,
                              }));
                            }}
                            className="w-4 h-4 text-[#274c77] border-gray-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-800">
                            Anonymous
                          </span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="anonymousFeedback"
                            value="emailRequired"
                            checked={
                              eventInformation.isAnonymousFeedback === false
                            }
                            onChange={() => {
                              setAllowAnonymous(false);
                              setEventInformation((prev) => ({
                                ...prev,
                                isAnonymousFeedback: false,
                              }));
                            }}
                            className="w-4 h-4 text-[#274c77] border-gray-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-800">
                            Email Required
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Thank You Timeout */}
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Thank You Timeout (in seconds)
                      </label>
                      {isEditingTimeout ? (
                        <div className="flex items-center space-x-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={thankYouTimeout}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,2}$/.test(value)) {
                                const num = Number(value);
                                if (!isNaN(num)) setThankYouTimeout(num);
                              }
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none text-sm"
                          />
                          <button
                            onClick={handleTimeoutSubmit}
                            className="px-3 py-1 bg-[#274c77] text-white rounded-md hover:bg-[#1f3e63] text-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Save size={16} />
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 text-sm font-medium">
                            {confirmedTimeout} Sec
                          </span>
                          <button
                            onClick={() => {
                              setThankYouTimeout(confirmedTimeout);
                              setIsEditingTimeout(true);
                            }}
                            className="text-[#274c77] hover:bg-blue-50 p-1 rounded-md cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                      {timeoutError && (
                        <p className="text-red-500 text-xs mt-2">
                          {timeoutError}
                        </p>
                      )}
                      {showConfirmation && (
                        <p className="text-green-600 text-xs mt-2">
                          Timeout saved successfully!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    {/* Background Theme */}
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Do you want a customizable background theme?
                      </label>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="customTheme"
                            value="yes"
                            checked={useCustomTheme === true}
                            onChange={() => {
                              setUseCustomTheme(true);
                              setShowUploadModal(true);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300"
                          />
                          <span className="text-sm text-gray-800">Yes</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="customTheme"
                            value="no"
                            checked={useCustomTheme === false}
                            onChange={() => {
                              setUseCustomTheme(false);
                              setUploadedBackgroundThemeFile(null);
                              setUploadError("");
                              setFeedbackEditUploadedFile(null);
                              setShowUploadModal(false);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300"
                          />
                          <span className="text-sm text-gray-800">No</span>
                        </label>
                      </div>

                      {useCustomTheme && feedbackEditUploadedFile && (
                        <div className="mt-3 flex items-center justify-between bg-gray-100 rounded-md px-3 py-2">
                          <span
                            className="text-sm text-gray-700 font-medium truncate max-w-[70%]"
                            title={feedbackEditUploadedFile.name}
                          >
                            🎬 {feedbackEditUploadedFile.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPreviewOpen(true)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => {
                                setUploadedBackgroundThemeFile(null);
                                setFeedbackEditUploadedFile(null);
                                setUploadError("");
                                setUseCustomTheme(false);
                                setShowUploadModal(false);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Idle Timeout (Reopen Feedback) */}
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <label className="block text-base font-semibold text-gray-700 mb-1">
                        Idle Timeout
                      </label>
                      <p className="text-gray-500 text-xs mb-2">
                        Automatically logs out users after inactivity.
                      </p>

                      {isEditingIdleTimeout ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            placeholder="Enter value (10–99)"
                            value={idleTimeoutValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,2}$/.test(value)) {
                                if (value === "") {
                                  setIdleTimeoutValue(""); // allow clearing
                                } else {
                                  const num = Number(value);
                                  if (!isNaN(num)) setIdleTimeoutValue(num);
                                }
                              }
                            }}
                            className="w-20 sm:w-24 px-2 py-1 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none text-sm"
                          />

                          <select
                            value={idleTimeoutUnit}
                            onChange={(e) => setIdleTimeoutUnit(e.target.value)}
                            className="w-24 sm:w-28 px-2 py-1 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none text-sm cursor-pointer shadow-sm"
                          >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                          </select>

                          <button
                            onClick={() => {
                              if (
                                idleTimeoutValue === "" ||
                                isNaN(idleTimeoutValue) ||
                                idleTimeoutValue < 10 ||
                                idleTimeoutValue > 99
                              ) {
                                error("Idle timeout must be between 10 and 99");
                                return;
                              }
                              setConfirmedIdleTimeoutValue(idleTimeoutValue);
                              setConfirmedIdleTimeoutUnit(idleTimeoutUnit);
                              setIsEditingIdleTimeout(false);
                              success("Idle timeout saved successfully!");
                            }}
                            className="px-2 cursor-pointer sm:px-3 py-1 bg-[#274c77] text-white rounded-md hover:bg-[#1f3e63] text-sm flex items-center gap-1"
                          >
                            <Save size={14} /> Save
                          </button>

                          <button
                            onClick={() => setIsEditingIdleTimeout(false)}
                            className="px-2 cursor-pointer sm:px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 text-sm font-medium">
                            {confirmedIdleTimeoutValue}{" "}
                            {confirmedIdleTimeoutUnit}
                          </span>
                          <button
                            onClick={() => {
                              setIdleTimeoutValue(confirmedIdleTimeoutValue);
                              setIdleTimeoutUnit(confirmedIdleTimeoutUnit);
                              setIsEditingIdleTimeout(true);
                            }}
                            className="text-[#274c77] hover:bg-blue-50 p-1 rounded-md cursor-pointer"
                            title="Edit Idle Timeout"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-4">
                <button
                  onClick={() => setShowReopenModal(false)}
                  className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <ButtonLoader
                  isLoading={isLoading}
                  onClick={handleReopenFeedback}
                  disabled={isEditingIdleTimeout}
                  className="px-6 py-2 rounded-full bg-[#274c77] text-white font-medium shadow-md hover:bg-[#1f3a5c] hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  Confirm
                </ButtonLoader>
              </div>
            </div>
          </div>
        )}
        {previewOpen && previewSource && (
          <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setPreviewOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 bg-[#274c77] text-white">
                <h3 className="text-lg font-semibold">
                  Background Theme Preview
                </h3>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="text-white hover:text-gray-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4">
                {previewSource.type.startsWith("image/") ? (
                  <img
                    src={
                      previewSource.url instanceof File
                        ? URL.createObjectURL(previewSource.url)
                        : previewSource.url
                    }
                    alt="Preview"
                    className="w-full rounded-lg shadow-md"
                  />
                ) : (
                  <video
                    src={
                      previewSource.url instanceof File
                        ? URL.createObjectURL(previewSource.url)
                        : previewSource.url
                    }
                    controls
                    autoPlay
                    className="w-full rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {showUploadModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={(e) => {
              if (e.target.classList.contains("backdrop-blur-sm")) {
                setShowUploadModal(false);
                setUploadedBackgroundThemeFile(null);
                setUploadError("");
              }
            }}
          >
            <div
              className={`bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-xl transition-all duration-300 ${
                uploadedBackgroundThemeFile ? "h-[70vh]" : "h-auto"
              } overflow-hidden flex flex-col relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#274c77] flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-white">
                  Upload Background Theme
                </h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedBackgroundThemeFile(null);
                    setUploadError("");
                    setUseCustomTheme(false);
                  }}
                  className="hover:cursor-pointer text-white hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 overflow-y-auto">
                {!uploadedBackgroundThemeFile ? (
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition text-center"
                    onClick={() =>
                      document.getElementById("videoUploadInput")?.click()
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      handleFileUpload(file);
                    }}
                  >
                    <input
                      type="file"
                      id="videoUploadInput"
                      accept="video/mp4,video/webm,image/gif"
                      hidden
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                    <p className="text-gray-600 text-sm font-medium">
                      Click or drag a video to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Max 50MB • MP4 or GIF
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedBackgroundThemeFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(uploadedBackgroundThemeFile)}
                        alt="Uploaded GIF"
                        className="w-full rounded-lg shadow-md"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(uploadedBackgroundThemeFile)}
                        controls
                        autoPlay
                        className="w-full rounded-lg shadow-md"
                      />
                    )}

                    <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
                      <div
                        className="text-sm text-gray-700 font-medium truncate max-w-[80%]"
                        title={uploadedBackgroundThemeFile.name}
                      >
                        🎬 {uploadedBackgroundThemeFile.name}
                      </div>
                      <button
                        onClick={() => {
                          setUploadedBackgroundThemeFile(null);
                          setUploadError("");
                        }}
                        className="hover:cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                {uploadError && (
                  <p className="text-red-500 text-sm mt-3">{uploadError}</p>
                )}
              </div>

              {/* Footer */}
              {uploadedBackgroundThemeFile && (
                <div className="px-4 py-3 flex justify-end">
                  <button
                    onClick={() => {
                      if (uploadedBackgroundThemeFile) {
                        setUseCustomTheme(true);
                        setShowUploadModal(false);
                      } else {
                        setUploadError("Please upload a video before saving.");
                      }
                    }}
                    className="px-4 py-2 bg-[#274c77] hover:cursor-pointer text-white rounded-lg hover:bg-[#1f3e63] transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Save size={20} /> Save
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {showModal && modalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-auto lg:h-[90vh] overflow-y-auto lg:overflow-y-hidden flex flex-col"
            >
              <div
                className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white"
                style={{
                  background: "linear-gradient(135deg, #274c77, #5a7db8)",
                }}
              >
                <button
                  className="cursor-pointer absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:rotate-90"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h3 className="text-2xl font-bold text-center pr-8 leading-tight">
                  {isEditing ? "Edit Event" : modalData.eventName}
                </h3>
                <div className="w-20 h-1 bg-white/30 rounded-full mx-auto mt-3"></div>
              </div>
              <div className="flex justify-end gap-4 p-4">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      title="Edit"
                      className="cursor-pointer text-[#3c6ea5] hover:text-[#274c77]"
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          modalData.eventId,
                          modalData.eventCategory?.eventCategoryId,
                        )
                      }
                      title="Delete"
                      className="cursor-pointer text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={22} />
                    </button>
                  </>
                )}
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex justify-center mb-6 relative w-fit mx-auto">
                  {isEditing ? (
                    editedEvent.eventPoster ? (
                      <div className="relative">
                        <img
                          src={editedEvent.eventPoster}
                          alt="Event Poster"
                          className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white ring-2 ring-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditedEvent({ ...editedEvent, eventPoster: "" })
                          }
                          className="absolute hover:cursor-pointer -top-2 -right-2 bg-white rounded-full p-1 text-red-600 hover:text-red-700 shadow-sm"
                          title="Remove poster"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 transition-colors cursor-pointer"
                        onClick={() =>
                          document.getElementById("posterInput")?.click()
                        }
                      >
                        <span className="text-xs text-center px-2">
                          Click or Drag to Upload
                        </span>
                        <input
                          id="posterInput"
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const previewUrl = URL.createObjectURL(file);
                              setEditedEvent({
                                ...editedEvent,
                                eventPoster: previewUrl,
                                posterFile: file,
                              });
                            }
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <img
                      src={`${eventImagesURL}/${modalData.eventPoster}`}
                      alt="Event Poster"
                      className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white ring-2 ring-gray-100"
                    />
                  )}
                </div>

                {isEditing ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        !editedEvent.eventName.trim() ||
                        !editedEvent.eventDescription.trim() ||
                        !editedEvent.eventDate ||
                        !editedEvent.eventOrganizer.trim()
                      ) {
                        error("Please fill all required fields.");
                        return;
                      }
                      handleEditSubmit();
                    }}
                  >
                    <div>
                      <label className="block font-medium mb-1 text-gray-700">
                        Event Name *
                      </label>
                      <input
                        type="text"
                        name="eventName"
                        value={editedEvent.eventName}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            eventName: e.target.value,
                          })
                        }
                        spellCheck={true}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 text-gray-700">
                        Description *
                      </label>
                      <textarea
                        name="eventDescription"
                        value={editedEvent.eventDescription}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            eventDescription: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    {/* <div>
                      <label className="block font-medium mb-1 text-gray-700">
                        Event Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="eventDate"
                        value={editedEvent.eventDate}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            eventDate: e.target.value,
                          })
                        }
                        spellCheck={true}
                        className="w-full p-2 border rounded-md"
                      />
                     
                    </div> */}
                    <div>
                      <label className="block font-medium mb-1 text-gray-700">
                        Event Date *
                      </label>

                      <DatePicker
                        selected={editedEvent.eventDate}
                        onChange={(date) =>
                          setEditedEvent({
                            ...editedEvent,
                            eventDate: date, // store raw Date object
                          })
                        }
                        showTimeSelect
                        dateFormat="MMM d, yyyy - h:mm aa"
                        placeholderText="Event date and time"
                        className="w-113 p-2 border rounded-md"
                        popperClassName="z-50"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1 text-gray-700">
                        Organizer *
                      </label>
                      <input
                        type="text"
                        name="eventOrganizer"
                        value={editedEvent.eventOrganizer}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            eventOrganizer: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        type="button"
                        className="px-4 py-2 bg-gray-200 hover:cursor-pointer rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white hover:cursor-pointer rounded hover:bg-blue-700"
                        style={{ backgroundColor: "#274c77" }}
                      >
                        Update
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p className="text-base font-semibold text-gray-800">
                      Description
                    </p>
                    <p className="italic text-sm text-gray-700">
                      "{modalData.eventDescription}"
                    </p>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#274c77" }}
                        ></div>
                        <span className="font-semibold text-gray-800 min-w-[100px]">
                          Status:
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            modalData.eventStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : modalData.eventStatus === "Upcoming"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {modalData.eventStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#274c77" }}
                        ></div>
                        <span className="font-semibold text-gray-800 min-w-[100px]">
                          Created:
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <span className="text-gray-600 font-medium">
                          {new Date(modalData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#274c77" }}
                        ></div>
                        <span className="font-semibold text-gray-800 min-w-[100px]">
                          Event Date:
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <span className="text-gray-600 font-medium">
                          {new Date(modalData.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#274c77" }}
                        ></div>
                        <span className="font-semibold text-gray-800 min-w-[100px]">
                          Coordinator:
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: "#274c77" }}
                          >
                            {modalData.eventOrganizer.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-700 font-medium">
                            {modalData.eventOrganizer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {isLaunching && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60]">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Opening Your Feedback
              </h3>
              <p className="text-gray-600">
                Please wait while we prepare your feedback form...
              </p>
            </div>
          </div>
        )}
        {/* Creating feedback modal */}
        {showFeedbackModal && modalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-8">
            <div
              ref={modalRef}
              className="bg-white shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            >
              <div
                className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white"
                style={{
                  background: "linear-gradient(135deg, #274c77, #5a7db8)",
                }}
              >
                <button
                  className="cursor-pointer absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:rotate-90 transition-all"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  <X size={20} />
                </button>

                <h3 className="text-3xl font-bold text-center leading-tight">
                  Create Feedback for {modalData.eventName}
                </h3>

                <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-4"></div>
              </div>

              <div className="p-8 flex-1 flex gap-8 min-h-[500px]">
                <div className="flex-1">
                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Add Feedback Question
                    </label>

                    <div className="space-y-6">
                      <textarea
                        value={currentQuestion.text}
                        onChange={handleTextAreaChange}
                        placeholder="Enter your feedback question here..."
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-0.5 focus:ring-[#274c77] focus:border-[#274c77] outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                        rows={4}
                        spellCheck={true}
                      />

                      <div className="flex justify-center -mt-4 -mb-2">
                        <button
                          onClick={addQuestion}
                          disabled={currentQuestion.text.length === 0}
                          className="flex items-center hover:cursor-pointer space-x-3 px-8 py-4 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-md font-semibold bg-[#4f6d9c] hover:bg-[#274c77]"
                        >
                          <Plus size={20} />

                          <span>Add Question</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-1 pb-8">
                    <div className=" space-y-3">
                      <div className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                        <h4 className="block text-lg font-semibold text-gray-700 mb-1">
                          Feedback Mode Selection
                        </h4>

                        <div className="space-y-3">
                          <label className="flex items-start space-x-4 cursor-pointer group">
                            <div className="flex items-center h-6">
                              <input
                                type="radio"
                                name="anonymousFeedback"
                                checked={allowAnonymous === true}
                                onChange={() => setAllowAnonymous(true)}
                                className="w-5 h-5 text-[#274c77] border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div className="flex-1">
                              <span className="text-base text-gray-800 group-hover:text-[#274c77] transition-colors">
                                Anonymous feedback
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start space-x-4 cursor-pointer group">
                            <div className="flex items-center h-6">
                              <input
                                type="radio"
                                name="anonymousFeedback"
                                checked={allowAnonymous === false}
                                onChange={() => setAllowAnonymous(false)}
                                className="w-5 h-5 text-[#274c77] border-gray-300  cursor-pointer"
                              />
                            </div>

                            <div className="flex-1">
                              <span className="text-base text-gray-800 group-hover:text-[#274c77] transition-colors">
                                Email Required
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => launchFeedback(modalData.eventId)}
                          disabled={
                            feedbackQuestions.length === 0 ||
                            isLaunching ||
                            allowAnonymous === null ||
                            confirmedTimeout === null
                          }
                          className="px-10 py-4 hover:cursor-pointer bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold text-md shadow-lg"
                        >
                          {isLaunching
                            ? "Launching..."
                            : `Save & Launch Feedback questions`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-px bg-gray-300 flex-shrink-0"></div>

                <div className="flex-1 overflow-y-auto px-2">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">
                      Questions Added ({feedbackQuestions.length})
                    </h4>

                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 min-h-[300px] max-h-[400px] overflow-y-auto"
                      onDragOver={handleDragOver}
                      onDrop={handleDropQuestion}
                    >
                      {feedbackQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare
                              size={24}
                              className="text-gray-400"
                            />
                          </div>

                          <p className="text-lg font-medium mb-2">
                            No Questions Found
                          </p>

                          <p className="text-sm text-center">
                            Add questions or drag them from the question bank
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {feedbackQuestions.map((question, index) => (
                            <div
                              key={question.id}
                              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 pr-3">
                                  {editingQuestionId === question.id ? (
                                    <div className="space-y-3">
                                      <input
                                        type="text"
                                        value={editingQuestionText}
                                        onChange={(e) =>
                                          setEditingQuestionText(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none"
                                        autoFocus
                                      />

                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => saveEdit(question.id)}
                                          disabled={!editingQuestionText.trim()}
                                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                          Save
                                        </button>

                                        <button
                                          onClick={cancelEdit}
                                          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="font-medium text-gray-800 text-base block mb-1">
                                      {index + 1}. {question.text}
                                    </span>
                                  )}
                                </div>

                                {editingQuestionId !== question.id && (
                                  <div className="flex space-x-1 flex-shrink-0">
                                    <button
                                      onClick={() => startEditing(question)}
                                      className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit question"
                                    >
                                      <Edit size={16} />
                                    </button>

                                    <button
                                      onClick={() =>
                                        removeQuestion(question.id)
                                      }
                                      className="text-red-500 cursor-pointer hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete question"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Do you want a customizable background theme?
                    </label>

                    <div className="flex items-center gap-6">
                      <label className="hover:cursor-pointer flex items-center space-x-2">
                        <input
                          type="radio"
                          name="customTheme"
                          value="yes"
                          checked={useCustomTheme === true}
                          onChange={() => {
                            setShowUploadModal(true);
                          }}
                          className="hover:cursor-pointer w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-gray-800 text-sm">Yes</span>
                      </label>

                      <label className="hover:cursor-pointer flex items-center space-x-2">
                        <input
                          type="radio"
                          name="customTheme"
                          value="no"
                          checked={useCustomTheme === false}
                          onChange={() => {
                            setUseCustomTheme(false);
                            setUploadedBackgroundThemeFile(null);
                            setUploadError("");
                            setShowUploadModal(false);
                          }}
                          className="hover:cursor-pointer w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-gray-800 text-sm">No</span>
                      </label>
                    </div>

                    {/* Selected file name with delete */}
                    {uploadedBackgroundThemeFile && (
                      <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
                        <span
                          className="text-sm text-gray-700 font-medium truncate max-w-[80%]"
                          title={uploadedBackgroundThemeFile.name}
                        >
                          🎬 {uploadedBackgroundThemeFile.name}
                        </span>
                        <button
                          onClick={() => {
                            setUploadedBackgroundThemeFile(null);
                            setUploadError("");
                            setUseCustomTheme(false);
                            setShowUploadModal(false);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {showUploadModal && (
                    <div
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
                      onClick={(e) => {
                        if (e.target.classList.contains("backdrop-blur-sm")) {
                          setShowUploadModal(false);
                          setUploadedBackgroundThemeFile(null);
                          setUploadError("");
                        }
                      }}
                    >
                      <div
                        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-xl transition-all duration-300 ${
                          uploadedBackgroundThemeFile ? "h-[70vh]" : "h-auto"
                        } overflow-hidden flex flex-col relative`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="bg-[#274c77] flex items-center justify-between px-4 py-3 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-white">
                            Upload Background Theme
                          </h3>
                          <button
                            onClick={() => {
                              setShowUploadModal(false);
                              setUploadedBackgroundThemeFile(null);
                              setUploadError("");
                            }}
                            className="hover:cursor-pointer text-white hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
                            title="Close"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-4 overflow-y-auto">
                          {!uploadedBackgroundThemeFile ? (
                            <div
                              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition text-center"
                              onClick={() =>
                                document
                                  .getElementById("videoUploadInput")
                                  ?.click()
                              }
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                handleFileUpload(file);
                              }}
                            >
                              <input
                                type="file"
                                id="videoUploadInput"
                                accept="video/mp4,video/webm, image/gif"
                                hidden
                                onChange={(e) =>
                                  handleFileUpload(e.target.files[0])
                                }
                              />
                              <p className="text-gray-600 text-sm font-medium">
                                Click or drag a video to upload
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Max 50MB • MP4 or GIF
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {uploadedBackgroundThemeFile.type.startsWith(
                                "image/",
                              ) ? (
                                <img
                                  src={URL.createObjectURL(
                                    uploadedBackgroundThemeFile,
                                  )}
                                  alt="Uploaded GIF"
                                  className="w-full rounded-lg shadow-md"
                                />
                              ) : (
                                <video
                                  src={URL.createObjectURL(
                                    uploadedBackgroundThemeFile,
                                  )}
                                  controls
                                  autoPlay
                                  className="w-full rounded-lg shadow-md"
                                />
                              )}

                              <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
                                <div
                                  className="text-sm text-gray-700 font-medium truncate max-w-[80%]"
                                  title={uploadedBackgroundThemeFile.name}
                                >
                                  🎬 {uploadedBackgroundThemeFile.name}
                                </div>

                                <button
                                  onClick={() => {
                                    setUploadedBackgroundThemeFile(null);
                                    setUploadError("");
                                  }}
                                  className="hover:cursor-pointer text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}

                          {uploadError && (
                            <p className="text-red-500 text-sm mt-3">
                              {uploadError}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        {uploadedBackgroundThemeFile && (
                          <div className="px-4 py-3 flex justify-end">
                            <button
                              onClick={() => {
                                if (uploadedBackgroundThemeFile) {
                                  setUseCustomTheme(true);
                                  setShowUploadModal(false);
                                } else {
                                  setUploadError(
                                    "Please upload a video before saving.",
                                  );
                                }
                              }}
                              className="px-4 py-2 bg-[#274c77] hover:cursor-pointer text-white rounded-lg hover:bg-[#1f3e63] transition"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Save size={20} /> Save
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Thank You Timeout (in seconds)
                    </label>

                    {isEditingTimeout ? (
                      <div className="flex items-center space-x-3">
                        {/* <input
                          type="text"
                          value={thankYouTimeout}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) setThankYouTimeout(value);
                          }}
                          className="w-15 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none"
                        /> */}
                        <input
                          ref={inputRef}
                          type="text"
                          value={thankYouTimeout}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only digits and max 2 characters
                            if (/^\d{0,2}$/.test(value)) {
                              const num = Number(value);
                              if (!isNaN(num)) setThankYouTimeout(num);
                            }
                          }}
                          className="w-15 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none"
                        />

                        <button
                          onClick={handleTimeoutSubmit}
                          className="px-3 py-1.5 cursor-pointer bg-[#274c77] hover:bg-[#1f3e63] text-white rounded-lg"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Save size={20} /> Save
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-800 font-medium">
                          {confirmedTimeout} Sec
                        </span>
                        <button
                          onClick={() => {
                            setThankYouTimeout(confirmedTimeout);
                            setIsEditingTimeout(true);
                          }}
                          className="cursor-pointer text-[#274c77] hover:bg-[#1f3e63] p-1 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Timeout"
                        >
                          <Edit size={20} />
                        </button>
                      </div>
                    )}

                    {timeoutError && (
                      <p className="text-red-500 text-sm mt-2">
                        Timeout must be between 1 and 15 seconds.
                      </p>
                    )}
                    {showConfirmation && (
                      <p className="text-green-600 text-sm mt-2">
                        Timeout saved successfully!
                      </p>
                    )}
                  </div>

                  {/* Idle Timeout (Launch Feedback) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Idle Timeout
                    </label>
                    <p className="text-gray-500 text-xs mb-2">
                      Automatically logs out feedback session after inactivity.
                    </p>

                    {isEditingIdleTimeout ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Enter value (10–99)"
                          value={idleTimeoutValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,2}$/.test(value)) {
                              if (value === "") {
                                setIdleTimeoutValue(""); // allow clearing
                              } else {
                                const num = Number(value);
                                if (!isNaN(num)) setIdleTimeoutValue(num);
                              }
                            }
                          }}
                          className="w-20 sm:w-24 px-2 py-1 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none text-sm"
                        />

                        <select
                          value={idleTimeoutUnit}
                          onChange={(e) => setIdleTimeoutUnit(e.target.value)}
                          className="w-24 sm:w-28 px-2 py-1 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#274c77] focus:border-[#274c77] outline-none text-sm cursor-pointer shadow-sm"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>

                        <button
                          onClick={() => {
                            if (
                              idleTimeoutValue === "" ||
                              isNaN(idleTimeoutValue) ||
                              idleTimeoutValue < 10 ||
                              idleTimeoutValue > 99
                            ) {
                              error("Idle timeout must be between 10 and 99");
                              return;
                            }
                            setConfirmedIdleTimeoutValue(idleTimeoutValue);
                            setConfirmedIdleTimeoutUnit(idleTimeoutUnit);
                            setIsEditingIdleTimeout(false);
                            success("Idle timeout saved successfully!");
                          }}
                          className="px-2 cursor-pointer sm:px-3 py-1 bg-[#274c77] text-white rounded-md hover:bg-[#1f3e63] text-sm flex items-center gap-1"
                        >
                          <Save size={14} /> Save
                        </button>

                        <button
                          onClick={() => setIsEditingIdleTimeout(false)}
                          className="px-2 cursor-pointer sm:px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 text-sm font-medium">
                          {confirmedIdleTimeoutValue} {confirmedIdleTimeoutUnit}
                        </span>
                        <button
                          onClick={() => {
                            setIdleTimeoutValue(confirmedIdleTimeoutValue);
                            setIdleTimeoutUnit(confirmedIdleTimeoutUnit);
                            setIsEditingIdleTimeout(true);
                          }}
                          className="text-[#274c77] hover:bg-blue-50 p-1 rounded-md cursor-pointer"
                          title="Edit Idle Timeout"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-px bg-gray-300 flex-shrink-0"></div>

                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        <Database size={20} />
                        Question Bank
                      </h4>

                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filteredQuestions.length} questions
                      </span>
                    </div>

                    {/* <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Select Event:
                    </label>

                    <select
                      className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77]"
                      value={feedbackModalEventId}
                      onChange={handleModalEventChange}
                    >
                      <option value="" className="bg-gray-300 hover:text-gray-100">All Events</option>
                      {filteredEvents.map((event) => (
                        <option
                          key={event.id || event.eventId}
                          value={event.id || event.eventId}
                        >
                          {event.eventName}
                        </option>
                      ))}
                    </select>
                  </div> */}

                    <div
                      className="relative w-full max-w-md mb-4"
                      ref={dropdownRef}
                    >
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Select Event:
                      </label>

                      <input
                        type="text"
                        placeholder="All Events"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#274c77] cursor-pointer"
                        onClick={() => setDropdownOpen(true)}
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (!dropdownOpen) return;
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setHighlightIndex((prev) =>
                              Math.min(prev + 1, filteredList.length),
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setHighlightIndex((prev) => Math.max(prev - 1, -1));
                          } else if (e.key === "Enter") {
                            e.preventDefault();
                            if (highlightIndex === -1) {
                              setSearchTerm("");
                              handleModalEventChange({ target: { value: "" } });
                              setDropdownOpen(false);
                            } else {
                              const event = filteredList[highlightIndex];
                              setSearchTerm(event.eventName);
                              handleModalEventChange({
                                target: { value: event.id || event.eventId },
                              });
                              setDropdownOpen(false);
                            }
                          }
                        }}
                      />

                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-lg">
                          <ul className="text-sm">
                            <li
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                                highlightIndex === -1 ? "" : ""
                              }`}
                              onClick={() => {
                                setSearchTerm("");
                                handleModalEventChange({
                                  target: { value: "" },
                                });
                                setDropdownOpen(false);
                              }}
                            >
                              All Events
                            </li>
                            <hr className="border-gray-200 my-1" />
                            {filteredEvents.filter((event) =>
                              searchTerm.trim() === ""
                                ? true
                                : event.eventName
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()),
                            ).length === 0 ? (
                              <li className="px-3 text-center py-2 text-gray-500">
                                No events found for this keyword
                              </li>
                            ) : (
                              filteredEvents
                                .filter((event) =>
                                  searchTerm.trim() === ""
                                    ? true
                                    : event.eventName
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()),
                                )
                                .map((event, index) => (
                                  <li
                                    key={event.id || event.eventId}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                                      highlightIndex === index
                                        ? "bg-gray-100"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setSearchTerm(event.eventName);
                                      handleModalEventChange({
                                        target: {
                                          value: event.id || event.eventId,
                                        },
                                      });
                                      setDropdownOpen(false);
                                    }}
                                  >
                                    {event.eventName}
                                  </li>
                                ))
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 min-h-[300px] max-h-[400px] overflow-y-auto">
                      {questionBankLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <p>Loading questions…</p>
                        </div>
                      ) : questionBankError ? (
                        <div className="text-center text-red-600 p-4">
                          <p>No Questions Available</p>
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Search size={24} className="text-gray-400 mb-2" />
                          <p className="text-sm text-center">
                            {questionBank.length === 0
                              ? "No questions in bank"
                              : "No matching questions found"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredQuestions.map((question) => {
                            const isAdded = feedbackQuestions.some((q) => {
                              const existingText = (
                                q.text ??
                                q.feedbackQuestion ??
                                ""
                              )
                                .trim()
                                .toLowerCase();
                              const newText = (
                                question.feedbackQuestion ??
                                question.text ??
                                ""
                              )
                                .trim()
                                .toLowerCase();
                              return existingText === newText;
                            });

                            return (
                              <div
                                key={question.id}
                                draggable
                                onDragStart={(e) =>
                                  handleDragStart(e, question)
                                }
                                onClick={() => {
                                  if (isAdded) {
                                    error("This question already exists!");
                                    return;
                                  }
                                  addQuestionFromBank(question);
                                  success("Question added successfully!");
                                }}
                                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                  isAdded
                                    ? "bg-green-50 border-green-200 text-green-700 cursor-not-allowed"
                                    : "bg-white border-gray-200 hover:border-[#274c77] hover:bg-blue-50 hover:shadow-sm"
                                }`}
                                title={
                                  isAdded
                                    ? "Question already added"
                                    : "Click to add or drag to Questions Added"
                                }
                              >
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium flex-1 pr-2">
                                    {question.feedbackQuestion}
                                  </p>
                                  {isAdded && (
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex-shrink-0">
                                      Added
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                <h2
                  className="text-3xl font-bold bg-clip-text text-transparent"
                  style={{ color: "#274c77" }}
                >
                  Create New Event
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:cursor-pointer hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Name *
                      </label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        spellCheck={true}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-900 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter event name"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Description *
                      </label>
                      <textarea
                        name="eventDescription"
                        value={formData.eventDescription}
                        onChange={handleInputChange}
                        spellCheck={true}
                        className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-900 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                        placeholder="Describe your event here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Event Date *
                        </label>
                        <DatePicker
                          selected={formData.startingDate || new Date()}
                          onChange={(date) =>
                            handleInputChange({
                              target: { name: "startingDate", value: date },
                            })
                          }
                          popperClassName="custom-datepicker"
                          showTimeSelect
                          dateFormat="MMM d,yyyy - h:mm aa"
                          placeholderText="Event date and time"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-900 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Created By *
                        </label>
                        <input
                          type="text"
                          name="createdBy"
                          value={formData.createdBy}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-900 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Poster
                    </label>
                    <div className="hidden lg:block">
                      {!formData.eventPoster ? (
                        <div
                          className={`flex-1 border-3 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group relative overflow-hidden ${
                            dragActive
                              ? "border-blue-500 bg-blue-50 scale-105"
                              : "border-gray-300 hover:border-purple-900 hover:bg-blue-50"
                          }`}
                          style={{ backgroundColor: "#f4f8fc" }}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                          <div className="relative py-10 z-10 flex flex-col items-center justify-center h-full space-y-4">
                            <div className="relative">
                              <div
                                style={{ backgroundColor: "#274c77" }}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  dragActive
                                    ? "scale-110 rotate-12"
                                    : "group-hover:scale-110"
                                }`}
                              >
                                <Camera className="text-white" size={32} />
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                                <Plus className="text-white" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p
                                className="text-lg font-semibold text-gray-700 transition-colors"
                                style={{ color: "#274c77" }}
                              >
                                {dragActive
                                  ? "Drop your poster here!"
                                  : "Upload Poster"}
                              </p>
                              <p className="text-sm text-gray-900">
                                Drag & drop or click to select
                              </p>
                              <p className="text-xs text-gray-900">
                                PNG, JPG up to 2MB
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-80 relative rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                          <div className="hidden lg:block w-full h-full">
                            <img
                              src={URL.createObjectURL(formData.eventPoster)}
                              alt="Poster preview"
                              className="w-full h-full object-contain bg-white p-2"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          {/* Action Buttons - Always Visible */}
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center space-x-3">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all transform hover:scale-110 shadow-lg"
                            >
                              <Camera size={30} />
                            </button>
                            <button
                              onClick={removeLogo}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all transform hover:scale-110 shadow-lg"
                            >
                              <X size={30} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-0 mb-6">
                      <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-gray-100 rounded-xl mt-4">
                        {!formData.eventPoster && (
                          <label
                            className="text-sm text-blue-700 cursor-pointer hover:underline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Upload Poster
                          </label>
                        )}
                        {formData.eventPoster ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm text-gray-800 truncate max-w-[180px]">
                              {formData.eventPoster.name}
                            </span>
                            <button
                              onClick={removeLogo}
                              className="text-red-500 hover:text-red-700 text-lg font-bold ml-2"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No file selected
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files[0] && handleLogoUpload(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 shrink-0 flex justify-end space-x-4 bg-white">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
                >
                  Cancel
                </button>
                <ButtonLoader
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  className="cursor-pointer px-8 py-3 text-white rounded-xl shadow-lg hover:scale-105"
                  style={{ backgroundColor: "#274c77" }}
                >
                  Create Event
                </ButtonLoader>
              </div>
            </div>
          </div>
        )}
        {showFeedbackResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div
              ref={modalRef}
              className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setShowFeedbackResponse(false)}
                className="absolute top-4 right-4 hover:cursor-pointer text-black hover:text-gray-600"
              >
                ✕
              </button>
              <div className="h-full w-full p-6 overflow-auto">
                <FeedbackResponse feedbackData={feedbackResponseData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Events;
