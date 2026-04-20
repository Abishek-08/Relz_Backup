import React from "react";

export default function Spinner({ size = 16, className = "" }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-gray-300 border-t-[#27235c] ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
