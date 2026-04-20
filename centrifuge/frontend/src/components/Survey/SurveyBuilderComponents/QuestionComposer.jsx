import React, { useMemo, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  ChevronUp as UpIcon,
  ChevronDown as DownIcon,
  MessageSquare,
  CheckSquare,
  Dot,
  ListFilter,
  Sliders,
  Type,
  Star,
  Table,
  CircleDot,
  Award,
  Scale3D,
  GitCommit,
  SlidersHorizontal,
} from "lucide-react";
import EditableList from "./EditableList";
import { AnimatePresence, motion } from "framer-motion";
import InlineFormatToolbar from "./InlineFormatToolbar";
import InlineRichInput from "./InlineRichInput";
import { wrapSelectionWithTag, insertLineBreakAtCaret } from "../../../utils/richText";

const TYPES = [
  { v: "comment", label: "Comment", icon: MessageSquare },
  { v: "checkbox", label: "Checkbox", icon: CheckSquare },
  { v: "radio", label: "Multiple choice", icon: CircleDot },
  { v: "dropdown", label: "Dropdown", icon: ListFilter },
  { v: "slider", label: "Slider", icon: GitCommit },
  { v: "rating", label: "Rating", icon: SlidersHorizontal },
  { v: "star", label: "Star rating", icon: Star },
  { v: "matrix", label: "Matrix", icon: Table },
];

const MIN_OPTS = Array.from({ length: 10 }, (_, i) => i);
const MAX_OPTS = Array.from({ length: 10 }, (_, i) => i + 1);

const trimTail = (arr = []) => {
  const a = Array.isArray(arr) ? [...arr] : [];
  while (a.length > 1 && !String(a[a.length - 1] ?? '').trim()) a.pop();
  return a;
};

const uniq = (arr = []) => {
  const seen = new Set();
  const out = [];
  arr.forEach((v) => {
    const t = (v || "").trim();
    if (!t) return;
    const k = t.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      out.push(t);
    }
  });
  return out;
};

export default function QuestionComposer({ onSubmit, error }) {
  const [open, setOpen] = useState(true);

  const [q, setQ] = useState({
    text: "",
    type: "comment",
    options: ["", "", ""],
    matrixRows: [""],
    scaleLabels: [],
    scaleMin: 0,
    scaleMax: 5,
    required: false,
  });

  function onTypeChange(newType) {
    setQ((prev) => {
      const base = { ...prev, type: newType };
      if (["checkbox", "radio", "dropdown"].includes(newType)) {
        return {
          ...base,
          options: prev.options?.length ? prev.options : ["", "", ""],
          matrixRows: [],
          scaleLabels: [],
          scaleMin: 0,
          scaleMax: 5,
        };
      }
      if (newType === "matrix") {
        return {
          ...base,
          options: [],
          matrixRows: prev.matrixRows?.length ? prev.matrixRows : [""],
          scaleLabels: prev.scaleLabels?.length ? prev.scaleLabels : [""],
          scaleMin: 1,
          scaleMax: Math.max(1,(prev.scaleLabels || [""]).filter(Boolean).length),
        };
      }
      if (newType === "star") {
        return {
          ...base,
          options: [],
          matrixRows: [],
          scaleLabels: prev.scaleLabels || [],
          scaleMin: 0,
          scaleMax: Math.min(10, Math.max(1, prev.scaleMax || 5)),
        };
      }
      if (["rating", "slider"].includes(newType)) {
        return {
          ...base,
          options: [],
          matrixRows: [],
          scaleLabels: prev.scaleLabels || [],
          scaleMin: 0,
          scaleMax: 5,
        };
      }
      return {
        ...base,
        options: [],
        matrixRows: [],
        scaleLabels: [],
        scaleMin: 0,
        scaleMax: 5,
      };
    });
  }

  const points = Number(q.scaleMax) - Number(q.scaleMin) + 1;

  function seedForType(type) {
    if (["checkbox", "radio", "dropdown"].includes(type))
      return { text: "", type, required: false, options: ["", "", ""], matrixRows: [], scaleLabels: [], scaleMin: 0, scaleMax: 5, starWeights: [] };
    if (type === "matrix")
      return { text: "", type, required: false, options: [], matrixRows: [""], scaleLabels: [""], scaleMin: 1, scaleMax: 1, starWeights: [] };
    if (type === "star")
      return { text: "", type, required: false, options: [], matrixRows: [], scaleLabels: [], scaleMin: 0, scaleMax: 5, starWeights: [] };
    return { text: "", type, required: false, options: [], matrixRows: [], scaleLabels: [], scaleMin: 0, scaleMax: 5, starWeights: [] };
  }

  const canSubmit = useMemo(() => {
    const textOK = q.text.trim().length > 0;
    if (!textOK) return false;
    if (["checkbox", "radio", "dropdown"].includes(q.type))
      return uniq(q.options).length > 0;
    if (q.type === "matrix")
      return uniq(q.matrixRows).length > 0 && uniq(q.scaleLabels).length > 0;
    const pts = Number(q.scaleMax) - Number(q.scaleMin) + 1;
    if (["rating", "slider", "star"].includes(q.type)) {
      if (!(Number(q.scaleMin) < Number(q.scaleMax))) return false;
      if (uniq(q.scaleLabels).length > Math.max(1, pts)) return false;
    }
    return true;
  }, [q]);

  const submit = () => {
    if (!canSubmit) {
      error?.("Please complete required fields and fix validation errors.");
      return;
    }
    const pts = Math.max(1, Number(q.scaleMax) - Number(q.scaleMin) + 1);
    const submittedOptions =
      ["checkbox", "radio", "dropdown"].includes(q.type)
        ? trimTail(q.options).map(v => String(v ?? ''))
        : [];
    const submittedMatrixRows =
      q.type === "matrix" ? trimTail(q.matrixRows).map(v => String(v ?? '')) : [];
    const submittedMatrixCols =
      q.type === "matrix" ? trimTail(q.scaleLabels).map(v => String(v ?? '')) : [];
    const submittedScaleLabels =
      q.type === "slider"
        ? trimTail(q.scaleLabels).slice(0, pts).map(v => String(v ?? ''))
        : (q.type === "matrix" ? submittedMatrixCols : []);

    onSubmit?.({
      text: q.text, // keep rich text + newlines; renderer will handle <br>
      type: q.type,
      required: !!q.required,
      options: submittedOptions,
      matrixRows: submittedMatrixRows,
      scaleLabels: submittedScaleLabels,
      scaleMin: Number(q.scaleMin ?? 0),
      scaleMax: q.type === "matrix" ? Math.max(1, submittedMatrixCols.length) : Number(q.scaleMax ?? 5),
      starWeights: q.type === "star" ? q.starWeights || [] : [],
    });

    setQ(seedForType(q.type));
  };

  const qInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm text-[#274c77] font-medium">Create Question</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="create-question"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4">
              {/* Question (contentEditable) + toolbar ABOVE */}
<div className="space-y-2">
  <label className="block text-xs text-gray-500">Question</label>
  <div className="mb-1">
    <InlineFormatToolbar
      inputRef={qInputRef}
      value={q.text}
      onChange={(nv) => setQ((p) => ({ ...p, text: nv }))}
    />
  </div>
  <InlineRichInput
    value={q.text}
    onChange={(nv) => setQ((p) => ({ ...p, text: nv }))}
    placeholder="Type the question text"
    minHeight={56}
    maxHeight={160}
    className="w-full rounded bg-white"
    style={{ borderColor: "#e5e7eb" }}
    refHook={qInputRef}
  />
</div>

              {/* Type + Required */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Type</span>
                <div className="flex flex-wrap gap-1">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() => onTypeChange(t.v)}
                        className={`cursor-pointer px-3 py-1 rounded-full text-xs border inline-flex items-center gap-1 ${q.type === t.v ? "bg-[#274c77] text-white" : "hover:bg-gray-100"}`}
                        title={t.label}
                      >
                        <Icon size={14} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-700 ml-auto">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => setQ((p) => ({ ...p, required: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  Required
                </label>
              </div>

              {/* Options */}
              {["checkbox", "radio", "dropdown"].includes(q.type) && (
                <EditableList
                  title="Options"
                  value={q.options}
                  onChange={(v) => setQ((p) => ({ ...p, options: v }))}
                  placeholder="Option"
                  seedCount={3}
                  autoEnsureEmptyTail
                  enableInlineFormatting
                />
              )}

              {/* Rating / Slider / Star */}
              {["rating", "slider", "star"].includes(q.type) && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <select
                        value={q.scaleMin ?? 0}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = Number(q.scaleMax ?? 1);
                          if (min >= max) {
                            return;
                          }
                          const pts = max - min + 1;
                          setQ((p) => ({
                            ...p,
                            scaleMin: min,
                            scaleLabels: (p.scaleLabels || []).slice(0, Math.max(1, pts)),
                          }));
                        }}
                        className="border rounded px-3 py-2 w-full"
                      >
                        {MIN_OPTS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{q.type === "star" ? "Max (1–10)" : "Max"}</label>
                      <select
                        value={q.type === "star" ? Math.min(10, Number(q.scaleMax ?? 5)) : (q.scaleMax ?? 1)}
                        onChange={(e) => {
                          const max = Number(e.target.value);
                          const min = Number(q.scaleMin ?? 0);
                          if (q.type === "star" && (max < 1 || max > 10)) {
                            return;
                          }
                          if (min >= max) {
                            return;
                          }
                          const pts = max - min + 1;
                          setQ((p) => ({
                            ...p,
                            scaleMax: max,
                            scaleLabels: (p.scaleLabels || []).slice(0, Math.max(1, pts)),
                          }));
                        }}
                        className="border rounded px-3 py-2 w-full"
                      >
                        {MAX_OPTS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div />
                  </div>
                </>
              )}

              {/* Slider labels */}
              {q.type === "slider" && (
                <>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <input
                      type="checkbox"
                      checked={(q.scaleLabels || []).length > 0}
                      onChange={(e) => {
                        setQ((p) => ({
                          ...p,
                          scaleLabels: e.target.checked ? (p.scaleLabels?.length ? p.scaleLabels : [""]) : [],
                        }));
                      }}
                    />
                    Add scale labels
                  </label>

                  {(q.scaleLabels || []).length > 0 && (
                    <EditableList
                      title="Scale labels"
                      value={q.scaleLabels}
                      onChange={(v) => {
                        const pts = Math.max(1, q.scaleMax - q.scaleMin + 1);
                        const trimmed = v.slice(0, pts);
                        setQ((p) => ({ ...p, scaleLabels: trimmed }));
                      }}
                      placeholder="Label"
                      seedCount={1}
                      showAddButton={true}
                      addButtonLabel="Add label"
                      maxItems={Math.max(1, q.scaleMax - q.scaleMin + 1)}
                      autoEnsureEmptyTail
                    />
                  )}
                </>
              )}

              {/* Matrix */}
{q.type === "matrix" && (
  <div className="grid md:grid-cols-2 gap-6">
    <EditableList
      title="Rows"
      value={q.matrixRows}
      onChange={(v) => setQ((p) => ({ ...p, matrixRows: v }))}
      placeholder="Row"
      autoEnsureEmptyTail
      enableInlineFormatting
    />
    <EditableList
      title="Columns"
      value={q.scaleLabels}
      onChange={(cols) =>
        setQ((p) => ({
          ...p,
          scaleLabels: cols,
          scaleMin: 1,
          scaleMax: Math.max(
            1,
            (cols || []).filter(Boolean).length,
          ),
        }))
      }
      placeholder="Column"
      autoEnsureEmptyTail
      enableInlineFormatting
    />
  </div>
)}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={submit}
                  className="cursor-pointer bg-[#274c77] text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canSubmit}
                >
                  + Add question
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}