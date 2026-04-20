import React from 'react'
import { useState } from "react";
import ScaleLabelsRow from "./ScaleLabelsRow";

export default function SliderRating({
  min = 0,
  max = 10,
  step = 1,
  value = null,
  onChange,
  disabled,
  mode = "slider",
  primaryColor = "#274c77",
  labels = [],
}) {
  if (mode === "stars") {
    const stars = Array.from({ length: max }, (_, i) => i + 1);
    const [hovered, setHovered] = useState(0);

    const numericValue = Number.isFinite(Number(value)) ? Number(value) : null;
    const current = hovered || (numericValue ?? 0);
    const liveCount = hovered || (numericValue ?? 0);

    return (
      <>
        <div
          className="flex items-center justify-center gap-3 flex-wrap"
          role="radiogroup"
          aria-label="Star rating"
        >
          {stars.map((s) => {
            const active = s <= current;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={numericValue === s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => onChange(s)}
                disabled={disabled}
                className={`leading-none ${active ? "text-yellow-500 star-active" : "text-[#274c77]/30"} hover:text-yellow-500`}
                style={{
                  cursor: "pointer",
                  fontSize: "clamp(36px, 8vw, 64px)",
                  transition: "transform 160ms ease",
                }}
              >
                ★
              </button>
            );
          })}
        </div>

        <ScaleLabelsRow labels={labels} min={1} max={max} />

        <div className="w-full text-center mb-2">
          <span className="text-[#274c77] font-semibold text-lg">{liveCount}</span>
        </div>
      </>
    );
  }


const hasNumeric =
  value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
const numericValue = hasNumeric ? Number(value) : null;
const isUnselected = numericValue === null;

const domValue = isUnselected ? min : numericValue;

return (
  <div className="w-full">
    <div className="w-full text-center mb-2 min-h-[1.5rem]">
      {isUnselected ? (
        <span className="text-gray-400 italic text-sm select-none">
          Slide to select
        </span>
      ) : (
        <span className="text-[#274c77] font-semibold text-lg">{numericValue}</span>
      )}
    </div>

    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={domValue}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className={`cursor-grab w-full accent-[#274c77] ${isUnselected ? "opacity-80" : ""}`}
      aria-valuenow={numericValue ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label="Slider rating"
      onPointerDown={() => { if (isUnselected && !disabled) onChange(min); }}
    />

    <ScaleLabelsRow labels={labels} />
  </div>
);
}
