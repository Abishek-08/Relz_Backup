// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { sanitizeInlineHTML, stripInlineTags } from "../../../utils/richText";

// export default function InlineRichInput({
//   value = "",
//   onChange,
//   placeholder = "",
//   className = "",
//   style = {},
//   maxHeight = 120,
//   minHeight = 40,
//   autoFocus = false,
//   refHook, // { current: HTMLElement }
// }) {
//   const divRef = useRef(null);
//   const [isFocused, setIsFocused] = useState(false);

//   useEffect(() => {
//     if (refHook) refHook.current = divRef.current;
//   }, [refHook]);

//   useLayoutEffect(() => {
//     const el = divRef.current;
//     if (!el || isFocused) return;
//     const safe = sanitizeInlineHTML(value || "");
//     if (el.innerHTML !== safe) el.innerHTML = safe || "";
//   }, [value, isFocused]);

//   useEffect(() => { if (autoFocus) divRef.current?.focus(); }, [autoFocus]);

//   const emit = () => {
//     const el = divRef.current;
//     if (!el) return;
//     const safe = sanitizeInlineHTML(el.innerHTML || "");
//     if (safe !== value) onChange?.(safe);
//   };

//   const onInput = () => emit();

//   const onPaste = (e) => {
//     e.preventDefault();
//     const el = divRef.current;
//     if (!el) return;
//     const cd = e.clipboardData || window.clipboardData;
//     let raw = cd ? cd.getData("text/html") || cd.getData("text/plain") || "" : "";
//     const injected = sanitizeInlineHTML(String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
//     insertAtCaret(injected);
//     emit();
//   };

//   const onKeyDown = (e) => {
//     const k = e.key.toLowerCase();

//     if ((e.ctrlKey || e.metaKey) && (k === "b" || k === "i" || k === "u")) {
//       e.preventDefault();
//       ensureSelectionInside(divRef.current);
//       document.execCommand(k === "b" ? "bold" : k === "i" ? "italic" : "underline", false, null);
//       emit();
//       return;
//     }

//     if (k === "enter") {
//       e.preventDefault();
//       ensureSelectionInside(divRef.current);
//     //   insertAtCaret("<div><br></div>");
//     document.execCommand("insertParagraph");
//       emit();
//     }
//   };

//   function insertAtCaret(html) {
//     const el = divRef.current;
//     if (!el) return;
//     el.focus();
//     const sel = window.getSelection();
//     if (!sel) return;

//     const range = sel.rangeCount ? sel.getRangeAt(0) : document.createRange();
//     if (!sel.rangeCount) {
//       range.selectNodeContents(el);
//       range.collapse(false);
//     }
//     range.deleteContents();

//     const frag = range.createContextualFragment(html);
//     const lastNode = frag.lastChild;
//     range.insertNode(frag);

//     const newRange = document.createRange();
//     if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
//       newRange.setStart(lastNode, lastNode.length);
//       newRange.setEnd(lastNode, lastNode.length);
//     } else if (lastNode) {
//       newRange.setStartAfter(lastNode);
//       newRange.setEndAfter(lastNode);
//     } else {
//       newRange.setStart(el, el.childNodes.length);
//       newRange.setEnd(el, el.childNodes.length);
//     }
//     sel.removeAllRanges();
//     sel.addRange(newRange);
//   }

//   function ensureSelectionInside(el) {
//     if (!el) return;
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0) return focusToEnd(el);
//     const range = sel.getRangeAt(0);
//     if (!el.contains(range.commonAncestorContainer)) focusToEnd(el);
//   }

//   function focusToEnd(el) {
//     el.focus();
//     const range = document.createRange();
//     range.selectNodeContents(el);
//     range.collapse(false);
//     const sel = window.getSelection();
//     sel.removeAllRanges();
//     sel.addRange(range);
//   }

//   const showPlaceholder = !stripInlineTags(value).length && !isFocused;

//   return (
//     <div
//       className={className}
//       style={{
//         minHeight,
//         maxHeight,
//         overflowY: "auto",
//         outline: "none",
//         whiteSpace: "normal",
//         wordBreak: "break-word",
//         position: "relative",
//         ...style,
//         border: style.border || "1px solid #e5e7eb",
//         borderRadius: style.borderRadius || 6,
//         padding: style.padding || "8px 12px",
//         background: "#fff",
//       }}
//       onClick={() => {
//         if (document.activeElement !== divRef.current) {
//           try { focusToEnd(divRef.current); } catch {}
//         }
//       }}
//     >
//       <div
//         ref={divRef}
//         contentEditable
//         role="textbox"
//         onInput={onInput}
//         onPaste={onPaste}
//         onKeyDown={onKeyDown}
//         onFocus={() => setIsFocused(true)}
        
//         onBlur={() => {
//         setIsFocused(false);
//         const el = divRef.current;
//         if (el) {
//             const safe = sanitizeInlineHTML(el.innerHTML || "");
//             // write back sanitized HTML so <br> persist after blur
//             if (el.innerHTML !== safe) el.innerHTML = safe;
//             if (safe !== value) onChange?.(safe);
//         }
//         }}
//         style={{ minHeight: minHeight - 2, outline: "none", whiteSpace: "normal", wordBreak: "break-word" }}
//         aria-label={placeholder}
//       />
//       {showPlaceholder && (
//         <div style={{ position: "absolute", left: 12, top: 8, color: "#9CA3AF", pointerEvents: "none", fontSize: 14 }}>
//           {placeholder}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sanitizeInlineHTML, stripInlineTags } from "../../../utils/richText";

export default function InlineRichInput({
  value = "",
  onChange,
  placeholder = "",
  className = "",
  style = {},
  maxHeight = 120,
  minHeight = 40,
  autoFocus = false,
  refHook, // { current: HTMLElement }
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (refHook) refHook.current = divRef.current;
  }, [refHook]);

  useLayoutEffect(() => {
    const el = divRef.current;
    if (!el || isFocused) return;
    const safe = sanitizeInlineHTML(value || "");
    if (el.innerHTML !== safe) el.innerHTML = safe || "";
  }, [value, isFocused]);

  useEffect(() => { if (autoFocus) divRef.current?.focus(); }, [autoFocus]);

  const emit = () => {
    const el = divRef.current;
    if (!el) return;
    const safe = sanitizeInlineHTML(el.innerHTML || "");
    if (safe !== value) onChange?.(safe);
  };

  const onInput = () => emit();

  const onPaste = (e) => {
    e.preventDefault();
    const el = divRef.current;
    if (!el) return;
    const cd = e.clipboardData || window.clipboardData;
    let raw = cd ? cd.getData("text/html") || cd.getData("text/plain") || "" : "";
    const injected = sanitizeInlineHTML(String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
    insertAtCaret(injected);
    emit();
  };

  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && (k === "b" || k === "i" || k === "u")) {
      e.preventDefault();
      ensureSelectionInside(divRef.current);
      document.execCommand(k === "b" ? "bold" : k === "i" ? "italic" : "underline", false, null);
      emit();
      return;
    }

    if (k === "enter") {
      e.preventDefault();
      ensureSelectionInside(divRef.current);
      document.execCommand("insertParagraph");
      emit();
    }
  };

  function insertAtCaret(html) {
    const el = divRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;

    const range = sel.rangeCount ? sel.getRangeAt(0) : document.createRange();
    if (!sel.rangeCount) {
      range.selectNodeContents(el);
      range.collapse(false);
    }
    range.deleteContents();

    const frag = range.createContextualFragment(html);
    const lastNode = frag.lastChild;
    range.insertNode(frag);

    const newRange = document.createRange();
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      newRange.setStart(lastNode, lastNode.length);
      newRange.setEnd(lastNode, lastNode.length);
    } else if (lastNode) {
      newRange.setStartAfter(lastNode);
      newRange.setEndAfter(lastNode);
    } else {
      newRange.setStart(el, el.childNodes.length);
      newRange.setEnd(el, el.childNodes.length);
    }
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  function ensureSelectionInside(el) {
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return focusToEnd(el);
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) focusToEnd(el);
  }

  function focusToEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const showPlaceholder = !stripInlineTags(value).length && !isFocused;

  return (
    <div
      className={className}
      style={{
        minHeight,
        maxHeight,
        overflowY: "auto",
        outline: "none",
        whiteSpace: "normal",
        wordBreak: "break-word",
        position: "relative",
        ...style,
        border: style.border || "1px solid #e5e7eb",
        borderRadius: style.borderRadius || 6,
        padding: style.padding || "8px 12px",
        background: "#fff",
      }}
      onClick={() => {
        if (document.activeElement !== divRef.current) {
          try { focusToEnd(divRef.current); } catch {}
        }
      }}
    >
      <div
        ref={divRef}
        contentEditable
        role="textbox"
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          const el = divRef.current;
          if (el) {
            const safe = sanitizeInlineHTML(el.innerHTML || "");
            if (safe !== value) onChange?.(safe);
          }
        }}
        style={{ minHeight: minHeight - 2, outline: "none", whiteSpace: "normal", wordBreak: "break-word" }}
        aria-label={placeholder}
      />
      {showPlaceholder && (
        <div style={{ position: "absolute", left: 12, top: 8, color: "#9CA3AF", pointerEvents: "none", fontSize: 14 }}>
          {placeholder}
        </div>
      )}
    </div>
  );
}
