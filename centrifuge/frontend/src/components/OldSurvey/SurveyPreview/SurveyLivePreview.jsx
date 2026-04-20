
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function SurveyLivePreview({
  open,
  onClose,
  questions,
  themeChoice,
  themeFile,
  responseMode,
  emailMode,
  thankyouTimeout,
  idleTimeoutValue,
  idleTimeoutUnit,
}) {
  const [url, setUrl] = useState(null);
  const [showSettings, setShowSettings] = useState(true);
   const [device, setDevice] = useState("desktop"); // 'mobile' | 'tablet' | 'desktop'
  const viewport = {
    mobile: { w: 375, h: 640 },
    tablet: { w: 768, h: 900 },
    desktop: { w: 1024, h: 700 },
  }[device];


  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (themeChoice === "custom" && themeFile) {
      const u = URL.createObjectURL(themeFile);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(null);
  }, [themeChoice, themeFile]);

  const isVideo = useMemo(() => themeFile?.type === "video/mp4", [themeFile]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/40"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 md:inset-6 lg:inset-10 rounded-none md:rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
          >
            {/* Background */}
            <div className="absolute inset-0">
              {themeChoice === "custom" && isVideo && url ? (
                <video
                  className="w-full h-full object-cover"
                  src={url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage:
                      themeChoice === "custom" && url
                        ? `url(${url})`
                        : "linear-gradient(#f8fafc, #eef2f7)",
                  }}
                />
              )}
            </div>

            {/* Overlay */}
            <div className="relative z-10 h-full overflow-auto bg-black/10 backdrop-blur-[1px]">
              <div className="flex items-center justify-between p-3 md:p-4">
                
<div className="flex items-center gap-2">
  <button className={`px-2 py-1 text-xs rounded ${device==='mobile'?'bg-white':'bg-white/70'} cursor-pointer`} onClick={()=>setDevice('mobile')}>📱</button>
  <button className={`px-2 py-1 text-xs rounded ${device==='tablet'?'bg-white':'bg-white/70'} cursor-pointer`} onClick={()=>setDevice('tablet')}>📟</button>
  <button className={`px-2 py-1 text-xs rounded ${device==='desktop'?'bg-white':'bg-white/70'} cursor-pointer`} onClick={()=>setDevice('desktop')}>🖥️</button>
</div>

                <button
                  className="px-2 py-1 text-xs md:text-sm rounded bg-white/85 hover:bg-white cursor-pointer"
                  onClick={() => setShowSettings((s) => !s)}
                >
                  {showSettings ? (
                    <span className="inline-flex items-center gap-1">
                      <ChevronUp size={14} /> Hide settings
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <ChevronDown size={14} /> Show settings
                    </span>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded bg-white/85 hover:bg-white cursor-pointer"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 md:px-4"
                  >
                    <div className="rounded-lg bg-white/90 p-3 md:p-4 mb-3">
                      <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-800">
                        <div>
                          <div className="font-semibold text-[#27235c] mb-1">Mode</div>
                          <div>
                            {responseMode === "anonymous"
                              ? "Anonymous"
                              : `Email (${emailMode})`}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-[#27235c] mb-1">
                            Thank you timeout
                          </div>
                          <div>{thankyouTimeout}s</div>
                        </div>
                        <div>
                          <div className="font-semibold text-[#27235c] mb-1">
                            Idle Timeout
                          </div>
                          <div>
                            {idleTimeoutValue} {idleTimeoutUnit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              
<div className="px-3 md:px-4 pb-6 flex justify-center">
  <div
    className="rounded-xl bg-white/95 shadow-lg overflow-auto"
    style={{ width: viewport.w, height: viewport.h }}
  >
    <div className="p-3 md:p-4 space-y-4">

                    {questions.map((q) => (
                      <div key={q.id} className="border-b pb-3">
                        <p className="font-medium text-gray-900">
                          {q.displayOrder}. {q.text}
                          {q.required && <span className="text-red-500"> *</span>}
                        </p>

                        {q.type === "comment" && (
                          <textarea
                            className="mt-2 w-full border rounded px-3 py-2"
                            placeholder="Your answer..."
                            disabled
                          />
                        )}

                        {["checkbox", "radio"].includes(q.type) && (
                          <div className="mt-2 space-y-1">
                            {q.options?.map((o, i) => (
                              <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type={q.type} disabled /> {o}
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === "dropdown" && (
                          <select className="mt-2 border rounded px-3 py-2" disabled>
                            <option value="">Select...</option>
                            {q.options?.map((o, i) => (
                              <option key={i}>{o}</option>
                            ))}
                          </select>
                        )}

                        {["rating", "slider", "star"].includes(q.type) && (
                          <div className="mt-2 text-sm text-gray-600">
                            Scale: {q.scaleMin} - {q.scaleMax}
                            {q.scaleLabels?.length ? (
                              <div className="text-xs text-gray-500">
                                {q.scaleLabels.join(" | ")}
                              </div>
                            ) : null}
                          </div>
                        )}

                        {q.type === "matrix" && (
                          <div className="mt-2 overflow-x-auto">
                            <table className="min-w-[420px] text-sm border bg-white">
                              <thead>
                                <tr>
                                  <th className="border px-2 py-1 text-left">Item</th>
                                  {q.scaleLabels?.map((c, i) => (
                                    <th key={i} className="border px-2 py-1">
                                      {c}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {q.matrixRows?.map((r, ri) => (
                                  <tr key={ri}>
                                    <td className="border px-2 py-1">{r}</td>
                                    {q.scaleLabels?.map((_, ci) => (
                                      <td key={ci} className="border px-2 py-1 text-center">
                                        <input type="radio" disabled />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}