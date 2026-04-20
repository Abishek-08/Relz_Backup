import React, { useEffect, useState } from "react";
import { decryptSession } from "../../../utils/SessionCrypto";
import {
  Clock,
  Mail,
  Smartphone,
  Tablet,
  Monitor,
  MailCheck,
} from "lucide-react";
const defaultTheme = "/assets/SurveyDefaultTheme.gif";
import { getEventById } from "../../../services/Services";
import { sanitizeInlineHTML } from "../../../utils/richText";

export default function SurveyPreviewProp() {
  const [payload, setPayload] = useState(null);
  const [viewport, setViewport] = useState("desktop");

  useEffect(() => {
    const enc = localStorage.getItem("encSurveyPreview");
    if (!enc) return;
    try {
      const json = decryptSession(enc);
      setPayload(JSON.parse(json));
    } catch {
      try {
        setPayload(JSON.parse(enc));
      } catch {}
    }
  }, []);

  const [eventData, setEventData] = useState(null);
  const encryptedEventId = localStorage.getItem("selectedEventId");
  const sessionEventId = decryptSession(encryptedEventId);

  useEffect(() => {
    const fetchEventByIdFx = async () => {
      if (!sessionEventId) return;
      try {
        const response = await getEventById(sessionEventId);
        setEventData(response?.data);
        console.log(response);
      } catch (e) {
        console.error("Failed to fetch event:", e);
      }
    };
    fetchEventByIdFx();
  }, [sessionEventId]);

  if (!payload) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-gray-600">
        <div>Nothing to preview. Open preview from the builder.</div>
      </div>
    );
  }

  const {
    questions = [],
    themeUrl,
    themeIsVideo,
    themeType,
    responseMode,
    emailMode,
    thankyouTimeout,
    idleTimeoutValue,
    idleTimeoutUnit,
  } = payload;

  const bgUrl = themeUrl || defaultTheme;
  
  const isGif = /\.gif($|\?)/i.test(bgUrl);
  const isVideo =
    typeof themeIsVideo === "boolean"
      ? themeIsVideo
      : themeType
        ? themeType.startsWith("video/")
        : /\.mp4($|\?)/i.test(bgUrl);

  const sorted = [...questions].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

  const containerClass =
    viewport === "mobile"
      ? "max-w-[390px]"
      : viewport === "tablet"
        ? "max-w-[768px]"
        : "max-w-3xl";

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-500" />
        {isVideo ? (
          <video
            src={bgUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={bgUrl}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="pt-8 pb-2">
        <div className={`w-full ${containerClass} mx-auto px-4`}>
          <div className="bg-white/90 backdrop-blur border rounded-xl p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-[#202124]">
              {eventData?.eventName} • Survey (Preview)
            </h1>
          </div>
        </div>
      </div>

      <div className={`w-full ${containerClass} mx-auto px-4`}>
        <details className="bg-white/90 backdrop-blur border rounded-xl shadow-sm mb-4">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-[#202124]">
            Survey Settings
          </summary>
          <div className="px-4 pb-3 text-sm text-gray-700 grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
              {responseMode === "email" && <MailCheck size={16} className="text-[#27235c]" />}
              <div>
                <span className="block text-xs text-gray-500">Response Mode</span>
                <span className="font-medium">{responseMode}</span>
              </div>
            </div>

            {responseMode === "email" && (
              <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
                <span className="block text-xs text-gray-500">Email Mode</span>
                <span className="font-medium">{emailMode || "-"}</span>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Clock size={16} className="text-[#27235c] mt-0.5" />
              <div>
                <span className="block text-xs text-gray-500">Timeouts</span>
                <span className="font-medium">
                  Thankyou Timeout: {thankyouTimeout || 0}s <br />
                  Idle Timeout: {idleTimeoutValue || 0} {idleTimeoutUnit}
                </span>
              </div>
            </div>
          </div>
        </details>
      </div>

      <div className="pb-16">
        <div className={`w-full ${containerClass} mx-auto px-4`}>
          <div className="bg-white/90 backdrop-blur border rounded-xl p-5 shadow space-y-5">
            {responseMode === "email" && (
              <div>
                <p className="text-sm font-medium mb-1 text-[#202124]">
                  Respondent identity
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    className="border rounded px-3 py-2"
                    placeholder={emailMode === "internal" ? "Employee email" : "Email"}
                  />
                </div>
              </div>
            )}

            {sorted.map((q, i) => (
              <PreviewQuestion key={q.id || i} q={q} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewQuestion({ q, index }) {
  const [comment, setComment] = useState("");
  const [checked, setChecked] = useState(() => new Set());
  const [radio, setRadio] = useState(null);
  const [dropdown, setDropdown] = useState("");

  const min = Number.isFinite(q.scaleMin) ? Number(q.scaleMin) : 0;
  const defMax =
    q.type === "slider"
      ? 10
      : q.type === "rating"
        ? 5
        : q.type === "star"
          ? 5
          : 5;
  const max = Number.isFinite(q.scaleMax) ? Number(q.scaleMax) : defMax;

  const [rangeVal, setRangeVal] = useState(min);
  const [rating, setRating] = useState(null);
  const [stars, setStars] = useState(0);

  const toggleCheck = (opt) => {
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(opt)) n.delete(opt);
      else n.add(opt);
      return n;
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-[#202124]">
          {index}. <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(q.text || "") }} />{" "}
          {q.required && <span className="text-red-600"> *</span>}
        </p>
      </div>

      <div className="mt-3">
        {q.type === "comment" && (
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your answer"
          />
        )}

        {q.type === "checkbox" && (
          <ul className="space-y-1">
            {(q.options || []).map((o, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked.has(o)}
                  onChange={() => toggleCheck(o)}
                />
                <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />
              </li>
            ))}
          </ul>
        )}

        {q.type === "radio" && (
          <ul className="space-y-1">
            {(q.options || []).map((o, i) => (
              <li key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`r-${q.id || "preview"}`}
                  className="h-4 w-4"
                  checked={radio === o}
                  onChange={() => setRadio(o)}
                />
                <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />
              </li>
            ))}
          </ul>
        )}

        {q.type === "dropdown" && (
          <select
            className="border rounded px-3 py-2"
            value={dropdown}
            onChange={(e) => setDropdown(e.target.value)}
          >
            <option value="">Select...</option>
            {(q.options || []).map((o, i) => (
              <option key={i} value={o} dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o) }} />
            ))}
          </select>
        )}

        {q.type === "slider" && (
          <div>
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={Math.min(Math.max(rangeVal, min), max)}
              onChange={(e) => setRangeVal(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              {min} – {max} (now: {rangeVal})
            </p>
          </div>
        )}

        {q.type === "rating" && (
          <div className="space-y-1">
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: max - min + 1 }).map((_, i) => {
                const v = min + i;
                const active = rating === v;
                return (
                  <button
                    key={v}
                    className={`w-9 h-9 rounded border ${active ? "bg-[#27235c] text-white" : "bg-white hover:bg-gray-50"}`}
                    onClick={() => setRating(v)}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
            {(q.scaleLabels || []).length ? (
              <div className="text-xs text-gray-600">
                {q.scaleLabels.join(" · ")}
              </div>
            ) : null}
          </div>
        )}

        {q.type === "star" && (
          <div className="flex gap-1 items-center flex-wrap">
            {Array.from({ length: max }).map((_, i) => (
              <button
                key={i}
                aria-label={`Star ${i + 1}`}
                onClick={() => setStars(i + 1)}
                className="p-1"
              >
                <span
                  className={i + 1 <= stars ? "text-amber-500" : "text-gray-300"}
                  style={{ fontSize: 20 }}
                >
                  ★
                </span>
              </button>
            ))}
            {(q.scaleLabels || []).length ? (
              <div className="text-xs text-gray-600 ml-2">
                {q.scaleLabels.join(" · ")}
              </div>
            ) : null}
          </div>
        )}

        {q.type === "matrix" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left"> </th>
                  
                  {(q.scaleLabels || []).map((c, i) => (
                    <th key={i} className="border px-2 py-1 text-center">
                      <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(c || `Col ${i + 1}`) }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(q.matrixRows || []).map((r, ri) => (
                  <tr key={ri}>     
<td className="border px-2 py-1">
  <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(r || `Row ${ri + 1}`) }} />
</td>
                    {(q.scaleLabels || []).map((_, ci) => (
                      <td key={ci} className="border px-2 py-1 text-center">
                        <input type="radio" name={`m-${ri}`} />
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