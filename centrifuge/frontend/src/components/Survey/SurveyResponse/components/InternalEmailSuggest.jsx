import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { createPortal } from "react-dom";
import { searchEmployeesByEmail } from "../../../../services/Services";
import { useSyncStatusContext } from "../../../../context/SyncStatusContext";

export default function InternalEmailSuggest({
  onPick,
  onValidityChange,
  onChange,
  domain = "relevantz.com",
  primaryColor = "#27235c",
}) {
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [hi, setHi] = useState(-1);
  const inputRef = useRef(null);
  const [rect, setRect] = useState(null);
  const panelRef = useRef(null);
  const itemsRef = useRef([]);

  // PWA-Implement
  const { status } = useSyncStatusContext();

  useEffect(() => {
    itemsRef.current = [];
  }, [list]);

  // gentle validation
  useEffect(() => {
    const isComplete = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const org = new RegExp(`^[\\w.%+-]+@${domain.replace(".", "\\.")}$`, "i");
    const valid = value.trim() && isComplete && org.test(value);
    setError(
      isComplete && !org.test(value)
        ? `Please enter a valid organization email (@${domain})`
        : "",
    );
    onValidityChange?.(!!valid);
  }, [value, domain, onValidityChange]);

  // Rank results so query hits show first
  const rankAndSet = (arr, q) => {
    const s = q.toLowerCase();
    const ranked = [...arr].sort((a, b) => {
      const ai = (a.email || "").toLowerCase().indexOf(s);
      const bi = (b.email || "").toLowerCase().indexOf(s);
      if (ai === -1 && bi !== -1) return 1;
      if (ai !== -1 && bi === -1) return -1;
      if (ai !== -1 && bi !== -1 && ai !== bi) return ai - bi;
      // tie-break by fullName/email alpha
      return (a.fullName || a.email || "").localeCompare(
        b.fullName || b.email || "",
      );
    });
    setList(ranked);
  };

  // debounced suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!value.trim()) {
        setList([]);
        return;
      }
      try {
        if (status === "idle" || status === "online") {
          const res = await searchEmployeesByEmail(value);
          const data = Array.isArray(res?.data)
            ? res.data
            : res?.data?.data || [];
          const cleaned = data
            .filter((x) => x?.email && x.email.trim() !== "")
            .map((x) => ({ fullName: x.fullName, email: x.email }));
          const unique = Array.from(
            new Map(cleaned.map((item) => [item.email, item])).values(),
          );
          rankAndSet(unique, value);
        }
      } catch (e) {
        console.error("suggest error:", e);
        setList([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  useEffect(() => {
    itemsRef.current = [];
  }, [list]);

  useEffect(() => {
    const el = itemsRef.current[hi];
    if (el && panelRef.current) el.scrollIntoView({ block: "nearest" });
  }, [hi]);

  const onFocus = () => {
    setOpen(true);
    const r = inputRef.current?.getBoundingClientRect();
    setRect(r || null);
  };

  useEffect(() => {
    const panel = document.getElementById("internal-email-portal");
    const item = itemsRef.current[hi];
    if (panel && item && typeof item.scrollIntoView === "function") {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [hi]);

  useEffect(() => {
    const onDoc = (e) => {
      const panel = document.getElementById("internal-email-portal");
      if (
        (panel && panel.contains(e.target)) ||
        (inputRef.current && inputRef.current.contains(e.target))
      )
        return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const onKeyDown = (e) => {
    if (!open || !list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, list.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter" && hi >= 0 && list[hi]) {
      e.preventDefault();
      const it = list[hi];
      setValue(it.email);
      onPick?.(it.email, it.fullName);
      setOpen(false);
      setHi(-1);
    }
  };

  return (
    <>
      <div ref={inputRef} className="relative w-full">
        <Mail
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
        />
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={`name@${domain}`}
          className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 ${error ? "border-red-400" : "border-gray-200"} bg-white text-gray-800 placeholder-gray-400 focus:border-[${primaryColor}] focus:outline-none`}
          autoCorrect="off"
          autoCapitalize="none"
          inputMode="email"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {open && list.length > 0 && (
          <div
            ref={panelRef}
            className="absolute left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-36 overflow-y-auto z-20"
          >
            {" "}
            {list.map((emp, idx) => (
              <div
                key={`${emp.email}-${idx}`}
                ref={(el) => (itemsRef.current[idx] = el)}
                className={`px-4 py-2 cursor-pointer ${hi === idx ? "bg-gray-100" : "hover:bg-gray-50"}`}
                onMouseEnter={() => setHi(idx)}
                onClick={() => {
                  setValue(emp.email);
                  onPick?.(emp.email, emp.fullName);
                  setOpen(false);
                  setHi(-1);
                }}
              >
                {" "}
                <div className="text-sm font-medium">
                  {emp.fullName || emp.email}
                </div>{" "}
                {emp.fullName && (
                  <div className="text-xs text-gray-500">{emp.email}</div>
                )}{" "}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
