
import React from "react";

export default function ScaleLabelsRow({ labels = [] }) {
  if (!labels || labels.length === 0) return null;

  if (labels.length === 1) {
    return (
      <div className="mt-1 w-full">
        <div className="flex justify-start text-xs text-gray-600">
          <span>{labels[0]}</span>
        </div>
      </div>
    );
  }

  if (labels.length === 2) {
    return (
      <div className="mt-1 w-full">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      </div>
    );
  }

  // 3 labels → left, center, right
  if (labels.length === 3) {
    return (
      <div className="mt-1 w-full">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{labels[0]}</span>
          <span className="text-center flex-1">{labels[1]}</span>
          <span>{labels[2]}</span>
        </div>
      </div>
    );
  }

  // More → evenly spaced
  return (
    <div className="mt-1 w-full grid text-xs text-gray-600"
         style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
      {labels.map((t, i) => (
        <span key={i} className={`text-center ${i === 0 ? "text-left" : ""} ${i === labels.length - 1 ? "text-right" : ""}`}>
          {t}
        </span>
      ))}
    </div>
  );
}
