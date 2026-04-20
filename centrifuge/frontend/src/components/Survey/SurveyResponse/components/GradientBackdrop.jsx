import React from "react";

export default function GradientBackdrop() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500 -z-10" aria-hidden />
  );
}