import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play } from "lucide-react";

export default function ThemePreviewModal({
  open,
  onClose,
  file,
  defaultUrl = "/assets/fish.mp4",
}) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (file) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    } else {
      setUrl(defaultUrl);
    }
  }, [open, file, defaultUrl]);

  const isVideo = useMemo(() => {
    if (file) return file.type?.startsWith("video/");
    // default is fish.mp4 → treat as video
    return true;
  }, [file]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="inline-flex items-center gap-2 font-semibold text-[#27235c]">
                <Play size={16} />
                Background Theme preview
              </div>
              <button
                className="p-2 rounded hover:bg-gray-100 cursor-pointer "
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              {isVideo ? (
                <video
                  src={url}
                  autoPlay
                  controls
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={url}
                  alt="Theme"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
