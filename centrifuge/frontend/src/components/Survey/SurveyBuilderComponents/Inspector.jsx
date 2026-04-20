import React, { useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  X as XIcon,
  MessageSquare,
  CheckSquare,
  Dot,
  ListFilter,
  Sliders,
  Type,
  Star,
  Table,
  Info,
  MessageCircleQuestion,
  CircleDot,
  GitCommit,
  SlidersHorizontal,
} from "lucide-react";
import EditableList from "./EditableList";
import { useToast } from "../../../utils/useToast";
import { AnimatePresence, motion } from "framer-motion";
import InlineFormatToolbar from "./InlineFormatToolbar";
import InlineRichInput from "./InlineRichInput";
import { wrapSelectionWithTag } from "../../../utils/richText";

const TYPE_ICONS = {
  comment: MessageSquare,
  checkbox: CheckSquare,
  radio: CircleDot,
  dropdown: ListFilter,
  slider: GitCommit,
  rating: SlidersHorizontal,
  star: Star,
  matrix: Table,
};

const { success, error } = useToast();

export default function Inspector({
  open,
  setOpen,
  hasSelection,
  question,
  onUpdate,
}) {
  if (!hasSelection) {
    return (
      <aside className="hidden lg:block rounded-xl sticky h-max">
        <div className="bg-white rounded-xl shadow">
          <button
            className="cursor-pointer w-full px-4 py-3 text-left flex items-center justify-between"
            onClick={() => setOpen(!open)}
          >
             <span className="cursor-pointer text-sm font-semibold text-[#274c77] inline-flex items-center gap-2">
          <MessageCircleQuestion size={18} /> Question Settings
        </span>
            {open ? (
              <ChevronUp size={16} className="cursor-pointer" />
            ) : (
              <ChevronDown size={16} className="cursor-pointer" />
            )}
          </button>
          <Animate open={open}>
            <div className="p-6 flex items-center gap-3 overflow-x-hidden">
              <div className="text-[#274c77] text-2xl" aria-hidden>
                <Info />
              </div>
              <p className="text-sm text-gray-600">
                Add a question and then select it to configure its settings.
              </p>
            </div>
          </Animate>
        </div>
      </aside>
    );
  }

  const Icon = TYPE_ICONS[question?.type] || Type;
  const qInputRef = useRef(null);
  console.log("question:", question)

  return (
    <aside className=" bg-white rounded-xl shadow p-0 sticky top-4 h-max">
      <button
        className="cursor-pointer w-full px-4 py-3 text-left flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="cursor-pointer text-sm font-semibold text-[#274c77] inline-flex items-center gap-2">
          <MessageCircleQuestion size={18} /> Question Settings
        </span>
        {open ? <ChevronUp className="transition-transform rotate-180" size={16} /> : <ChevronDown className="transition-transform" size={16} />}
      </button>

      <Animate open={open}>
        {question && (
          <div className="p-4 space-y-3 overflow-x-auto">
            <div>
              <p className="text-[12px] text-gray-500 mb-1">
  Need duplicate options? You can add them here.
</p>

    <span className="text-xs text-white bg-[#274c77] rounded px-2 py-1">
              Q{question.displayOrder ?? index + 1}
    </span>  
    <div className="mb-1 mt-2">
    <InlineFormatToolbar
      inputRef={qInputRef}
      value={question.text || ""}
      onChange={(nv) => onUpdate({ text: nv })}
    />
    
  </div>
  <InlineRichInput
    value={question.text || ""}
    onChange={(nv) => onUpdate({ text: nv })}
    placeholder="Question"
    minHeight={56}
    maxHeight={160}
    className="w-full rounded bg-white"
    style={{ borderColor: "#e5e7eb" }}
    refHook={qInputRef}
  />
  {question.dupWarning && (
  <p className="text-xs text-red-600 mt-1">
    Same question with same type already exists.
  </p>
)}
</div>
            <label className="text-xs inline-block text-[#274c77]">
                <span className="justify-centertext-sm font-semibold text-[#274c77] inline-flex items-center gap-2">
          <Icon size={16} /> {question?.type === "radio" ? "MULTIPLE CHOICE" : question?.type.toUpperCase()}
        </span>
              </label>

            {["checkbox", "radio", "dropdown"].includes(question.type) && (
              <EditableList
                title="Options"
                value={question.options || ["", "", ""]}
                onChange={(opts) => onUpdate({ options: opts })}
                placeholder="Option"
                seedCount={3}
                autoEnsureEmptyTail
                enableInlineFormatting
              />
            )}

            {["rating", "slider", "star"].includes(question.type) && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <select
                      value={question.scaleMin ?? 0}
                      onChange={(e) => onUpdate({ scaleMin: Number(e.target.value) })}
                      className="cursor-pointer border rounded px-2 py-1 text-sm w-full"
                    >
                      {Array.from({ length: 10 }, (_, i) => i).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {question.type === "star" ? "Max (1–10)" : "Max"}
                    </label>
                    <select
                      value={question.scaleMax ?? 1}
                      onChange={(e) => {
                        const max = Number(e.target.value);
                        const min = Number(question.scaleMin ?? 0);
                        if (question.type === "star" && (max < 1 || max > 10)) return;
                        if (min >= max) return;
                        const pts = max - min + 1;
                        onUpdate({
                          scaleMax: max,
                          scaleLabels: (question.scaleLabels || []).slice(0, Math.max(1, pts)),
                        });
                      }}
                      className="cursor-pointer border rounded px-2 py-1 text-sm w-full"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {question.type === "slider" && (
              <>
                <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <input
                    type="checkbox"
                    checked={(question.scaleLabels || []).length > 0}
                    onChange={(e) =>
                      onUpdate({
                        scaleLabels: e.target.checked
                          ? (question.scaleLabels?.length ? question.scaleLabels : [""])
                          : [],
                      })
                    }
                  />
                  Add scale labels
                </label>

                {(question.scaleLabels || []).length > 0 && (
                  <EditableList
                    title="Scale labels"
                    value={question.scaleLabels || [""]}
                    onChange={(cols) => {
                      const pts = Math.max(1, question.scaleMax - question.scaleMin + 1);
                      onUpdate({ scaleLabels: cols.slice(0, pts) });
                    }}
                    placeholderBase="Label"
                    seedCount={1}
                    showAddButton={true}
                    addButtonLabel="Add label"
                    maxItems={Math.max(1, question.scaleMax - question.scaleMin + 1)}
                    onHitMax={() => error(
                      "Max " + (question.scaleMax - question.scaleMin + 1) + " labels allowed for the selected scale."
                    )}
                    autoEnsureEmptyTail
                  />
                )}
              </>
            )}

            {question.type === "matrix" && (
  <>
    <EditableList
      title="Rows"
      value={question.matrixRows || [""]}
      onChange={(rows) => onUpdate({ matrixRows: rows })}
      placeholder="Row"
      seedCount={1}
      showAddButton={true}
      addButtonLabel="Add row"
      autoEnsureEmptyTail
      enableInlineFormatting
    />

    <EditableList
      title="Columns"
      value={question.scaleLabels || [""]}
      onChange={(cols) =>
        onUpdate({
          scaleLabels: cols,
          scaleMin: 1,
          scaleMax: Math.max(1, (cols || []).length),
        })
      }
      placeholder="Column"
      seedCount={1}
      showAddButton={true}
      addButtonLabel="Add column"
      autoEnsureEmptyTail
      enableInlineFormatting
    />
  </>
)}
          </div>
        )}
      </Animate>
    </aside>
  );
}

/* small primitives */
function Animate({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="inspector-content"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
