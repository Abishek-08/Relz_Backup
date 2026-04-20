import React, { useMemo } from "react";
import { MAX_COMMENT_CHARS_DEFAULT } from "../../utils/constants";

export default function CommentInput({ value, onChange, disabled, primaryColor = "#274c77", question }) {
  const maxChars = useMemo(() => {
    const n = Number(question?.maxChars);
    return Number.isFinite(n) && n > 0 ? n : MAX_COMMENT_CHARS_DEFAULT;
  }, [question?.maxChars]);

  const v = String(value || "");
  const remaining = Math.max(0, maxChars - v.length);

  return (
    <div>
      <textarea
        rows={6}
        value={v}
        maxLength={maxChars}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-40 resize-none px-3 py-2 rounded-lg bg-white border focus:outline-none focus:ring-2 overflow-y-auto"
        style={{ borderColor: `${primaryColor}33` }}
        placeholder={`Type your comments… (max ${maxChars} chars)`}
      />

      

      <div className="mt-1 text-xs text-gray-500">{remaining} / {maxChars}</div>
    </div>
  );
}
