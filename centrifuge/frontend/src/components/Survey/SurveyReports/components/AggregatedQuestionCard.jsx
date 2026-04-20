import React, { useMemo, useState } from "react";
import ChartRenderer from "./ChartRenderer.jsx";
import MatrixGrid from "./MatrixGrid.jsx";
import CommentDrawer from "./CommentDrawer.jsx";
import {
  Table,
  ChevronDown,
  X,
  Copy,
  Check,
  FileDown,
  Eye,
  EyeOff,
  Dot,
} from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useToast } from "../../../../utils/useToast";
import { colorForLabel } from "../utils/colors";
import {
  MessageSquare,
  CheckSquare,
  CircleDot,
  ListFilter,
  GitCommit,
  SlidersHorizontal,
  Star,
  Table as TableIcon,
} from "lucide-react";
import { toDisplayHTML, stripInlineTags, sanitizeInlineHTML } from "../../../../utils/richText.jsx";

const TYPE_ICONS = {
  comment: MessageSquare,
  checkbox: CheckSquare,
  radio: CircleDot,
  dropdown: ListFilter,
  slider: GitCommit,
  rating: SlidersHorizontal,
  star: Star,
  matrix: TableIcon,
};
const TYPE_HUMAN = {
  radio: "Multiple-choice",
  rating: "Scale rating",
};

const defaultVariantByType = {
  checkbox: "donut",
  radio: "bar",
  dropdown: "bar",
  rating: "hbar",
  star: "hbar",
  slider: "hbar",
  matrix: "matrix",
  comment: "comments",
};

const VARIANT_OPTIONS = [
  { key: "bar", label: "Bar" },
  { key: "hbar", label: "Horizontal Bar" },
  { key: "pie", label: "Pie" },
  { key: "donut", label: "Donut" },
  { key: "line", label: "Line" },
];


function rowsToCsv(rows) {
   const header = ["Option", "Count", "Percent"];
   const body = rows.map((r) => [stripInlineTags(r.label), r.value, `${r.pct}%`]);
   return [header, ...body].map((arr) => arr.join(",")).join("\n");
 }

export default React.memo(function AggregatedQuestionCard({
  index,
  question,
  primaryColor = "#27235c",
  totalResponses = 0,
}) {
  const { success, error } = useToast();
  const [showTable, setShowTable] = useState(false);
  const { questionText, questionType, report } = question || {};
  const [variant, setVariant] = useState(
    defaultVariantByType[questionType] || "bar",
  );
  const [variantMenuOpen, setVariantMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hideZeros, setHideZeros] = useState(true);
  const [hiddenKeys, setHiddenKeys] = useState(() => new Set());
  const [valueMode, setValueMode] = useState("percent");

  const Icon = TYPE_ICONS[questionType] || CircleDot;
  const isMatrix = questionType === "matrix";
  const isComment = questionType === "comment";
  const isCircle = variant === "pie" || variant === "donut";

  const distEntries = useMemo(() => {
    const d = report?.distribution || {};
    const total = Object.values(d).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(d).map(([label, value]) => ({
      label,
      value,
      pct: ((value / total) * 100).toFixed(1),
    }));
  }, [report]);

  const dominant = useMemo(() => {
    if (!distEntries.length) return null;
    const max = distEntries.reduce(
      (acc, cur) => (Number(cur.pct) > Number(acc.pct) ? cur : acc),
      distEntries[0],
    );
    return max;
  }, [distEntries]);

  const tableRows = useMemo(() => {
    return distEntries.filter((r) => (hideZeros ? Number(r.pct) > 0 : true));
  }, [distEntries, hideZeros]);

  const copyRawData = async () => {
    try {
      const text = rowsToCsv(tableRows);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      success("Raw data copied");
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      error("Copy failed");
    }
  };

  const exportRawDataCsv = () => {
    try {
      const blob = new Blob([rowsToCsv(tableRows)], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeTitle = (questionText || "question")
        .replace(/[^\w\d]+/g, "-")
        .toLowerCase();
      a.href = url;
      a.download = `raw-${safeTitle}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      success("CSV exported");
    } catch {
      error("CSV export failed");
    }
  };

  const toggleLegend = (key) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const resetLegend = () => setHiddenKeys(new Set());

  const zerosBtnLabel = hideZeros ? "Show zeros" : "Hide zeros";
  const ZerosIcon = hideZeros ? Eye : EyeOff;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-gray-600">
              Q{index} · {TYPE_HUMAN[questionType] || questionType}
            </div>
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-gray-700" />
              <h3 className="text-gray-900 font-semibold leading-snug">
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInlineHTML(questionText || ""),
                  }}
                />
              </h3>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {totalResponses} {totalResponses === 1 ? "response" : "responses"}
              {dominant && Number(dominant.pct) > 0 ? (
                <span className="ml-2">
                  • <span className="font-medium">{dominant.pct}%</span>{" "}
                  selected{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: toDisplayHTML(dominant.label || ""),
                    }}
                  />
                </span>
              ) : null}
            </div>
          </div>

          {!isComment && !isMatrix && (
            <div className="relative">
              <button
                onClick={() => setVariantMenuOpen((s) => !s)}
                className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
              >
                {/* small colored dot for current selection */}
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "#27235c" }}
                />
                {
                  {
                    bar: "Bar",
                    hbar: "Horizontal Bar",
                    pie: "Pie",
                    donut: "Donut",
                    line: "Line",
                  }[variant]
                }
                <ChevronDown size={14} />
              </button>
              {variantMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow border rounded-md z-10">
                  {VARIANT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setVariant(opt.key);
                        setVariantMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2 ${opt.key === variant ? "font-medium" : ""}`}
                    >
                      {/* show a dot on selected */}
                      {opt.key === variant ? (
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: "#27235c" }}
                        />
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-transparent border" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {isMatrix ? (
          <MatrixGrid matrix={report?.matrix || {}} />
        ) : isComment ? (
          <CommentDrawer comments={report?.comments || []} />
        ) : (
          <>
            {/* Chart + Legend separated */}
            {isCircle ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="h-[300px]">
                  <ChartRenderer
                    questionType={questionType}
                    report={report}
                    variant={variant}
                    hideZeros={hideZeros}
                    hiddenKeys={hiddenKeys}
                    valueMode={valueMode}
                  />
                </div>
                <div className="border rounded-md p-2 h-[300px] overflow-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-800">
                      Legend
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Counts/Percent toggle */}
                      <div className="inline-flex bg-gray-100 rounded p-0.5">
                        {["count", "percent"].map((m) => {
                          const active = valueMode === m;
                          return (
                            <button
                              key={m}
                              onClick={() => setValueMode(m)}
                              className={`cursor-pointer text-xs px-2 py-0.5 rounded ${active ? "bg-[#27235c] text-white" : "text-gray-700 hover:text-gray-900"}`}
                            >
                              {m === "count" ? "Counts" : "%"}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setHideZeros((s) => !s)}
                        className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
                      >
                        <ZerosIcon size={14} /> {zerosBtnLabel}
                      </button>
                      <button
                        onClick={resetLegend}
                        className="cursor-pointer text-xs px-2 py-1 border rounded-md bg-white text-gray-800 hover:bg-gray-50"
                        title="Reset legend"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {distEntries
                      .filter((r) => (hideZeros ? Number(r.pct) > 0 : true))
                      .map((r) => {
                        const isHidden = hiddenKeys.has(r.label);
                        const color = colorForLabel(r.label);
                        return (
                          <button
                            key={r.label}
                            onClick={() => toggleLegend(r.label)}
                            className={`w-full text-left text-xs px-2 py-1 rounded-md border flex items-center gap-2 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition ${isHidden ? "opacity-60" : ""}`}
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-sm"
                              style={{ background: color }}
                            />
                            <span
                              className="flex-1 truncate"
                              dangerouslySetInnerHTML={{
                                __html: toDisplayHTML(r.label || ""),
                              }}
                            />
                            <span className="text-gray-800 font-medium">
                              {valueMode === "count" ? r.value : `${r.pct}%`}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[240px]">
                  <ChartRenderer
                    questionType={questionType}
                    report={report}
                    variant={variant}
                    hideZeros={hideZeros}
                    hiddenKeys={hiddenKeys}
                    valueMode={valueMode}
                  />
                </div>
                <div className="border rounded-md p-2 h-auto max-h-[96px] overflow-x-auto">
                  <div className="flex items-center gap-2">
                    {/* Counts/Percent pill */}
                    <div className="inline-flex bg-gray-100 rounded p-0.5">
                      {["count", "percent"].map((m) => {
                        const active = valueMode === m;
                        return (
                          <button
                            key={m}
                            onClick={() => setValueMode(m)}
                            className={`cursor-pointer text-xs px-2 py-0.5 rounded ${active ? "bg-[#27235c] text-white" : "text-gray-700 hover:text-gray-900"}`}
                          >
                            {m === "count" ? "Counts" : "%"}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setHideZeros((s) => !s)}
                      className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
                    >
                      <ZerosIcon size={14} /> {zerosBtnLabel}
                    </button>
                    <button
                      onClick={resetLegend}
                      className="cursor-pointer text-xs px-2 py-1 border rounded-md bg-white text-gray-800 hover:bg-gray-50"
                      title="Reset legend"
                    >
                      Reset
                    </button>

                    <div className="flex items-center gap-2">
                      {distEntries
                        .filter((r) => (hideZeros ? Number(r.pct) > 0 : true))
                        .map((r) => {
                          const isHidden = hiddenKeys.has(r.label);
                          const color = colorForLabel(r.label);
                          return (
                            <button
                              key={r.label}
                              onClick={() => toggleLegend(r.label)}
                              className={`text-xs px-2 py-1 rounded-md border flex items-center gap-2 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition ${isHidden ? "opacity-60" : ""}`}
                            >
                              <span
                                className="inline-block w-3 h-3 rounded-sm"
                                style={{ background: color }}
                              />
                              <span className="whitespace-nowrap">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: toDisplayHTML(r.label || ""),
                                  }}
                                />
                                <span className="text-gray-800 font-medium">
                                  (
                                  {valueMode === "count"
                                    ? r.value
                                    : `${r.pct}%`}
                                  )
                                </span>
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            {tableRows.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTable(true)}
                  className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <Table size={14} /> Raw data
                </button>
                <button
                  onClick={copyRawData}
                  className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={exportRawDataCsv}
                  className="text-xs px-2 py-1 border rounded-md bg-white text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <FileDown size={14} /> CSV
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Raw data drawer */}
      {showTable && (
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      )}
      {showTable && !isMatrix && !isComment && (
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-0 sm:mx-0 rounded-t-xl bg-white border-t shadow-xl overflow-hidden">
            {/* Drawer body uses flex column so the list area can scroll */}
            <div className="flex flex-col max-h-[60vh] sm:max-h-[65vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-sm font-medium text-gray-800">
                  Raw data
                </div>
                <button
                  onClick={() => setShowTable(false)}
                  className="text-gray-600 text-sm cursor-pointer hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="min-h-0 overflow-auto">
                <div className="min-w-full text-sm">
                  <div className="grid grid-cols-3 bg-gray-50 border-b text-xs sticky top-0">
                    <div className="px-3 py-2 border-r font-medium">Option</div>
                    <div className="px-3 py-2 border-r font-medium">Count</div>
                    <div className="px-3 py-2 font-medium">Percent</div>
                  </div>

                  {tableRows.length > 12 ? (
                    <div className="h-[48vh] sm:h-[52vh]">
                      <Virtuoso
                        style={{ height: "100%" }}
                        useWindowScroll={false}
                        totalCount={tableRows.length}
                        itemContent={(index) => {
                          const r = tableRows[index];
                          return (
                            <div className="grid grid-cols-3 odd:bg-white even:bg-gray-50 border-b">
                              <div className="px-3 py-2 border-r">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeInlineHTML(r?.label || ""),
                                  }}
                                />
                              </div>
                              <div className="px-3 py-2 border-r">
                                {r?.value}
                              </div>
                              <div className="px-3 py-2">{r?.pct}%</div>
                            </div>
                          );
                        }}
                        increaseViewportBy={200}
                      />
                    </div>
                  ) : (
                    <div className="max-h-[48vh] sm:max-h-[52vh] overflow-auto">
                      {tableRows.map((r) => (
                        <div
                          key={r.label}
                          className="grid grid-cols-3 odd:bg-white even:bg-gray-50 border-b"
                        >
                          <div className="px-3 py-2 border-r">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: toDisplayHTML(r?.label || ""),
                              }}
                            />
                          </div>
                          <div className="px-3 py-2 border-r">{r?.value}</div>
                          <div className="px-3 py-2">{r?.pct}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
