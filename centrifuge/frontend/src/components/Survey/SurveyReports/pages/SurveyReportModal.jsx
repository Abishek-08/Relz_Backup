import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getAggregatedReport,
  getEventById,
  getIndividualResponses,
} from "../../../../services/Services.jsx";

import useScrollRestoration from "../hooks/useScrollRestoration.jsx";

import ReportHeader from "../components/ReportHeader.jsx";
import ReportMetaInfo from "../components/ReportMetaInfo.jsx";
import ViewToggle from "../components/ViewToggle.jsx";
import ExportMenu from "../components/ExportMenu.jsx";
import AggregatedReportView from "./AggregatedModalReportView.jsx";
import IndividualReportView from "../components/IndividualReportView.jsx";
import SkeletonLoader from "../components/SkeletonLoader.jsx";
import EmptyState from "../components/EmptyState.jsx";

import { useToast } from "../../../../utils/useToast";
import { fmtDate } from "../utils/datetime.jsx";
import { decryptSession } from "../../../../utils/SessionCrypto.jsx";

const PRIMARY = "#27235c";

const isValidRange = ({ from, to }) => {
  if (!from && !to) return true;
  if (from && !to) return true;
  if (!from && to) return false;
  return new Date(from) <= new Date(to);
};

// Fallback question type
const inferType = (resp) => {
  if (Array.isArray(resp)) return "checkbox";
  if (resp && typeof resp === "object") return "matrix";
  if (!isNaN(Number(resp))) return "rating";
  return "radio";
};

export default function SurveyReportModal({
  autoRefreshMs = 0,
  scrollParentRef,
}) {
  // const { eventId } = useParams();
  const encrypted = localStorage.getItem("eventObjId");
  const externalEventId = encrypted ? decryptSession(encrypted) : null;

  const navigate = useNavigate();
  const { success, error } = useToast();

  const [eventId, setEventId] = useState("");
  const [view, setView] = useState("aggregated");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [dateError, setDateError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [aggData, setAggData] = useState(null);
  const [indData, setIndData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
  });

  const { save, restore } = useScrollRestoration(`report-${eventId}`);

  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const eventData = await getEventById(externalEventId);
        setEventId(eventData?.data?._id);
      } catch (err) {
        console.error("Error fetching event object id:", err);
      }
    };

    if (externalEventId) {
      fetchEventId();
    }
  }, [externalEventId]);

  // Prevent header flicker — simple sticky without animations
  useEffect(() => {
    document.body.classList.add("overflow-x-hidden"); // avoid horizontal drift on mobile
    return () => document.body.classList.remove("overflow-x-hidden");
  }, []);

  // Build maps from aggregated for Individual ordering
  // Build maps by questionId and by questionText (fallback)
  const questionTypeById = useMemo(() => {
    const map = {};
    (aggData?.questions || []).forEach((q) => {
      if (q?.questionId && q?.questionType) {
        map[String(q.questionId)] = q.questionType;
      }
    });
    return map;
  }, [aggData]);

  const displayOrderById = useMemo(() => {
    const map = {};
    (aggData?.questions || []).forEach((q) => {
      if (q?.questionId != null && q?.displayOrder != null) {
        map[String(q.questionId)] = q.displayOrder;
      }
    });
    return map;
  }, [aggData]);

  // you can keep your existing text maps as a fallback:
  const questionTypeByText = useMemo(() => {
    const map = {};
    (aggData?.questions || []).forEach((q) => {
      if (q?.questionText && q?.questionType) {
        map[q.questionText] = q.questionType;
      }
    });
    return map;
  }, [aggData]);

  const displayOrderByText = useMemo(() => {
    const map = {};
    (aggData?.questions || []).forEach((q) => {
      if (q?.questionText != null && q?.displayOrder != null) {
        map[q.questionText] = q.displayOrder;
      }
    });
    return map;
  }, [aggData]);

  const loadAggregated = useCallback(async () => {
    if (!isValidRange(dateRange)) return;
    setIsLoading(true);
    try {
      const res = await getAggregatedReport(eventId, dateRange);
      if (res?.success) {
        setAggData(res.data);
        if (!res.data?.questions?.length) return;
      } else {
        setAggData(null);
        error("Failed to load aggregated report");
      }
    } catch (e) {
      setAggData(null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, dateRange, success, error]);

  const mapIndividualResponses = useCallback(
    (payload) => {
      const page = Number(payload?.page || 1);
      const limit = Number(payload?.limit || 20);
      const total = Number(payload?.total || 0);
      const responses = payload?.responses || [];

      const toTime = (dt) => (dt ? new Date(dt).getTime() : 0);
      const normId = (idOrObj) =>
        typeof idOrObj === "string"
          ? idOrObj
          : idOrObj?._id || idOrObj?.$oid || idOrObj?.id || "";

      // Prefer questionId (surveyQuestion) for ordering/type
      const getQId = (r) => {
        const qid = normId(r?.surveyQuestion);
        if (qid) return qid;
        // fallback to question text if id not present
        return r?.question ? `text:${r.question}` : "";
      };

      const getOrder = (qid, qText) => {
        if (qid && displayOrderById[qid] != null) return displayOrderById[qid];
        if (qText && displayOrderByText[qText] != null)
          return displayOrderByText[qText];
        return 9999; // unknown -> push to end but don't mis-signal split
      };

      const getType = (qid, qText, rawValue) => {
        if (qid && questionTypeById[qid]) return questionTypeById[qid];
        if (qText && questionTypeByText[qText])
          return questionTypeByText[qText];
        return inferType(rawValue);
      };

      // 1) Group by (event, surveyUser)
      const byUserEvent = new Map();
      for (const r of responses) {
        const evId = normId(r?.event);
        const suId = normId(r?.surveyUser) || String(r?.surveyUserId || "");
        const key = `${evId}|${suId}`;
        if (!byUserEvent.has(key)) byUserEvent.set(key, []);
        byUserEvent.get(key).push(r);
      }

      const items = [];
      const counters = new Map(); // per (event|user) => submission index

      for (const [key, list] of byUserEvent.entries()) {
        // 2) Sort chronologically (stable)
        list.sort((a, b) => {
          const t = toTime(a?.createdAt) - toTime(b?.createdAt);
          if (t !== 0) return t;
          // tie-breaker: surveyResponseId or ObjectId string, to keep deterministic order
          const aId = String(a?.surveyResponseId ?? normId(a?._id) ?? "");
          const bId = String(b?.surveyResponseId ?? normId(b?._id) ?? "");
          return aId.localeCompare(bId);
        });

        // 3) Split sessions when we detect a TRUE restart:
        //    - same question seen again in the current session (repeat answers)
        //    - or order drops back to (or before) the session's first question order
        const sessions = [];
        let current = [];
        let seenQIds = new Set();
        let firstOrderInSession = Infinity;

        const flush = () => {
          if (!current.length) return;
          sessions.push(current);
          current = [];
          seenQIds = new Set();
          firstOrderInSession = Infinity;
        };

        for (const r of list) {
          const qId = getQId(r);
          const qText = r?.question;
          const order = getOrder(qId, qText);

          const isRepeatQuestion = qId && seenQIds.has(qId);
          const isRestartByOrder =
            order <= firstOrderInSession && current.length > 0;

          if (isRepeatQuestion || isRestartByOrder) {
            // Start a new session
            flush();
          }

          current.push(r);
          if (qId) seenQIds.add(qId);
          if (order < firstOrderInSession) firstOrderInSession = order;
        }
        flush();

        // 4) Build submission items
        for (const session of sessions) {
          const first = session[0];
          const evId = normId(first?.event);
          const suId =
            normId(first?.surveyUser) || String(first?.surveyUserId || "");
          const labelKey = `${evId}|${suId}`;

          const emailLike = (
            first?.user ||
            first?.surveyUserEmail ||
            ""
          ).toLowerCase();
          const isAnon = emailLike === "anonymous" || !emailLike;

          const nextIdx = (counters.get(labelKey) || 0) + 1;
          counters.set(labelKey, nextIdx);

          const displayLabel = isAnon
            ? `Anonymous #${nextIdx}`
            : first?.user || first?.surveyUserEmail || `User #${nextIdx}`;

          const answers = session
            .map((r) => {
              const qId = getQId(r);
              const qText = r?.question;
              const qType = getType(qId, qText, r?.response);
              const order = getOrder(qId, qText);

              let value = r?.response;
              if (
                qType === "matrix" &&
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
              ) {
                const grid = {};
                Object.entries(value).forEach(([row, col]) => {
                  grid[row] = { [col]: true };
                });
                value = grid;
              }
              if (
                (qType === "slider" ||
                  qType === "rating" ||
                  qType === "star") &&
                typeof value === "string" &&
                !isNaN(Number(value))
              ) {
                value = Number(value);
              }

              return {
                questionId: qId || qText,
                questionText: qText,
                questionType: qType,
                displayOrder: order,
                value,
                surveyResponseId: r?.surveyResponseId,
                createdAt: r?.createdAt,
              };
            })
            .sort(
              (a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999),
            );

          const submittedAt = session.reduce((max, r) => {
            const t = toTime(r?.createdAt);
            return t > max ? t : max;
          }, 0);

          items.push({
            submissionId: `${labelKey}#${nextIdx}`,
            user: {
              name: displayLabel,
              email: isAnon ? undefined : first?.user || first?.surveyUserEmail,
              anonymous: isAnon,
            },
            submittedAt: submittedAt
              ? new Date(submittedAt).toISOString()
              : null,
            answers,
          });
        }
      }

      // latest-first (optional)
      items.sort((a, b) => toTime(b.submittedAt) - toTime(a.submittedAt));

      return { items, total, page, limit };
    },
    [
      questionTypeById,
      displayOrderById,
      questionTypeByText,
      displayOrderByText,
    ],
  );

  const loadIndividuals = useCallback(
    async (page = 1, limit = indData.limit || 20) => {
      setIsLoading(true);
      try {
        const res = await getIndividualResponses(eventId, { page, limit });
        if (res?.success && res?.data) {
          const mapped = mapIndividualResponses(res.data);
          setIndData(mapped);
          if (!mapped.items.length) return;
        } else {
          setIndData({ items: [], total: 0, page: 1, limit: 20 });
          error("Failed to load individual responses");
        }
      } catch (e) {
        setIndData({ items: [], total: 0, page: 1, limit: 20 });
        error("Network error while loading responses");
      } finally {
        setIsLoading(false);
      }
    },
    [eventId, indData.limit, mapIndividualResponses, success, error],
  );

  useEffect(() => {
    if (view === "aggregated") {
      if (isValidRange(dateRange)) loadAggregated();
    } else {
      loadIndividuals(1, indData.limit);
    }
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, dateRange, eventId]);

  // in ReportPage.jsx – only show the changed handler
  const onViewChange = (v) => {
    save();
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const aggregatedContent = useMemo(() => {
    if (isLoading && !aggData) return <SkeletonLoader />;
    if (!aggData) {
      return (
        <EmptyState
          title="No aggregated data"
          subtitle={
            dateRange.from || dateRange.to
              ? "No data for the applied date range."
              : "Try adjusting the date filters."
          }
          icon="BarChart3"
          big
        />
      );
    }
    return (
      <>
        {/* Move applied chips near filters (right side); we keep here only if you want both */}
        <div className="hidden lg:block" />
        <AggregatedReportView
          primaryColor={PRIMARY}
          totalResponses={aggData.totalResponses}
          surveyInfo={aggData.surveyInfo}
          questions={aggData.questions || []}
          isLoadingCards={false}
          scrollParentRef={scrollParentRef}
        />
      </>
    );
  }, [isLoading, aggData, dateRange, scrollParentRef]);

  const individualContent = useMemo(() => {
    if (isLoading && !indData.items.length) return <SkeletonLoader />;
    return (
      <IndividualReportView
        primaryColor={PRIMARY}
        data={indData}
        onPageChange={(p) => loadIndividuals(p, indData.limit)}
        scrollParentRef={scrollParentRef}
      />
    );
  }, [isLoading, indData, loadIndividuals]);

  useEffect(() => {
    // Give Virtuoso a nudge after first paint & after data loads
    const t = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      scrollParentRef?.current?.dispatchEvent(new Event("scroll"));
    }, 0);
    return () => clearTimeout(t);
  }, [scrollParentRef, view, aggData, indData]);

  const surveyName = aggData?.surveyInfo?.surveyName || "Survey";
  const eventName = aggData?.surveyInfo?.event?.eventName || "—";
  const eventDate = fmtDate(aggData?.surveyInfo?.event?.eventDate);
  const surveyDate = fmtDate(aggData?.surveyInfo?.createdAt);
  const totalResponses = aggData?.totalResponses ?? 0;

  // 🔄 Auto-refresh (live)
  useEffect(() => {
    if (!autoRefreshMs || Number(autoRefreshMs) <= 0) return;
    const id = setInterval(() => {
      if (view === "aggregated") {
        if (isValidRange(dateRange)) loadAggregated();
      } else {
        loadIndividuals(indData.page || 1, indData.limit || 20);
      }
    }, Number(autoRefreshMs));
    return () => clearInterval(id);
  }, [
    autoRefreshMs,
    view,
    dateRange,
    loadAggregated,
    loadIndividuals,
    indData.page,
    indData.limit,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 text-gray-900">
      <div className="z-30 bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Top row: back + title + mode + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <ReportHeader color={PRIMARY} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Responses moved here */}
              <div className="hidden sm:inline-flex  text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">
                {totalResponses}{" "}
                {totalResponses === 1 ? "response" : "responses"}
              </div>
              <ViewToggle
                value={view}
                onChange={onViewChange}
                primaryColor={PRIMARY}
              />
              <ExportMenu view={view} eventId={eventId} dateRange={dateRange} />
            </div>
          </div>

          {/* Meta (left) + Filters & Chips (right) */}
          <div className="mt-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="min-w-0">
              <ReportMetaInfo
                surveyInfo={aggData?.surveyInfo}
                totalResponses={totalResponses}
                surveyName={surveyName}
                eventName={eventName}
                // chips only event/event date/survey date (ReportMetaInfo handles selection)
                dateRange={dateRange}
                showResponses={false}
                showSurveyChip={false}
                overrideEventDate={eventDate}
                overrideSurveyDate={surveyDate}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Independent, bounded scroll area for the active view */}
        <section id="report-scroll" className="relative">
          <div className="p-4">
            {view === "aggregated" ? aggregatedContent : individualContent}
          </div>
        </section>
      </main>
    </div>
  );
}
