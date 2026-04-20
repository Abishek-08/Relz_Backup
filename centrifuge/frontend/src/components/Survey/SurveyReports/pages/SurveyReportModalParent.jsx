import React, { useEffect, useRef } from "react";
import { encryptSession } from "../../../../utils/SessionCrypto";
import SurveyReportModal from "./SurveyReportModal";
import { X } from "lucide-react";

export default function SurveyReportModalParent({
  eventId,
  onClose,
  autoRefreshMs = 1000,
}) {
  const scrollParentRef = useRef(null);

  useEffect(() => {
    if (eventId != null) {
      localStorage.setItem("eventObjId", encryptSession(String(eventId)));
    }
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-h-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white text-black shadow hover:bg-gray-100 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <div
          ref={scrollParentRef}
          id="report-scroll-parent"
          className="flex-1 min-h-0 overflow-auto"
        >
          {/* Pass autoRefreshMs to keep it live */}
          <SurveyReportModal autoRefreshMs={autoRefreshMs} scrollParentRef={scrollParentRef} />
        </div>
      </div>
    </div>
  );
}
