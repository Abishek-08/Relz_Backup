import React from "react";
import { Virtuoso } from "react-virtuoso";
import Spinner from "./Spinner";
import { sanitizeInlineHTML } from "../../../utils/richText";

export default function QuestionLibrary({
  loading,
  list = [],
  questions = [],
  selectedPrev,
  setSelectedPrev,
  addOne,
  addSelected,
  addingSelected,
  error,
}) {
  const renderRow = (index) => {
    const q = list[index];
    const key = q.surveyQuestionId ?? `${q.surveyQuestion}-${index}`;
    const isChecked = selectedPrev.has(key);
    const normalized = (q.surveyQuestion || "").trim().toLowerCase();

    const canToggle = () => {
      const alreadyAdded = questions.some(
        (qq) =>
          qq.type === q.surveyQuestionType &&
          (qq.text || "").trim().toLowerCase() === normalized
      );
      const selectionDup = Array.from(selectedPrev).some((k2) => {
        if (k2 === key) return false;
        const j = list.findIndex(
          (qq, ii) =>
            (qq.surveyQuestionId ?? `${qq.surveyQuestion}-${ii}`) === k2
        );
        if (j < 0) return false;
        const other = list[j];
        return (
          other?.surveyQuestionType === q.surveyQuestionType &&
          (other?.surveyQuestion || "").trim().toLowerCase() === normalized
        );
      });
      if (alreadyAdded || selectionDup) {
        error?.("This question (same text & type) is already selected/added.");
        return false;
      }
      return true;
    };

    const toggle = () => {
      if (!canToggle()) return;
      setSelectedPrev((prev) => {
        const n = new Set(prev);
        if (n.has(key)) n.delete(key);
        else n.add(key);
        return n;
      });
    };

    const onRowClick = () => {
      if (selectedPrev.size > 0) {
        toggle();
      } else {
        addOne(q);
      }
    };

    return (
      <li
        key={key}
        className="px-4 py-3 hover:bg-gray-50 transition flex items-start gap-2 cursor-pointer"
        onClick={onRowClick}
      >
        <input
          key={`${key}-${isChecked ? 1 : 0}`}
          type="checkbox"
          className="mt-1 cursor-pointer"
          checked={isChecked}
          onClick={(e) => e.stopPropagation()}
          onChange={toggle}
          aria-label={`Select: ${q.surveyQuestion}`}
        />
        <div className="flex-1 text-left">
          <p
            className="text-sm font-medium text-gray-800"
            dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(q.surveyQuestion || "") }}
          />
          <span className="text-xs text-blue-600">{q.surveyQuestionType}</span>
        </div>
      </li>
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner size={20} />
          </div>
        ) : list.length === 0 ? (
          <div className="p-6 text-sm text-gray-500 text-center">
            No questions found.
          </div>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={list.length}
            itemContent={(index) => renderRow(index)}
            components={{
              List: (props) => <ul {...props} className="divide-y" />,
            }}
          />
        )}
      </div>

      <div className="border-t p-3 flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={addSelected}
          disabled={selectedPrev.size === 0 || addingSelected}
          className="cursor-pointer disabled:cursor-not-allowed w-full bg-[#274c77] text-white text-sm py-2 rounded disabled:opacity-50"
        >
          {addingSelected
            ? "Adding..."
            : `Add selected (${selectedPrev.size})`}
        </button>
      </div>
    </div>
  );
}