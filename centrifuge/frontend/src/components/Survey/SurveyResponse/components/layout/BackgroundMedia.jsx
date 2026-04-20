import React, { useMemo, useRef, useEffect } from "react";
import floatingGif from "/assets/SurveyDefaultTheme.gif";

export default function BackgroundMedia({ backgroundTheme, paused = false }) {
  const vidRef = useRef(null);

  const { src, isGif } = useMemo(() => {
    const DEFAULT_THEME = "default theme selected";

    if (backgroundTheme === undefined || backgroundTheme === null) {
      return { src: null, isGif: false, loading: true };
    }

    const base = import.meta.env.VITE_BACKEND_BASE_URL || "";
    const path = import.meta.env.VITE_BACKGROUND_VIDEO_PATH || "";
    const theme = backgroundTheme.trim().toLowerCase();

    // If theme is default → show fish (only AFTER theme arrives)
    if (!theme || theme === DEFAULT_THEME) {
      return { src: floatingGif, isGif: true };
    }

    // Build URL from backend
    const isGif = theme.endsWith(".gif");
    const file = /\.(mp4|gif|webm|png|jpe?g)$/i.test(theme)
      ? backgroundTheme
      : `${backgroundTheme}.mp4`;

    const full = `${base}${path}/${encodeURIComponent(file)}`;

    return { src: full, isGif };
  }, [backgroundTheme]);

  useEffect(() => {
    if (!vidRef.current) return;
    paused ? vidRef.current.pause() : vidRef.current.play().catch(() => {});
  }, [paused]);

  const baseStyle = {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    willChange: "transform",
    imageRendering: "auto",
  };

  // When waiting for theme → return null (GradientBackdrop behind will show)
  if (!src) return null;

  return isGif ? (
    <img
      src={src}
      alt=""
      className="fixed inset-0 z-[-1] w-full h-full object-cover"
      style={baseStyle}
    />
  ) : (
    <video
      ref={vidRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-[-1] w-full h-full object-cover"
      style={baseStyle}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
