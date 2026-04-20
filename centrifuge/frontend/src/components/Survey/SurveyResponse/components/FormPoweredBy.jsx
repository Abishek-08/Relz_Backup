import React from "react";
import r2dcLogo from "/assets/R2DC_final_right_side.png";

export default function FormPoweredBy() {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-4 z-40 flex items-center gap-3 px-5 py-3
                    bg-white/90 backdrop-blur rounded-full shadow border border-gray-200"
    >
      <div className="text-[#27235c]/70 text-sm">Powered by</div>
      <div className="text-[#27235c] font-semibold text-lg">R2DC</div>
      <img src={r2dcLogo} alt="R2DC" className="h-8 w-auto object-contain" />
    </div>
  );
}
