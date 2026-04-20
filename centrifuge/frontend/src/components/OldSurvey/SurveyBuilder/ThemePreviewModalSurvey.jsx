import { X } from "lucide-react";
import { useEffect, useState } from "react";

function ThemePreviewModalSurvey({ open, onClose, file, choice }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (choice === "custom" && file) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [choice, file]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <p className="font-semibold text-[#27235c]">Theme Preview</p>
          <button className="p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="p-4">
          {choice === "custom" && file ? (
            file.type === "video/mp4" ? (
              <video src={url || ""} className="w-full rounded" controls muted loop />
            ) : (
              <img src={url || ""} className="w-full rounded" alt="Theme" />
            )
          ) : (
            <div className="text-sm text-gray-600">Default theme (no file selected)</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThemePreviewModalSurvey;