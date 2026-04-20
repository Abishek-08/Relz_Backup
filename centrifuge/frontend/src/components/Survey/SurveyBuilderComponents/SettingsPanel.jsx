import React from "react";
import {
  Timer,
  FileImage,
  UserIcon,
  Play,
  X,
  Edit,
  Handshake,
  PersonStanding,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../utils/useToast";

export default function SettingsPanel({
  responseMode,
  setResponseMode,
  emailMode,
  setEmailMode,
  themeChoice,
  setThemeChoice,
  themeFile,
  setThemeFile,
  onOpenThemePreview,
  isEditingTimeouts,
  setIsEditingTimeouts,
  thankyouTimeout,
  setThankyouTimeout,
  idleTimeoutValue,
  setIdleTimeoutValue,
  idleTimeoutUnit,
  setIdleTimeoutUnit,
  onSaveTimeouts,
  error,
}) {
  const { success } = useToast();

  const onThemePick = (f) => {
    if (!f) return;
    const okType = ["image/gif", "video/mp4"].includes(f.type);
    if (!okType) return error?.("Theme must be GIF or MP4.");
    if (f.size > 50 * 1024 * 1024) return error?.("Max file size is 50MB.");
    setThemeFile(f);
  };

  return (
    <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      {/* Response mode */}

      {/* Response mode */}
      <div className="bg-white rounded-xl shadow p-4">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded">
            <UserIcon />
          </span>
          <p className="text-sm font-medium text-gray-700">Response Mode</p>
        </div>

        {/* Options row */}
        <div className="flex flex-wrap rounded-lg overflow-hidden border">
          {["anonymous", "email"].map((m) => (
            <button
              key={m}
              onClick={() => setResponseMode(m)}
              className={`px-4 py-2 text-sm cursor-pointer flex-1 ${
                responseMode === m
                  ? "bg-[#274c77] text-white"
                  : "hover:bg-gray-100 bg-white"
              }`}
            >
              {m === "anonymous" ? "Anonymous" : "Email-based"}
            </button>
          ))}
        </div>

        {/* Extra row under Email with animation */}
        <AnimatePresence>
          {responseMode === "email" && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-gray-500 font-semibold mb-1">
                Respondent scope
              </p>
              <div className="flex flex-wrap rounded-lg overflow-hidden border">
                {["internal", "external"].map((em) => (
                  <label
                    key={em}
                    className="hover:bg-gray-100 flex items-center gap-2 px-3 py-2 cursor-pointer flex-1"
                  >
                    <input
                      type="radio"
                      name="email-mode"
                      checked={emailMode === em}
                      onChange={() => setEmailMode(em)}
                    />
                    <span className="text-sm">
                      {em[0].toUpperCase() + em.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-xl shadow p-4">
        {/* Label row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded">
            <FileImage />
          </span>
          <p className="text-sm font-semibold text-[#274c77]">
            Background theme
          </p>
        </div>

        {/* Options row */}
        <div className="flex flex-wrap rounded-lg overflow-hidden border">
          {["default", "custom"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setThemeChoice(opt);
                if (opt === "default") setThemeFile(null);
              }}
              className={`cursor-pointer flex-1 px-4 py-2 text-sm ${
                themeChoice === opt
                  ? "bg-[#274c77] text-white"
                  : "hover:bg-gray-100 bg-white"
              }`}
              aria-pressed={themeChoice === opt}
            >
              {opt[0].toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        {/* Upload ONLY when custom with animation */}
        <AnimatePresence>
          {themeChoice === "custom" && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-white hover:bg-gray-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onThemePick(e.dataTransfer.files?.[0]);
                }}
                onClick={() =>
                  document.getElementById("theme-file-input")?.click()
                }
                role="button"
                aria-label="Upload theme"
              >
                <p className="text-sm text-gray-700">
                  Drag & drop GIF/MP4 here or click to browse
                </p>
                <input
                  id="theme-file-input"
                  type="file"
                  hidden
                  accept="image/gif,video/mp4"
                  onChange={(e) => onThemePick(e.target.files?.[0])}
                />
              </div>

              {themeFile && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="truncate text-gray-700">
                    {themeFile.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="cursor-pointer px-2 py-1 border rounded inline-flex items-center gap-1 hover:bg-gray-100"
                      onClick={onOpenThemePreview}
                      aria-label="Preview theme"
                      title="Preview theme"
                    >
                      <Play className="w-4 h-4 text-[#274c77]" />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer px-2 py-1 border rounded inline-flex items-center gap-1 hover:bg-gray-100"
                      onClick={() => setThemeFile(null)}
                      aria-label="Remove theme"
                      title="Remove theme"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeouts */}

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#274c77] inline-flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px]">
              <Timer />
            </span>
            Timeouts
          </p>
          {!isEditingTimeouts && (
            <button
              type="button"
              className="text-sm border px-2 py-1 rounded cursor-pointer inline-flex items-center gap-1"
              onClick={() => setIsEditingTimeouts(true)}
              aria-label="Edit timeouts"
              title="Edit timeouts"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isEditingTimeouts ? (
            <motion.div
              key="view"
              className="mt-3 grid md:grid-cols-2 gap-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-lg border p-3">
                <p className="text-xs font-semibold text-gray-500">
                  <Handshake /> Thank you page timeout
                </p>
                <p className="text-sm font-medium">{thankyouTimeout || 0}s</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs font-semibold text-gray-500">
                  <PersonStanding /> Idle timeout
                </p>
                <p className="text-sm font-medium">
                  {idleTimeoutValue || 0} {idleTimeoutUnit}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              className="mt-3 space-y-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Thank you page timeout (1–30s)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={thankyouTimeout}
                  onChange={(e) =>
                    setThankyouTimeout(
                      (e.target.value || "").replace(/\D/g, "").slice(0, 2),
                    )
                  }
                  className="w-40 border rounded px-3 py-2"
                  placeholder="e.g 5"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Idle timeout (1–10h)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={idleTimeoutValue}
                    onChange={(e) =>
                      setIdleTimeoutValue(
                        (e.target.value || "").replace(/\D/g, "").slice(0, 2),
                      )
                    }
                    className="w-28 border rounded px-3 py-2"
                    placeholder={
                      idleTimeoutUnit === "hours" ? "e.g 1" : "e.g 10"
                    }
                  />
                  <select
                    value={idleTimeoutUnit}
                    onChange={(e) =>
                      setIdleTimeoutUnit(
                        e.target.value === "hours" ? "hours" : "minutes",
                      )
                    }
                    className="w-32 border rounded px-3 py-2"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="cursor-pointer bg-[#274c77] text-white px-4 py-2 rounded"
                  onClick={() => {
                    const ty = Number(thankyouTimeout);
                    if (!Number.isFinite(ty) || ty < 1 || ty > 30) {
                      return error(
                        "Thank you timeout must have an value between 0–30 seconds.",
                      );
                    }
                    const idle = Number(idleTimeoutValue);
                    if (idleTimeoutUnit === "minutes") {
                      if (!Number.isFinite(idle) || idle < 10 || idle > 99) {
                        return error(
                          "Idle timeout (minutes) must be between 10 and 99.",
                        );
                      }
                    } else {
                      if (!Number.isFinite(idle) || idle < 1 || idle > 10) {
                        return error(
                          "Idle timeout (hours) must be between 1 and 10.",
                        );
                      }
                    }
                    setIsEditingTimeouts(false);
                    success("Timeout settings saved successfully!");
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cursor-pointer border px-4 py-2 rounded"
                  onClick={() => setIsEditingTimeouts(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
