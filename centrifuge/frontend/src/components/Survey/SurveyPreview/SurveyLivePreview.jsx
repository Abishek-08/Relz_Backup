import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { sanitizeInlineHTML } from "../../../utils/richText";

export default function SurveyLivePreview({
  open,
  onClose,
  questions = [],
  themeChoice,
  themeFile,
  themeUrlOverride,
  responseMode,
  emailMode,
  thankyouTimeout,
  idleTimeoutValue, idleTimeoutUnit,
}) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const [fileUrl, setFileUrl] = useState(null);

  const sortedQuestions = [...questions].sort((a,b) => {
    const ao = a.displayOrder ?? 0;
    const bo = b.displayOrder ?? 0;
    if (ao === bo) return (a.id||0) - (b.id||0);
    return ao - bo;
  });

  {sortedQuestions.map((q, i) => <PreviewQuestion key={q.id || i} q={q} />)}

  useEffect(() => {
    if (themeUrlOverride) {
      setFileUrl(themeUrlOverride);
      return;
    }
    if (themeChoice === "custom" && themeFile) {
      const u = URL.createObjectURL(themeFile);
      setFileUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setFileUrl("/assets/SurveyDefaultTheme.gif");
  }, [themeChoice, themeFile, themeUrlOverride]);

  const isVideo = useMemo(() => {
    if (!fileUrl) return false;
    return /\.mp4($|\?)/i.test(fileUrl) || (themeFile?.type?.startsWith("video/") ?? false);
  }, [fileUrl, themeFile]);

  const [viewport, setViewport] = useState('desktop');
  const containerClass =
    viewport==='mobile' ? 'max-w-[390px]' :
    viewport==='tablet' ? 'max-w-[768px]' : 'max-w-3xl';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className={`relative bg-white rounded-xl shadow-xl w-full ${containerClass} mx-auto h-[85vh] overflow-hidden`}
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="w-full max-w-3xl mx-auto px-4 flex items-center gap-2 justify-end pb-2">
              <span className="text-xs text-gray-600">View:</span>
              <button className="px-2 py-1 text-xs border rounded" onClick={()=>setViewport('mobile')}>Mobile</button>
              <button className="px-2 py-1 text-xs border rounded" onClick={()=>setViewport('tablet')}>Tablet</button>
              <button className="px-2 py-1 text-xs border rounded" onClick={()=>setViewport('desktop')}>Desktop</button>
            </div>
            <div className="absolute inset-0">
              {fileUrl ? (
                isVideo ? (
                  <video src={fileUrl} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-25" />
                ) : (
                  <img src={fileUrl} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                )
              ) : null}
            </div>

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b bg-white/70 backdrop-blur">
                <h3 className="font-semibold">Live Preview</h3>
                <button className="p-2 rounded hover:bg-gray-100" onClick={onClose} aria-label="Close">
                  <X size={18}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white/70 backdrop-blur">
                {responseMode === "email" && (
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">Respondent identity</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input className="border rounded px-3 py-2" placeholder={emailMode === "internal" ? "Employee email" : "Email"} />
                      <input className="border rounded px-3 py-2" placeholder="Name (optional)" />
                    </div>
                  </div>
                )}

                {questions.map((q, i) => <PreviewQuestion key={q.id || i} q={q} />)}

                <p className="text-xs text-gray-500">
                  Thank you page timeout: {thankyouTimeout || 0}s • Idle timeout: {idleTimeoutValue || 0} {idleTimeoutUnit}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PreviewQuestion({ q }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-[#202124]">
          <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(q.text || "") }} />{" "}
          {q.required && <span className="text-red-600">*</span>}
        </p>
      </div>

      <div className="mt-3">
        {q.type === "comment" && (
          <textarea className="w-full border rounded px-3 py-2" rows={3} placeholder="Your answer"/>
        )}

        {q.type === "checkbox" && (
          <ul className="space-y-1">
            {(q.options||[]).map((o,i)=>(
              <li key={i} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4"/><span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />
              </li>
            ))}
          </ul>
        )}

        {q.type === "radio" && (
          <ul className="space-y-1">
            {(q.options||[]).map((o,i)=>(
              <li key={i} className="flex items-center gap-2">
                <input type="radio" name={`r-${q.id || "preview"}`} className="h-4 w-4"/><span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />
              </li>
            ))}
          </ul>
        )}

        {q.type === "dropdown" && (
          <select className="border rounded px-3 py-2">
            <option value="">Select...</option>
            {(q.options||[]).map((o,i)=> <option key={i} value={o} dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />)}
          </select>
        )}

        {q.type === "slider" && (
          <div>
            <input type="range" min={q.scaleMin||0} max={q.scaleMax||100} className="w-full"/>
            <p className="text-xs text-gray-500">{q.scaleMin} – {q.scaleMax}</p>
          </div>
        )}

        {q.type === "rating" && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {Array.from({ length: (q.scaleMax||5) - (q.scaleMin||1) + 1 }).map((_,i)=>(
                <button key={i} className="w-8 h-8 rounded border hover:bg-gray-50">{(q.scaleMin||1)+i}</button>
              ))}
            </div>
            {(q.scaleLabels||[]).length ? (
              <div className="text-xs text-gray-500">{q.scaleLabels.join(" · ")}</div>
            ) : null}
          </div>
        )}

        {q.type === "star" && (
          <div className="flex gap-1">
            {Array.from({ length: q.scaleMax || 5 }).map((_,i)=>(
              <span key={i} aria-hidden>⭐</span>
            ))}
          </div>
        )}

        {q.type === "matrix" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left"> </th>
                  
                  {(q.scaleLabels||[]).map((c,i)=>(
                    <th key={i} className="border px-2 py-1 text-center">
                      <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(c || `Col ${i+1}`) }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(q.matrixRows||[]).map((r,ri)=>(
                  <tr key={ri}>
                    
<td className="border px-2 py-1">
  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(r || `Row ${ri+1}`) }} />
</td>
                    {(q.scaleLabels||[]).map((_,ci)=>(
                      <td key={ci} className="border px-2 py-1 text-center">
                        <input type="radio" name={`m-${ri}`}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}