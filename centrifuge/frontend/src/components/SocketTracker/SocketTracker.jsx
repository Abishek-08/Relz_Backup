import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Server,
  Users,
  UserX,
  Activity,
  Filter,
  Trash2,
  CheckSquare,
  Square,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Monitor,
  ChevronDown,
  MessageCircleHeartIcon,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackResponseModal from "../EventManagement/FeedbackResponseModal.jsx";
import SurveyReportModalParent from "../Survey/SurveyReports/pages/SurveyReportModalParent.jsx";
import { useSelector } from "react-redux";
import { useAuth } from "../../routes/AuthContext.jsx";
import {
  disconnectCentrifugeConnections,
  getAllPresenceConnections,
  getFeedbackAnonymousCountByEventId,
  getFeedbackResponsesByEventId,
  getSurveyAnonymousCount,
  updateFeedbackInformation,
  updateSurveyInformation,
} from "../../services/Services.jsx";

/* ------------------------------------------------------------
   Small toast helpers (console-based)
------------------------------------------------------------ */
const useLightToast = () => {
  const success = (msg) => console.log("[SUCCESS]", msg);
  const error = (msg) => console.warn("[ERROR]", msg);
  return { success, error };
};

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
const deriveChannelsFromUserType = (userType) => {
  const ut = (userType || "").toString().toLowerCase();
  return {
    survey: ut.includes("survey"),
    feedback: ut.includes("feedback"),
  };
};

/**
 * Normalize multiple possible presence payload shapes into a flat array
 * of items we can render.
 * Supported shapes:
 * 1) { presence: { clientId: { user, client, conn_info: { email, userType, createdAt? } } } }
 * 2) { survey: { presence: {...} }, feedback: { presence: {...} } }
 * 3) Array of already-normalized items
 */
const normalizePresenceResponse = (res) => {
  const byKey = new Map();

  const upsert = (key, base, channelHint) => {
    const existing = byKey.get(key) || {
      id: base.client || base.clientId || key,
      clientId: base.client || base.clientId || key,
      email: base.conn_info?.email || base.email || base.user || "",
      userType: base.conn_info?.userType || base.userType || null,
      survey: false,
      feedback: false,
      isActive: true,
      createdAt:
        base.conn_info?.createdAt || base.connectedAt || base.createdAt || null,
    };

    // infer channels
    const fromUT = deriveChannelsFromUserType(existing.userType);
    existing.survey = existing.survey || fromUT.survey;
    existing.feedback = existing.feedback || fromUT.feedback;

    if (channelHint === "survey") existing.survey = true;
    if (channelHint === "feedback") existing.feedback = true;

    byKey.set(key, existing);
  };

  // 3) Already an array
  if (Array.isArray(res)) {
    res.forEach((row) => {
      const key =
        row.clientId ||
        row.id ||
        row.socketId ||
        row.email ||
        Math.random().toString(36).slice(2);
      upsert(key, row, row.channel || row.type);
    });
    return Array.from(byKey.values());
  }

  // 2) Combined payload by channel
  if (res && (res.survey?.presence || res.feedback?.presence)) {
    if (res.survey?.presence && typeof res.survey.presence === "object") {
      Object.entries(res.survey.presence).forEach(([clientId, entry]) => {
        upsert(clientId, entry, "survey");
      });
    }
    if (res.feedback?.presence && typeof res.feedback.presence === "object") {
      Object.entries(res.feedback.presence).forEach(([clientId, entry]) => {
        upsert(clientId, entry, "feedback");
      });
    }
    return Array.from(byKey.values());
  }

  // 1) Simple presence object
  if (res && res.presence && typeof res.presence === "object") {
    Object.entries(res.presence).forEach(([clientId, entry]) => {
      upsert(clientId, entry, null);
    });
    return Array.from(byKey.values());
  }

  // Fallback: unknown shape
  return [];
};

const SocketTracker = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { error, success } = useLightToast();

  // Availability toggles (keep as-is)
  const [fbAvail, setFbAvail] = useState(true);
  const [svAvail, setSvAvail] = useState(true);
  const showBoth = fbAvail && svAvail;
  const cardCls = showBoth ? "border rounded-lg p-3" : "p-3";

  // redux-state
  const selectedEventId = useSelector(
    (state) =>
      state.survey?.surveyShownData.eventId ||
      state.feedback?.feedbackShownData.eventId,
  );
  const eventName = useSelector(
    (state) =>
      state.survey?.surveyShownData.eventName ||
      state.feedback?.feedbackShownData.eventName,
  );
  const feedbackInfo = useSelector(
    (state) => state.feedback.feedbackShownData.feedbackInfo,
  );
  const surveyInfo = useSelector(
    (state) => state.survey.surveyShownData.surveyInfo,
  );

  const [terminationType, setTerminationType] = useState("");

  const [oneEvent, setOneEvent] = useState(null);
  const [nodeData, setNodeData] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({
    users: 0,
    anonymous: 0,
  });
  const [surveyStats, setSurveyStats] = useState({ users: 0, anonymous: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterActive, setFilterActive] = useState(null); // null|true|false
  const [filterType, setFilterType] = useState("all"); // all|survey|feedback
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [terminateRefresh, setTerminateRefresh] = useState(1);

  const [ananoymousFeedbackCount, setAnanoymousFeedbackCount] = useState(0);
  const [ananoymousSurveyCount, setAnanoymousSurveyCount] = useState(0);

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const total = nodeData.length;
    const active = nodeData.filter((n) => n.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [nodeData]);

  useEffect(() => {
    getFeedbackAnonymousCountByEventId(selectedEventId).then((res) =>
      setAnanoymousFeedbackCount(res),
    );

    getSurveyAnonymousCount(selectedEventId).then((res) =>
      setAnanoymousSurveyCount(res),
    );
  }, [selectedEventId]);

  console.log(
    "ffbb: ",
    ananoymousFeedbackCount,
    "sscc: ",
    ananoymousSurveyCount,
  );

  // Modals
  const [showFeedbackResponse, setShowFeedbackResponse] = useState(false);
  const [feedbackResponseData, setFeedbackResponseData] = useState([]);
  const [showSurveyReport, setShowSurveyReport] = useState(false);

  // Mock top tiles (keep behavior)
  useEffect(() => {
    setOneEvent({ id: selectedEventId, eventName });
    setFeedbackStats({ users: 0, anonymous: 0 });
    setSurveyStats({ users: 0, anonymous: 0 });
  }, [selectedEventId, eventName, terminateRefresh]);

  // Load presence data
  const getCentrifugePresence = async () => {
    try {
      const res = await getAllPresenceConnections();
      const normalized = normalizePresenceResponse(res);
      setNodeData(normalized);
    } catch (e) {
      console.error(e);
      setNodeData([]);
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      await getCentrifugePresence();
    }, 4000);

    return () => clearInterval(timer);
  }, [terminateRefresh]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
    success("Logged out");
  }, [navigate, success, logout]);

  // Filtering
  const filteredData = useMemo(() => {
    let base = [...nodeData];

    if (filterActive !== null) {
      base = base.filter((n) => n.isActive === filterActive);
    }

    // if (filterType === "survey") {
    //   base = base.filter((n) => n.survey === true);
    // } else if (filterType === "feedback") {
    //   base = base.filter((n) => n.feedback === true);
    // }

    return base;
  }, [nodeData, filterActive]);

  // Sorting
  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    const { key, direction } = sortConfig || {};
    if (!key) return arr;

    arr.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "createdAt") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else if (key === "isActive" || key === "survey" || key === "feedback") {
        aVal = aVal ? 1 : 0;
        bVal = bVal ? 1 : 0;
      } else if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filterActive, filterType, terminateRefresh]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Selection
  const handleRowSelect = (id) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const ids = paginatedData.map((n) => n.email || n.email).filter(Boolean);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  console.log("selectedIDDS: ", selectedIds);

  useEffect(() => {
    const ids = paginatedData.map((n) => n.email || n.id).filter(Boolean);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [selectedIds, paginatedData, terminateRefresh]);

  // Termination (UI-only). Separate actions for Survey and Feedback per-row
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    channel: null,
  });

  const requestTerminate = (id, channel) => {
    setConfirm({ open: true, id, channel });
  };

  const confirmTerminate = () => {
    const { id, channel } = confirm;
    if (!id || !channel)
      return setConfirm({ open: false, id: null, channel: null });

    setNodeData((prev) => {
      return prev
        .map((row) => {
          if (row.clientId !== id && row.id !== id) return row;
          const next = { ...row };
          if (channel === "survey") next.survey = false;
          if (channel === "feedback") next.feedback = false;
          // if both off, mark inactive (or remove below)
          if (!next.survey && !next.feedback) next.isActive = false;
          return next;
        })
        .filter((r) => r.isActive || r.survey || r.feedback); // drop completely if nothing remains
    });

    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setConfirm({ open: false, id: null, channel: null });
  };

  // End main connection (keep as-is behavior)
  const [showMasterModal, setShowMasterModal] = useState(false);
  const endCfg = useMemo(() => {
    if (fbAvail && svAvail) {
      return {
        buttonLabel: "Close Feedback & Survey",
        tooltip:
          "This will stop both Feedback and Survey collection and sign you out.",
        modalTitle: "Close Feedback & Survey",
        modalMessage:
          "Are you sure you want to close this response sessions? This will stop both Feedback and Survey collection and sign you out.",
        confirmLabel: "Close",
      };
    }
    if (fbAvail && !svAvail) {
      return {
        buttonLabel: "Close Feedback",
        tooltip: "This will stop Feedback collection and sign you out.",
        modalTitle: "Close Feedback",
        modalMessage:
          "Are you sure you want to close this response session? This will stop Feedback collection and sign you out.",
        confirmLabel: "Close",
      };
    }
    if (!fbAvail && svAvail) {
      return {
        buttonLabel: "Close Survey",
        tooltip: "This will stop Survey collection and sign you out.",
        modalTitle: "Close Survey",
        modalMessage:
          "Are you sure you want to close this response session? This will stop Survey collection and sign you out.",
        confirmLabel: "Close",
      };
    }
    return {
      buttonLabel: "End Session",
      tooltip: "This will sign you out.",
      modalTitle: "End Session",
      modalMessage:
        "Are you sure you want to end this session? You will be signed out.",
      confirmLabel: "Close",
    };
  }, [fbAvail, svAvail]);

  const handleMasterTerminate = () => {
    setIsLoading(true);

    if (terminationType === "users") {
      disconnectCentrifugeConnections(selectedIds);
      setIsLoading(false);
      setTerminateRefresh(terminateRefresh + 1);
      console.log("terminate-users");
      return;
    }

    // Clone objects before modifying
    var updatedFeedbackInfo = { ...feedbackInfo };
    var updatedSurveyInfo = { ...surveyInfo };

    const connectedUsersList = nodeData.map((n) => n.email);
    console.log("connected-users: ", connectedUsersList);

    try {
      if (fbAvail && svAvail) {
        updatedFeedbackInfo.feedbackStatus = "Completed";
        updatedSurveyInfo.surveyStatus = "Completed";
        disconnectCentrifugeConnections(connectedUsersList);
        updateFeedbackInformation(selectedEventId, updatedFeedbackInfo);
        updateSurveyInformation(selectedEventId, updatedSurveyInfo);
        handleLogout();
      } else if (fbAvail) {
        updatedFeedbackInfo.feedbackStatus = "Completed";
        disconnectCentrifugeConnections(connectedUsersList);
        updateFeedbackInformation(selectedEventId, updatedFeedbackInfo);
      } else if (svAvail) {
        updatedSurveyInfo.surveyStatus = "Completed";
        disconnectCentrifugeConnections(connectedUsersList);
        updateSurveyInformation(selectedEventId, updatedSurveyInfo);
      }
      setIsLoading(false);
      setTerminateRefresh(terminateRefresh + 1);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  // UI helpers
  const StatCircle = ({ icon: Icon, label, count, color, percentage }) => (
    <div className="flex flex-col items-center p-2">
      <div className="relative">
        <div
          className={`w-18 h-18 rounded-full border-4 ${color} flex items-center justify-center bg-white shadow-lg`}
        >
          <Icon className={`w-6 h-6 ${color.replace("border-", "text-")}`} />
        </div>
        {percentage !== undefined && (
          <div
            className="absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: "#274c77" }}
          >
            {percentage}%
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-gray-800 mt-2">{count}</div>
      <div className="text-xs text-gray-600 font-medium text-center">
        {label}
      </div>
    </div>
  );

  const getStatusBadge = (isActive) =>
    isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        <Power className="w-3 h-3 mr-1" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <PowerOff className="w-3 h-3 mr-1" /> Inactive
      </span>
    );

  const ChannelBadge = ({ on, label }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        on
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
    >
      {label}
    </span>
  );

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Render
  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="border-b border-gray-200 px-6 py-4 flex-shrink-0"
        style={{ backgroundColor: "#274c77" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {oneEvent?.eventName ?? "Response Tracker"}
          </h1>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {fbAvail && (
              <div
                className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg hover:cursor-pointer"
                onClick={async () => {
                  if (!selectedEventId) return;
                  try {
                    const resp =
                      await getFeedbackResponsesByEventId(selectedEventId);
                    setFeedbackResponseData(resp.data);
                    setShowFeedbackResponse(true);
                  } catch (err) {
                    console.error("Failed to fetch feedback responses:", err);
                  }
                }}
              >
                <MessageCircleHeartIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  View Feedback Responses
                </span>
              </div>
            )}
            {svAvail && (
              <div
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:cursor-pointer"
                onClick={() => {
                  if (!selectedEventId) return;
                  setShowSurveyReport(true);
                }}
              >
                <MessageCircleHeartIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  View Survey Reports
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex flex-col space-y-4">
          {/* Stats */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Connections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Monitor
                  className="w-6 h-6 mr-2"
                  style={{ color: "#274c77" }}
                />
                Connection Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCircle
                  icon={Server}
                  label="Total Connections"
                  count={dashboardStats.total}
                  color="border-blue-600"
                  percentage={dashboardStats.total > 0 ? 100 : 0}
                />
                <StatCircle
                  icon={Activity}
                  label="Active Connections"
                  count={dashboardStats.active}
                  color="border-green-500"
                  percentage={
                    dashboardStats.total
                      ? Math.round(
                          (dashboardStats.active / dashboardStats.total) * 100,
                        )
                      : 0
                  }
                />
              </div>
            </div>

            {/* Feedback + Survey */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" style={{ color: "#274c77" }} />
                Users
              </h2>
              <div
                className={`grid ${showBoth ? "grid-cols-2" : "grid-cols-1"} gap-4`}
              >
                {fbAvail && (
                  <div className={cardCls}>
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Feedback
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatCircle
                        icon={Users}
                        label="Total Users"
                        count={dashboardStats.total}
                        color="border-purple-500"
                        percentage={dashboardStats.total > 0 ? 100 : 0}
                      />
                      <StatCircle
                        icon={UserX}
                        label="Anonymous"
                        count={ananoymousFeedbackCount}
                        color="border-orange-500"
                        percentage={
                          feedbackStats.users
                            ? Math.round(
                                (feedbackStats.anonymous /
                                  feedbackStats.users) *
                                  100,
                              )
                            : 0
                        }
                      />
                    </div>
                  </div>
                )}
                {svAvail && (
                  <div className={cardCls}>
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Survey
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatCircle
                        icon={Users}
                        label="Total Users"
                        count={dashboardStats.total}
                        color="border-indigo-500"
                        percentage={dashboardStats.total > 0 ? 100 : 0}
                      />
                      <StatCircle
                        icon={UserX}
                        label="Anonymous"
                        count={ananoymousSurveyCount}
                        color="border-amber-500"
                        percentage={
                          surveyStats.users
                            ? Math.round(
                                (surveyStats.anonymous / surveyStats.users) *
                                  100,
                              )
                            : 0
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* LEFT */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                {/* Filter Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      Filter:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterActive(null)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterActive === null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      All ({nodeData.length})
                    </button>
                    <button
                      onClick={() => setFilterActive(true)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterActive === true ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Active ({dashboardStats.active})
                    </button>
                    <button
                      onClick={() => setFilterActive(false)}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterActive === false ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Inactive ({dashboardStats.inactive})
                    </button>
                  </div>
                </div>

                {/* Type (Survey/Feedback) */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 font-medium">
                    Type:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setFilterType("all");
                        setFbAvail(true);
                        setSvAvail(true);
                      }}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterType === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        (setFilterType("survey"), setSvAvail(true));
                        setFbAvail(false);
                      }}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterType === "survey" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Survey
                    </button>
                    <button
                      onClick={() => {
                        (setFilterType("feedback"),
                          setFbAvail(true),
                          setSvAvail(false));
                      }}
                      className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterType === "feedback" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Feedback
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: End Main */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button
                    onClick={() => {
                      setTerminationType("users");
                      setShowMasterModal(true);
                    }}
                    className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-orange-400 text-white hover:bg-orange-500`}
                    title={"terminate users"}
                  >
                    <X className="w-4 h-4" />
                    <span>Terminate users</span>
                  </button>
                  <span className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    This will disconnect the users from channel
                  </span>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => setShowMasterModal(true)}
                    className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-red-600 text-white hover:bg-red-700`}
                    title={endCfg.tooltip}
                  >
                    <X className="w-4 h-4" />
                    <span>{endCfg.buttonLabel}</span>
                  </button>
                  <span className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {endCfg.tooltip}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Connections Table */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* TABLE (md and up) */}
            <div className="hidden md:block flex-1 overflow-auto">
              <div className="min-w-full overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                  <colgroup>
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "23%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    {/* <col style={{ width: "18%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} /> */}
                  </colgroup>
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="text-center p-2 text-sm font-semibold text-gray-900 border border-gray-200">
                        <button
                          onClick={handleSelectAll}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label={selectAll ? "Unselect all" : "Select all"}
                        >
                          {selectAll ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex justify-center items-center space-x-1">
                          <span>S.No</span>
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex items-center space-x-1">
                          <span>Email</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("email")}
                            aria-label="Sort by email"
                          >
                            <SortIcon column="email" />
                          </button>
                        </div>
                      </th>
                      <th className="text-center p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex justify-center items-center space-x-1">
                          <span>Status</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("isActive")}
                            aria-label="Sort by status"
                          >
                            <SortIcon column="isActive" />
                          </button>
                        </div>
                      </th>
                      <th className="text-center p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex justify-center items-center space-x-1">
                          <span>User Type</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("userType")}
                            aria-label="Sort by user type"
                          >
                            <SortIcon column="userType" />
                          </button>
                        </div>
                      </th>
                      {/* <th className="text-center p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex justify-center items-center space-x-1">
                          <span>Survey</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("survey")}
                            aria-label="Sort by survey"
                          >
                            <SortIcon column="survey" />
                          </button>
                        </div>
                      </th> */}
                      {/* <th className="text-center p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex justify-center items-center space-x-1">
                          <span>Feedback</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("feedback")}
                            aria-label="Sort by feedback"
                          >
                            <SortIcon column="feedback" />
                          </button>
                        </div>
                      </th> */}
                      {/* <th className="text-center p-4 text-sm font-semibold text-gray-900 border border-gray-200">
                        <div className="flex justify-center items-center space-x-1">
                          <span>Connected At</span>
                          <button
                            className="ml-1"
                            onClick={() => handleSort("createdAt")}
                            aria-label="Sort by connected at"
                          >
                            <SortIcon column="createdAt" />
                          </button>
                        </div>
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, index) => (
                        <tr
                          key={(row.clientId || row.id || index) + "-row"}
                          className="hover:bg-gray-50 transition-colors"
                          style={{ height: "65px" }}
                        >
                          <td className="text-center p-4 border border-gray-200">
                            <div className="flex justify-center items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleRowSelect(row.email || row.id)
                                }
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                aria-label={
                                  selectedIds.includes(row.email || row.id)
                                    ? "Unselect row"
                                    : "Select row"
                                }
                              >
                                {selectedIds.includes(row.email || row.id) ? (
                                  <CheckSquare className="w-4 h-4" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                              <span className="text-gray-900 font-medium">
                                {startIndex + index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="text-left p-4 border border-gray-200 text-gray-800 text-sm truncate">
                            {row.email || "-"}
                          </td>
                          <td className="text-center p-4 border border-gray-200">
                            {getStatusBadge(row.isActive)}
                          </td>
                          <td className="text-center p-4 border border-gray-200 text-gray-700 text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {row.userType || "-"}
                            </span>
                          </td>
                          {/* <td className="text-center p-4 border border-gray-200">
                            <div className="flex items-center justify-center gap-2">
                              <ChannelBadge
                                on={row.survey}
                                label={row.survey ? "Connected" : "–"}
                              />
                              <button
                                onClick={() =>
                                  requestTerminate(
                                    row.clientId || row.id,
                                    "survey",
                                  )
                                }
                                disabled={!row.survey}
                                className="cursor-pointer inline-flex items-center px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Terminate
                              </button>
                            </div>
                          </td> */}
                          {/* <td className="text-center p-4 border border-gray-200">
                            <div className="flex items-center justify-center gap-2">
                              <ChannelBadge
                                on={row.feedback}
                                label={row.feedback ? "Connected" : "–"}
                              />
                              <button
                                onClick={() =>
                                  requestTerminate(
                                    row.clientId || row.id,
                                    "feedback",
                                  )
                                }
                                disabled={!row.feedback}
                                className="cursor-pointer inline-flex items-center px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Terminate
                              </button>
                            </div>
                          </td>
                          <td className="text-center p-4 border border-gray-200 text-gray-700 text-sm">
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleString()
                              : "-"}
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center p-4 text-gray-500"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CARD LIST (mobile) */}
            <div className="md:hidden flex-1 overflow-auto p-2 space-y-3">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <div
                    key={(row.clientId || row.id || index) + "-card"}
                    className="border rounded-lg p-3 shadow-sm bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleRowSelect(row.clientId || row.id)
                          }
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label={
                            selectedIds.includes(row.clientId || row.id)
                              ? "Unselect card"
                              : "Select card"
                          }
                        >
                          {selectedIds.includes(row.clientId || row.id) ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-xs text-gray-500">
                          #{startIndex + index + 1}
                        </span>
                      </div>
                      {getStatusBadge(row.isActive)}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-900 font-medium truncate">
                          {row.email || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">User Type</span>
                        <span className="text-gray-900 font-medium">
                          {row.userType || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Survey</span>
                        <div className="flex items-center gap-2">
                          <ChannelBadge
                            on={row.survey}
                            label={row.survey ? "Connected" : "–"}
                          />
                          <button
                            onClick={() =>
                              requestTerminate(row.clientId || row.id, "survey")
                            }
                            disabled={!row.survey}
                            className="cursor-pointer inline-flex items-center px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Terminate
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Feedback</span>
                        <div className="flex items-center gap-2">
                          <ChannelBadge
                            on={row.feedback}
                            label={row.feedback ? "Connected" : "–"}
                          />
                          <button
                            onClick={() =>
                              requestTerminate(
                                row.clientId || row.id,
                                "feedback",
                              )
                            }
                            disabled={!row.feedback}
                            className="cursor-pointer inline-flex items-center px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Terminate
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Connected At</span>
                        <span className="text-gray-900 font-medium">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No data available.
                </div>
              )}
            </div>

            {/* Pagination */}
            {sortedData.length > 0 && (
              <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-700">
                    Showing {sortedData.length === 0 ? 0 : startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
                    {sortedData.length} entries
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-700">
                        Items per page
                      </span>
                      <div className="relative">
                        <select
                          value={itemsPerPage}
                          onChange={(e) =>
                            handleItemsPerPageChange(Number(e.target.value))
                          }
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-2 py-1 pr-7 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {/* Compact window */}
                        {Array.from(
                          { length: Math.min(totalPages, 5) },
                          (_, i) => {
                            let page;
                            if (totalPages <= 5) page = i + 1;
                            else if (currentPage <= 3) page = i + 1;
                            else if (currentPage >= totalPages - 2)
                              page = totalPages - 4 + i;
                            else page = currentPage - 2 + i;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                aria-current={
                                  currentPage === page ? "page" : undefined
                                }
                              >
                                {page}
                              </button>
                            );
                          },
                        )}
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          disabled={currentPage === totalPages}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm per-channel terminate */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm termination
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to terminate this {confirm.channel}{" "}
              connection?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() =>
                  setConfirm({ open: false, id: null, channel: null })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmTerminate}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm End Main Connection modal */}
      {showMasterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              {endCfg.modalTitle}
            </h2>
            <p className="text-sm text-gray-600 mb-5">{endCfg.modalMessage}</p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowMasterModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowMasterModal(false);
                  await handleMasterTerminate();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                {endCfg.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-opacity-50"></div>
            <p className="text-gray-700 font-medium">Ending main connection…</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showFeedbackResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => async () => {
                if (!selectedEventId) return;
                try {
                  const resp =
                    await getFeedbackResponsesByEventId(selectedEventId);
                  setFeedbackResponseData(resp.data);
                  setShowFeedbackResponse(true);
                } catch (err) {
                  console.error("Failed to fetch feedback responses:", err);
                }
              }}
              className="cursor-pointer absolute top-4 right-4 text-black hover:text-gray-600"
            >
              ✕
            </button>
            <div className="h-full w-full p-6 overflow-auto">
              <FeedbackResponseModal feedbackData={feedbackResponseData} />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showFeedbackResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setShowFeedbackResponse(false)}
              className="cursor-pointer absolute top-4 right-4 text-black hover:text-gray-600"
            >
              ✕
            </button>
            <div className="h-full w-full p-6 overflow-auto">
              <FeedbackResponseModal feedbackData={feedbackResponseData} />
            </div>
          </div>
        </div>
      )}

      {showSurveyReport && selectedEventId && (
        <SurveyReportModalParent
          eventId={selectedEventId}
          onClose={() => setShowSurveyReport(false)}
        />
      )}
    </div>
  );
};

export default SocketTracker;
