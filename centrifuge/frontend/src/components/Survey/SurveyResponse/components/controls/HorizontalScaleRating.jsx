import React, { useEffect } from "react";
import ScaleLabelsRow from "./ScaleLabelsRow";

export default function HorizontalScaleRating({
  min = 1,
  max = 5,
  labels = [],
  value = null,
  onChange,
  disabled,
  primaryColor = "#27235c",
  name = "scale-rating",
}) {
  const items = [];
  for (let i = min; i <= max; i++) items.push(i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        {items.map((n, idx) => {
          const id = `scale_${name}_${n}`;
          const checked = value !== null && Number(value) === n; // ✅ no phantom selection on null
          const label = labels[idx] ?? String(n);
          return (
            <label key={n} htmlFor={id} className="flex-1 flex flex-col items-center gap-2 cursor-pointer scale-hover">
              <input
                id={id}
                type="radio"
                name={name}
                className="accent-[#27235c] scale-125 md:scale-150"
                disabled={disabled}
                checked={checked}
                onChange={() => onChange(n)}
              />
              <span className={`text-sm ${checked ? "font-semibold" : ""}`} style={{ color: checked ? primaryColor : "#374151" }}>
                {label}
              </span>
            </label>
          );
        })}
      </div>
      <ScaleLabelsRow labels={labels} min={min} max={max} />
    </div>
  );
}