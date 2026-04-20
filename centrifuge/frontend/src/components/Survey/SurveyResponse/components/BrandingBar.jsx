import React from "react";
import relevantzLogo from "/assets/RelevantZLogo.svg"; // rectangular
import r2dcLogo from "/assets/R2DC_final_right_side.png"; // square

export default function BrandingBar({ title = "", showTitle = true }) {
  return (
    <div className="kiosk-brandbar">
      <div className="justify-self-start">
        <img
          src={relevantzLogo}
          alt="App Logo"
          style={{ height: "44px", width: "auto" }} /* bigger and by height */
          className="object-contain select-none"
        />
      </div>
      <div className="justify-self-center text-center">
        {showTitle && (
          <h1 className="text-[#27235c] text-base sm:text-lg font-semibold truncate max-w-[60vw]">
            {title}
          </h1>
        )}
      </div>
      <div className="justify-self-end">
        <img
          src={r2dcLogo}
          alt="Brand"
          style={{ height: "40px", width: "auto" }} /* square by height */
          className="object-contain select-none"
        />
      </div>
    </div>
  );
}
