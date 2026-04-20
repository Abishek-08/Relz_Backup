import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  Dot,
  ListFilter,
  Sliders,
  Type,
  Star,
  Table,
  GitCommit,
  SlidersHorizontal,
  CircleDot,
} from "lucide-react";
import { sanitizeInlineHTML, stripInlineTags, toDisplayHTML } from "../../../utils/richText";

const TYPE_META = {
  comment: { label: "Comment", icon: MessageSquare },
  checkbox: { label: "Checkbox", icon: CheckSquare },
  radio: { label: "Multiple choice", icon: CircleDot },
  dropdown: { label: "Dropdown", icon: ListFilter },
  slider: { label: "Slider", icon: GitCommit },
  rating: { label: "Rating", icon: SlidersHorizontal },
  star: { label: "Star rating", icon: Star },
  matrix: { label: "Matrix", icon: Table },
};

export default function SortableItem({
  id,
  question,
  index,
  total,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onSelect,
  disableDrag = false,
}) {
  const [draft, setDraft] = useState({ active: false, newType: question.type });

  const selectRef = useRef(null);

  useEffect(() => {
    if (draft.active) {
      requestAnimationFrame(() => {
        if (selectRef.current) {
          selectRef.current.focus({ preventScroll: true });
          try {
            selectRef.current.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            selectRef.current.click();
          } catch {}
        }
      });
    }
  }, [draft.active]);

  const [editing, setEditing] = useState(false);
  const [localText, setLocalText] = useState(question.text || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: disableDrag || editing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : undefined,
    zIndex: isDragging ? 10 : undefined,
  };

  const typeLabel =
    TYPE_META[draft.active ? draft.newType : question.type]?.label || "Type";
  const TypeIcon = TYPE_META[question.type]?.icon || Type;

  const startTypeEdit = () => setDraft({ active: true, newType: question.type });
  const cancelTypeEdit = () => setDraft({ active: false, newType: question.type });
  const saveTypeEdit = () => {
    const t = draft.newType;
    const sanitized = sanitizeForType(question, t);
    onUpdate({ ...sanitized, type: t });
    setDraft({ active: false, newType: t });
  };

  const {
    onPointerDown: dndOnPointerDown,
    onMouseDown: dndOnMouseDown,
    ...restListeners
  } = listeners || {};

  const handlePointerDown = (e) => {
    setEditing(false);
    e.stopPropagation();
    dndOnPointerDown?.(e);
  };
  const handleMouseDown = (e) => {
    e.stopPropagation();
    dndOnMouseDown?.(e);
  };

  useEffect(() => {
    if (!editing) setLocalText(question.text || "");
  }, [question.text, editing]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full rounded-lg border bg-white shadow-sm hover:shadow transition p-3 cursor-pointer"
      onClick={(e) => {
        if (e.target.closest("a,input,button,select,textarea")) return;
        onSelect();
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          className={`p-2 rounded hover:bg-gray-100 cursor-grab touch-none  flex-shrink-0 ${disableDrag ? "opacity-40 cursor-default" : ""}`}
          {...(!disableDrag ? { ...attributes, ...restListeners } : {})}
          title="Drag to reorder"
          type="button"
          onMouseDown={handleMouseDown}
          onPointerDown={handlePointerDown}
        >
          <GripVertical size={16} />
        </button>

        <span className="text-xs text-white bg-[#274c77] rounded px-2 py-1">
          Q{question.displayOrder ?? index + 1}
        </span>
        <TypeIcon size={16} className="text-gray-700" />

        <button
  role="button"
  tabIndex={-1}
  className="flex-1 min-w-0 text-left border rounded px-2 py-1 text-sm bg-white hover:bg-gray-50"
  onClick={() => onSelect()}
  onMouseDown={(e) => e.preventDefault()}
  title={stripInlineTags(question.text || "")}
  style={{ maxHeight: 96, overflowY: "auto" }}
>
  <div
    className="whitespace-normal break-words pointer-events-none"
    dangerouslySetInnerHTML={{
      __html: sanitizeInlineHTML((question.text || "").trim() || "Untitled question"),
    }}
  />
</button>
        <label
          className="text-xs cursor-pointer text-gray-700 inline-flex items-center gap-1 ml-2 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={!!question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="cursor-pointer"
          />{" "}
          Required
        </label>

        <div
          className="ml-2 flex items-center flex-wrap gap-1 flex-shrink-0"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            title="Move up"
            className="cursor-pointer p-1 rounded hover:bg-gray-100"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            title="Move down"
            className="cursor-pointer p-1 rounded hover:bg-gray-100"
            onClick={onMoveDown}
            disabled={index === total - 1}
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <button
          type="button"
          title="Duplicate"
          className="cursor-pointer p-1 rounded hover:bg-gray-100"
          onClick={onDuplicate}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          title="Delete"
          className="cursor-pointer p-1 rounded hover:bg-gray-100 text-red-600"
          onClick={onDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        className="mt-2 flex items-center gap-2 flex-wrap"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!draft.active ? (
          <>
            <span className="text-xs text-gray-500">Type</span>
            <button
              type="button"
              className="cursor-pointer px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50 inline-flex items-center gap-1"
              onClick={startTypeEdit}
              title="Change question type"
            >
              {typeLabel} <ChevronDown size={14} />
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-gray-500">Type</span>
            <select
              ref={selectRef}
              className="border rounded px-2 py-1 text-sm"
              value={draft.newType}
              onChange={(e) => setDraft((d) => ({ ...d, newType: e.target.value }))}
            >
              {Object.entries(TYPE_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            {draft.newType !== question.type && (
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <AlertTriangle size={14} /> Warning: Some previously entered
                data isn't compatible with your new question type and will not
                be saved to it.
              </div>
            )}

            <button
              type="button"
              className="cursor-pointer px-2 py-1 text-xs rounded bg-[#274c77] text-white inline-flex items-center gap-1"
              onClick={saveTypeEdit}
            >
              <Check size={14} /> Save
            </button>
            <button
              type="button"
              className="cursor-pointer px-2 py-1 text-xs rounded border inline-flex items-center gap-1"
              onClick={cancelTypeEdit}
            >
              <X size={14} /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function sanitizeForType(q, t) {
  const base = {
    text: q.text,
    required: !!q.required,
    displayOrder: q.displayOrder,
  };
  if (["checkbox", "radio", "dropdown"].includes(t))
    return {
      ...base,
      options: q.options?.length ? q.options : ["", "", ""],
      matrixRows: [],
      scaleLabels: [],
      scaleMin: 0,
      scaleMax: 5,
      starWeights: [],
    };
  if (t === "matrix")
    return {
      ...base,
      options: [],
      matrixRows: q.matrixRows?.length ? q.matrixRows : [""],
      scaleLabels: q.scaleLabels?.length ? q.scaleLabels : [""],
      scaleMin: 1,
      scaleMax: Math.max(1, (q.scaleLabels || [""]).filter(Boolean).length),
      starWeights: [],
    };
  if (t === "star")
    return {
      ...base,
      options: [],
      matrixRows: [],
      scaleLabels: q.scaleLabels || [],
      scaleMin: 0,
      scaleMax: Math.min(10, Math.max(1, q.scaleMax || 5)),
      starWeights: q.starWeights || [],
    };
  if (["rating", "slider"].includes(t))
    return {
      ...base,
      options: [],
      matrixRows: [],
      scaleLabels: q.scaleLabels || [],
      scaleMin: 0,
      scaleMax: 5,
      starWeights: [],
    };
  return {
    ...base,
    options: [],
    matrixRows: [],
    scaleLabels: [],
    scaleMin: 0,
    scaleMax: 5,
    starWeights: [],
  };
}