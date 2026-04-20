import { LucideBrushCleaning } from "lucide-react";
import React from "react";
import { sanitizeInlineHTML } from "../../../../utils/richText";

export default function QuestionShell({
  index,
  total,
  required,
  question,
  children,
  invalid = false,
  primaryColor = "#27235c",
  onClear,
  value, // <-- pass value in
}) {
  const answered =
    value !== null &&
    value !== undefined &&
    value !== "" &&
    (Array.isArray(value) ? value.length > 0 : true);

  return (
    <section className={`space-y-3 ${invalid ? "ring-2 ring-red-400 rounded-2xl p-2" : ""}`}>
      <header className="flex items-center justify-end">
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer text-xs px-2 py-1 mb-3 rounded border border-[#27235c]/20 text-[#27235c]/80 hover:bg-[#27235c]/10"
        >
          <LucideBrushCleaning size={14} className="inline-block" /> Clear Response
        </button>
      </header>

      {/* Question text with conditional background */}
      <h3
        className={`text-lg sm:text-xl rounded-md px-2 py-1 transition-colors
          ${answered ? "bg-green-100" : "bg-gray-100"}
        `}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizeInlineHTML(
              question?.surveyQuestion ||
                question?.question ||
                question?.title ||
                "Question"
            ),
          }}
        />
        {required && <span className="text-red-600"> *</span>}
      </h3>

      {invalid && <p className="text-sm text-red-600">This question is required.</p>}
      <div>{children}</div>
    </section>
  );
}
