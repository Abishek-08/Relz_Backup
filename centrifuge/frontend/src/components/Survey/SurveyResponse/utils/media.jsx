export function computeBackgroundSource(surveyInfo) {
  const DEFAULT = "/assets/SurveyDefaultTheme.gif";
  const base = import.meta.env.VITE_BACKEND_BASE_URL || "";
  const path = import.meta.env.VITE_BACKGROUND_VIDEO_PATH || "";

  const theme = surveyInfo?.backgroundTheme;
  if (!theme || String(theme) === "Default Theme Selected") {
    return { mediaUrl: DEFAULT, isVideo: true, mediaType: "video/mp4" };
  }

  let file = String(theme).trim();
  const lower = file.toLowerCase();

  // If the DB saved only a basename (no extension), assume mp4
  if (!/\.(gif|png|jpe?g|mp4|webm)$/i.test(lower)) {
    file = `${file}.mp4`;
  }

  const url = `${base}${path}/${encodeURIComponent(file)}`;

  if (/\.(gif|png|jpe?g)$/i.test(lower)) {
    return { mediaUrl: url, isVideo: false, mediaType: null };
  }
  return {
    mediaUrl: url,
    isVideo: true,
    mediaType: lower.endsWith(".webm") ? "video/webm" : "video/mp4",
  };
}

export function shouldUseStaticMedia(isVideo, url) {
  if (!isVideo) return true;
  if (!url) return true;
  try {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const type = conn?.effectiveType || "";
    if (["slow-2g", "2g"].includes(type)) return true;
  } catch {}
  return false;
}

export function pickPoster(url) {
  if (!url) return "";
  try {
    if (url.endsWith(".mp4")) return url.replace(/\.mp4$/i, ".jpg");
    if (url.endsWith(".webm")) return url.replace(/\.webm$/i, ".jpg");
  } catch {}
  return "";
}

export function toMs(value, unit = "seconds") {
  if (!value) return 0;
  const v = Number(value);
  if (!Number.isFinite(v)) return 0;
  const u = (unit || "seconds").toLowerCase();
  if (u.startsWith("hour")) return v * 60 * 60 * 1000;
  if (u.startsWith("minute")) return v * 60 * 1000;
  return v * 1000;
}
