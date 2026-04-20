import React, { useMemo, useRef, useState, useEffect } from "react";
import { sanitizeInlineHTML } from "../../../../../utils/richText";

export default function Dropdown({ options, value, onChange, disabled, primaryColor = "#27235c" }) {
  const normalized = useMemo(
    () =>
      (options || []).map((opt, i) =>
        typeof opt === "string"
          ? { value: opt, label: opt }
          : { value: opt.value ?? opt, label: opt.label ?? String(opt.value ?? i) }
      ),
    [options]
  );

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? normalized.filter(
          (o) =>
            String(o.label).toLowerCase().includes(s) ||
            String(o.value).toLowerCase().includes(s)
        )
      : normalized;
  }, [q, normalized]);

  useEffect(() => {
    const onDoc = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        document.getElementById("kiosk-dd-panel")?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const displayLabel = normalized.find((o) => o.value === value)?.label || "Select…";
  const displayHTML = sanitizeInlineHTML(displayLabel);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-3 rounded-lg bg-white border text-left hover:bg-gray-50"
        style={{ borderColor: `${primaryColor}33` }}
      >
        <span className="text-[#274c77]" dangerouslySetInnerHTML={{ __html: displayHTML }} />
      </button>

      {open && (
        <div
          id="kiosk-dd-panel"
          className="absolute left-0 top-full mt-1 w-full rounded-lg bg-white border shadow-xl max-h-48 sm:max-h-60 md:max-h-72 overflow-y-auto z-10"
          style={{ borderColor: `${primaryColor}33` }}
        >
          <div
            className="p-2 border-b"
            style={{ borderColor: `${primaryColor}22` }}
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
              style={{ borderColor: `${primaryColor}33` }}
            />
          </div>
          <div>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
            ) : (
              filtered.map((o) => {
                const active = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      active ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(o.label) }} />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
