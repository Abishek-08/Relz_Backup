import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAggregatedReport,
  getIndividualResponses,
} from "../../../../services/Services.jsx";

import useScrollRestoration from "../hooks/useScrollRestoration.jsx";

import ReportHeader from "../components/ReportHeader.jsx";
import ReportMetaInfo from "../components/ReportMetaInfo.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ViewToggle from "../components/ViewToggle.jsx";
import ExportMenu from "../components/ExportMenu.jsx";
import AggregatedReportView from "../components/AggregatedReportView.jsx";
import IndividualReportView from "../components/IndividualReportView.jsx";
import SkeletonLoader from "../components/SkeletonLoader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import AppliedFilterChips from "../components/AppliedFilterChips.jsx";

import { useToast } from "../../../../utils/useToast";
import { ArrowLeft } from "lucide-react";
import { fmtDate } from "../utils/datetime.jsx";
import { decryptSession } from "../../../../utils/SessionCrypto.jsx";
import Navbar from "../../../Navbar/Navbar.jsx";

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

export default function ReportPage() {
  // const { eventId } = useParams();
  const encrypted = localStorage.getItem("eventObjId");
  const eventId = encrypted ? decryptSession(encrypted) : null;

  const navigate = useNavigate();
  const { success, error } = useToast();

  const [view, setView] = useState("aggregated"); // 'aggregated' | 'individual'
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

  // Prevent header flicker — simple sticky without animations
  useEffect(() => {
    document.body.classList.add("overflow-x-hidden"); // avoid horizontal drift on mobile
    return () => document.body.classList.remove("overflow-x-hidden");
  }, []);

  // Build maps from aggregated for Individual ordering
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

  const onDateChange = (next) => {
    setDateRange(next);
    if (!isValidRange(next))
      setDateError('Invalid date range. "To" must be on/after "From".');
    else setDateError("");
  };

  const loadAggregated = useCallback(async () => {
    if (!isValidRange(dateRange)) return;
    setIsLoading(true);
    try {
      const res = await getAggregatedReport(eventId, dateRange);
      if (res?.success) {
        setAggData(res.data);
        if (!res.data?.questions?.length)
          success("No questions matched the applied date range");
      } else {
        setAggData(null);
        error("Failed to load aggregated report");
      }
    } catch (e) {
      setAggData(null);
      error("Network error while loading aggregated data");
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

      const map = new Map();
      for (const r of responses) {
        const user = r?.user || "Anonymous";
        const questionText = r?.question;
        const rawValue = r?.response;

        const qType = questionTypeByText[questionText] || inferType(rawValue);
        const order = displayOrderByText[questionText] ?? 9999;

        let value = rawValue;
        if (
          qType === "matrix" &&
          rawValue &&
          typeof rawValue === "object" &&
          !Array.isArray(rawValue)
        ) {
          const grid = {};
          Object.entries(rawValue).forEach(([row, col]) => {
            grid[row] = { [col]: true };
          });
          value = grid;
        }
        if (
          (qType === "slider" || qType === "rating" || qType === "star") &&
          typeof value === "string" &&
          !isNaN(Number(value))
        ) {
          value = Number(value);
        }

        if (!map.has(user)) {
          map.set(user, {
            user: { email: user, anonymous: user === "Anonymous" },
            submittedAt: null,
            answers: [],
          });
        }
        map.get(user).answers.push({
          questionId: questionText,
          questionText,
          questionType: qType,
          displayOrder: order,
          value,
        });
      }

      // sort answers by displayOrder
      const items = Array.from(map.values()).map((sub) => ({
        ...sub,
        answers: (sub.answers || []).sort(
          (a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999),
        ),
      }));

      return { items, total, page, limit };
    },
    [questionTypeByText, displayOrderByText],
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
        />
      </>
    );
  }, [isLoading, aggData, dateRange]);

  const individualContent = useMemo(() => {
    if (isLoading && !indData.items.length) return <SkeletonLoader />;
    return (
      <IndividualReportView
        primaryColor={PRIMARY}
        data={indData}
        onPageChange={(p) => loadIndividuals(p, indData.limit)}
      />
    );
  }, [isLoading, indData, loadIndividuals]);

  const surveyName = aggData?.surveyInfo?.surveyName || "Survey";
  const eventName = aggData?.surveyInfo?.event?.eventName || "—";
  const eventDate = fmtDate(aggData?.surveyInfo?.event?.eventDate);
  const surveyDate = fmtDate(aggData?.surveyInfo?.createdAt);
  const totalResponses = aggData?.totalResponses ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 pt-16 text-gray-900">
      <Navbar />
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Top row: back + title + mode + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 rounded-md bg-[#27235c] text-white cursor-pointer hover:opacity-90 focus:ring-2 focus:ring-indigo-200 transition shrink-0"
                title="Back to event"
              >
                <ArrowLeft size={16} className="inline-flex" /> Back to Events
              </button>
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

            <div className="flex flex-col items-end gap-2 w-full lg:w-auto">
              {/* Filters rightmost */}
              <div className="w-full lg:w-auto">
                <FilterBar
                  value={dateRange}
                  onChange={onDateChange}
                  primaryColor={PRIMARY}
                  disabled={view !== "aggregated"}
                  helperText={
                    view !== "aggregated"
                      ? "Date filters apply only to aggregated reports"
                      : dateError || ""
                  }
                  error={!!dateError}
                />
              </div>
              {/* Applied filter chips move near filter (right) */}
              <AppliedFilterChips
                range={dateRange}
                onClear={(key) => setDateRange((r) => ({ ...r, [key]: "" }))}
                align="right"
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
