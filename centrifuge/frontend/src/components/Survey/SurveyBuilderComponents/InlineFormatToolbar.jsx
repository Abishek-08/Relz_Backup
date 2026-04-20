import React, { useCallback, useEffect, useState } from "react";
import { Bold, Italic, Underline, CornerDownLeft } from "lucide-react";

export default function InlineFormatToolbar({ inputRef, value, onChange }) {
  const [state, setState] = useState({ b: false, i: false, u: false });

  const updateQueryStates = useCallback(() => {
    requestAnimationFrame(() => {
      try {
        const el = inputRef?.current;
        const sel = window.getSelection();
        if (!el || !sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (!el.contains(range.commonAncestorContainer)) return;
        setState({
          b: document.queryCommandState("bold"),
          i: document.queryCommandState("italic"),
          u: document.queryCommandState("underline"),
        });
      } catch {}
    });
  }, [inputRef]);

  useEffect(() => {
    document.addEventListener("selectionchange", updateQueryStates);
    return () => document.removeEventListener("selectionchange", updateQueryStates);
  }, [updateQueryStates]);

  const exec = (cmd) => {
    const el = inputRef?.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, null);
    updateQueryStates();
    try { onChange?.(el.innerHTML || ""); } catch {}
  };

  const insertBr = () => {
    const el = inputRef?.current;
    if (!el) return;
    el.focus();
    // IMPORTANT: insert a REAL <br> element
    document.execCommand("insertHTML", false, "<br>\u200B");
    try { onChange?.(el.innerHTML || ""); } catch {}
  };

  const btn = "p-1 rounded border hover:bg-gray-100 text-xs cursor-pointer";
  const active = "bg-[#27235c] text-white";

  return (
    <div className="flex items-center gap-1">
      <button type="button" className={`${btn} ${state.b ? active : ""}`} onClick={() => exec("bold")} title="Bold (Ctrl/Cmd + B)">
        <Bold size={14} />
      </button>
      <button type="button" className={`${btn} ${state.i ? active : ""}`} onClick={() => exec("italic")} title="Italic (Ctrl/Cmd + I)">
        <Italic size={14} />
      </button>
      <button type="button" className={`${btn} ${state.u ? active : ""}`} onClick={() => exec("underline")} title="Underline (Ctrl/Cmd + U)">
        <Underline size={14} />
      </button>
      <button type="button" className={btn} onClick={insertBr} title="Insert line break">
        <CornerDownLeft size={14} />
      </button>
    </div>
  );
}