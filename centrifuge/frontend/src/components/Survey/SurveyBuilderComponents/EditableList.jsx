import React, { useEffect, useRef, useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, XCircle } from "lucide-react";
import InlineFormatToolbar from "./InlineFormatToolbar";
import InlineRichInput from "./InlineRichInput";
import { stripInlineTags } from "../../../utils/richText";

export default function EditableList({
  title,
  value = [],
  onChange,
  placeholder = "Item",
  seedCount = 0,
  allowInsertAt = true,
  showAddButton = true,
  addButtonLabel,
  maxItems,
  onHitMax,
  enableInlineFormatting = false,
}) {
  const [items, setItems] = useState(
    value.length ? value : seedCount ? Array.from({ length: seedCount }, () => "") : [""],
  );
  const [lastTypedIndex, setLastTypedIndex] = useState(-1);
  const refs = useRef([]); // [{ current: HTMLElement }]

  useEffect(() => {
    setItems(value.length ? value : seedCount ? Array.from({ length: seedCount }, () => "") : [""]);
  }, [value, seedCount]);

  const emit = (arr) => {
    setItems(arr);
    onChange(arr);
  };

  const countNonEmpty = (arr = items) =>
    arr.filter((v) => stripInlineTags(v || "").trim().length > 0).length;

  const canAddOne = () =>
    typeof maxItems === "number" ? countNonEmpty() < maxItems : true;

  const addAt = (i) => {
    if (!canAddOne()) return onHitMax?.();
    const n = [...items];
    n.splice(i + 1, 0, "");
    emit(n);
  };
  const addEnd = () => {
    if (!canAddOne()) return onHitMax?.();
    emit([...items, ""]);
  };
  const update = (i, v) => {
    const isLast = i === items.length - 1;
    const wasEmpty = stripInlineTags(items[i] || "").trim().length === 0;
    const isNowNonEmpty = stripInlineTags(v || "").trim().length > 0;

    if (isLast && wasEmpty && isNowNonEmpty && lastTypedIndex !== i) {
      setLastTypedIndex(i);
      if (canAddOne()) {
        const n = [...items];
        n[i] = v;
        n.push("");
        emit(n);
        return;
      }
    }
    emit(items.map((it, idx) => (idx === i ? v : it)));
  };
  const remove = (i) => {
    const n = [...items];
    n.splice(i, 1);
    emit(n.length ? n : [""]);
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    const [it] = n.splice(i, 1);
    n.splice(j, 0, it);
    emit(n);
  };

  const topOffset = enableInlineFormatting ? 36 : 0;

  return (
    <div>
      {title ? <p className="text-sm font-medium text-gray-800 mb-2">{title}</p> : null}
      <div className="space-y-3">
        {items.map((v, i) => {
          if (!refs.current[i]) refs.current[i] = { current: null };
          return (
            <div key={i} className="flex items-start gap-2 min-w-0">
              <span
                className="flex-none inline-flex h-6 w-6 items-center justify-center rounded bg-[#274c77] text-xs font-semibold text-white"
                style={{ marginTop: topOffset }}
              >
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                {enableInlineFormatting && (
                  <div className="mb-1">
                    <InlineFormatToolbar
                      inputRef={refs.current[i]}
                      value={v}
                      onChange={(nv) => update(i, nv)}
                    />
                  </div>
                )}

                {enableInlineFormatting ? (
                  <InlineRichInput
                    value={v}
                    onChange={(nv) => update(i, nv)}
                    placeholder={`${placeholder} ${i + 1}`}
                    minHeight={40}
                    maxHeight={120}
                    className="w-full rounded bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                    refHook={refs.current[i]}
                  />
                ) : (
                  <input
                    value={v}
                    onChange={(e) => update(i, e.target.value)}
                    onFocus={() => {
                      if (i === items.length - 1 && stripInlineTags(items[i] || "").trim() !== "") {
                        const nonEmpty = countNonEmpty();
                        const atLimit = typeof maxItems === "number" ? nonEmpty >= maxItems : false;
                        if (!atLimit) emit([...items, ""]);
                      }
                    }}
                    placeholder={`${placeholder} ${i + 1}`}
                    className="flex-1 border rounded px-3 py-2 w-full"
                  />
                )}
              </div>

              <div className="flex gap-1" style={{ marginTop: topOffset }}>
                <button type="button" className="cursor-pointer p-1 rounded hover:bg-gray-100" title="Move up" onClick={() => move(i, -1)}>
                  <ChevronUp size={16} />
                </button>
                <button type="button" className="cursor-pointer p-1 rounded hover:bg-gray-100" title="Move down" onClick={() => move(i, 1)}>
                  <ChevronDown size={16} />
                </button>
                {allowInsertAt && (
                  <button type="button" className="cursor-pointer p-1 rounded hover:bg-gray-100" title="Add below" onClick={() => addAt(i)}>
                    <Plus size={16} />
                  </button>
                )}
                <button
                  type="button"
                  className="cursor-pointer p-1 rounded hover:bg-gray-100 text-red-600"
                  title="Remove"
                  onClick={() => remove(i)}
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {showAddButton && (
          <button
            type="button"
            className="cursor-pointer hover:bg-gray-100 inline-flex items-center gap-1 text-sm border px-2 py-1 rounded"
            onClick={addEnd}
            aria-label={addButtonLabel || `Add ${placeholder.toLowerCase()}`}
          >
            <Plus size={16} /> {addButtonLabel || `Add ${placeholder.toLowerCase()}`}
          </button>
        )}
      </div>
    </div>
  );
}