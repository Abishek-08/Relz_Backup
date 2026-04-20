import React, { useEffect, useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Plus,
  MinusCircle,
} from "lucide-react";

export default function SortableItem({
  id,
  question,
  onUpdate,
  onDelete = () => {},
  onDuplicate = () => {},
  disableDrag
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const [expanded, setExpanded] = useState(
    question.type === "comment" ? false : true,
  );
  const primary = "#27235c";

  const typeLabel = useMemo(() => {
    switch (question.type) {
      case "comment":
        return "Comment";
      case "checkbox":
        return "Checkbox";
      case "radio":
        return "Radio";
      case "dropdown":
        return "Dropdown";
      case "rating":
        return "Rating Scale";
      case "slider":
        return "Slider";
      case "star":
        return "Star Rating";
      case "matrix":
        return "Matrix";
      default:
        return question.type || "Unknown";
    }
  }, [question.type]);

  const update = (changes) => onUpdate(question.id, changes);

  // Options (checkbox, radio, dropdown)
  const addOption = () =>
    update({ options: [...(question.options || []), ""] });
  const updateOption = (idx, value) => {
    const next = [...(question.options || [])];
    next[idx] = value;
    update({ options: next });
  };
  const removeOption = (idx) => {
    const next = [...(question.options || [])];
    next.splice(idx, 1);
    update({ options: next });
  };

  // Scale labels (anchors)
  const addScaleLabel = () =>
    update({ scaleLabels: [...(question.scaleLabels || []), ""] });
  const updateScaleLabel = (idx, value) => {
    const next = [...(question.scaleLabels || [])];
    next[idx] = value;
    update({ scaleLabels: next });
  };
  const removeScaleLabel = (idx) => {
    const next = [...(question.scaleLabels || [])];
    next.splice(idx, 1);
    update({ scaleLabels: next });
  };

  // Matrix rows
  const addMatrixRow = () =>
    update({ matrixRows: [...(question.matrixRows || []), ""] });
  const updateMatrixRow = (idx, value) => {
    const next = [...(question.matrixRows || [])];
    next[idx] = value;
    update({ matrixRows: next });
  };
  const removeMatrixRow = (idx) => {
    const next = [...(question.matrixRows || [])];
    next.splice(idx, 1);
    update({ matrixRows: next });
  };

  const ensureNumeric = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };
  const minMaxGuard = (minVal, maxVal) => {
    const min = ensureNumeric(minVal, 0);
    const max = ensureNumeric(maxVal, 5);
    if (min > max) return { min: max, max: min };
    return { min, max };
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Required toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={!!question.required}
          onChange={(e) => update({ required: e.target.checked })}
        />
        Required
      </label>

      <button
        type="button"
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => onDuplicate(question)}
        aria-label="Duplicate"
        title="Duplicate"
      >
        <Copy size={18} className="text-gray-600" />
      </button>
      <button
        type="button"
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => onDelete(question.id)}
        aria-label="Delete"
        title="Delete"
      >
        <Trash2 size={18} className="text-red-600" />
      </button>
      <button
        type="button"
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse" : "Expand"}
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? (
          <ChevronDown size={18} className="text-gray-600" />
        ) : (
          <ChevronRight size={18} className="text-gray-600" />
        )}
      </button>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "mb-3 rounded-lg border bg-white shadow-sm transition",
        isDragging ? "ring-2 ring-offset-2" : "hover:shadow-md",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3 min-w-0">
          {/* Drag handle */}
      {!disableDrag && (<button
        type="button"
        className="p-2 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag"
        title="Drag"
      >
        <GripVertical size={18} className="text-gray-600" />
      </button>
      )}
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded text-white text-xs font-semibold"
            style={{ backgroundColor: primary }}
            title="Display order"
          >
            {question.displayOrder ?? "-"}
          </span>
         
{/* Header left side (order badge + title input) */}
<div className="min-w-0">
  <div className="text-sm text-gray-500">{typeLabel}</div>
  <input
    type="text"
    value={question.text || ""}
    onChange={(e) => update({ text: e.target.value })}
    placeholder="Question text"
    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2"
  />
  {question.dupWarning && (
    <p className="mt-1 text-xs text-red-600">
      Same question with this type already exists.
    </p>
  )}
</div>

        </div>
        {headerActions}
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-4 py-4 space-y-4">
          {/* Options for checkbox/radio/dropdown */}
          {["checkbox", "radio", "dropdown"].includes(question.type) && (
            <OptionsEditor
              label={`${typeLabel} Options`}
              options={question.options || []}
              addOption={addOption}
              updateOption={updateOption}
              removeOption={removeOption}
              primary={primary}
            />
          )}

          {/* Rating/Slider/Star */}
          {["rating", "slider", "star"].includes(question.type) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Minimum
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2"
                  value={question.scaleMin ?? 1}
                  min={0}
                  onChange={(e) => {
                    const { min, max } = minMaxGuard(
                      e.target.value,
                      question.scaleMax ?? 5,
                    );
                    update({ scaleMin: min, scaleMax: max });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Maximum
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2"
                  value={question.scaleMax ?? 5}
                  min={1}
                  onChange={(e) => {
                    const { min, max } = minMaxGuard(
                      question.scaleMin ?? 1,
                      e.target.value,
                    );
                    update({ scaleMin: min, scaleMax: max });
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <ScaleLabelsEditor
                  labels={question.scaleLabels || []}
                  addLabel={addScaleLabel}
                  updateLabel={updateScaleLabel}
                  removeLabel={removeScaleLabel}
                  primary={primary}
                />
              </div>
            </div>
          )}

          {/* Matrix (rows + scale anchors for columns) */}
          {question.type === "matrix" && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-600">
                    Rows (questions)
                  </label>
                  <button
                    type="button"
                    onClick={addMatrixRow}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border hover:bg-gray-50"
                    style={{ borderColor: "#e5e7eb", color: primary }}
                  >
                    <Plus size={16} />
                    Add row
                  </button>
                </div>
                {(question.matrixRows || []).length === 0 && (
                  <p className="text-xs text-gray-500">
                    Add row labels (e.g., “Registration”, “Agenda”,
                    “Facilities”).
                  </p>
                )}
                <div className="space-y-2">
                  {(question.matrixRows || []).map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row}
                        onChange={(e) => updateMatrixRow(idx, e.target.value)}
                        placeholder={`Row ${idx + 1}`}
                        className="flex-1 border rounded-md px-3 py-2 focus:ring-2"
                      />
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => removeMatrixRow(idx)}
                        aria-label="Remove row"
                        title="Remove row"
                      >
                        <MinusCircle size={18} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <ScaleLabelsEditor
                  label="Column captions (optional)"
                  labels={question.scaleLabels || []}
                  addLabel={addScaleLabel}
                  updateLabel={updateScaleLabel}
                  removeLabel={removeScaleLabel}
                  primary={primary}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function toKeyed(arr = []) { return arr.map((t) => ({ id: crypto.randomUUID(), text: t })); }
function fromKeyed(list = []) { return list.map((x) => x.text); }

function OptionsEditor({ options, onChange }) {
  const [items, setItems] = useState(() => toKeyed(options || []));
  useEffect(() => {
    if ((options || []).length !== items.length) setItems(toKeyed(options || []));
    else setItems((prev) => prev.map((it, i) => ({ ...it, text: options[i] })));
  }, [options]);

  const commit = (next) => onChange(fromKeyed(next));
  const add = () => { const next = [...items, { id: crypto.randomUUID(), text: "" }]; setItems(next); commit(next); };
  const update = (i, v) => { const next = [...items]; next[i] = { ...next[i], text: v }; setItems(next); commit(next); };
  const remove = (i) => { if (items.length <= 1) return; const next = items.slice(0, i).concat(items.slice(i + 1)); setItems(next); commit(next); };
  const move = (i, dir) => { const j = i + dir; if (j < 0 || j >= items.length) return; const next = [...items]; const [it] = next.splice(i, 1); next.splice(j, 0, it); setItems(next); commit(next); };

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it.id} className="group flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#27235c] text-xs font-semibold text-white">
            {i + 1}
          </span>
          <input
            value={it.text}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 border-0 focus:outline-none text-sm"
            placeholder={`Option ${i + 1}`}
          />
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => move(i, -1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer" aria-label="Move up">↑</button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer" aria-label="Move down">↓</button>
            <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-gray-100 text-red-600 cursor-pointer" aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer hover:bg-[#27235c] hover:text-white">
        + Add option
      </button>
    </div>
  );
}

function ScaleLabelsEditor({ labels, onChange }) {
  const [items, setItems] = useState(() => toKeyed(labels || []));
  useEffect(() => {
    if ((labels || []).length !== items.length) setItems(toKeyed(labels || []));
    else setItems((prev) => prev.map((it, i) => ({ ...it, text: labels[i] })));
  }, [labels]);

  const commit = (next) => onChange(fromKeyed(next));
  const add = () => { const next = [...items, { id: crypto.randomUUID(), text: "" }]; setItems(next); commit(next); };
  const update = (i, v) => { const next = [...items]; next[i] = { ...next[i], text: v }; setItems(next); commit(next); };
  const remove = (i) => { if (items.length <= 1) return; const next = items.slice(0, i).concat(items.slice(i + 1)); setItems(next); commit(next); };
  const move = (i, dir) => { const j = i + dir; if (j < 0 || j >= items.length) return; const next = [...items]; const [it] = next.splice(i, 1); next.splice(j, 0, it); setItems(next); commit(next); };

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={it.id} className="group flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#27235c] text-xs font-semibold text-white">
            {i + 1}
          </span>
          <input
            value={it.text}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 border-0 focus:outline-none text-sm"
            placeholder={`Label ${i + 1}`}
          />
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => move(i, -1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer" aria-label="Move up">↑</button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer" aria-label="Move down">↓</button>
            <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-gray-100 text-red-600 cursor-pointer" aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 text-sm text-[#27235c] cursor-pointer border px-2 py-1 rounded">
        + Add label
      </button>
    </div>
  );
}
