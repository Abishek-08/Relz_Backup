import React from "react";

const VARIANTS = {
  primary: "bg-[#27235c] text-white hover:bg-[#1f254d]",
  success: "bg-green-600 text-white hover:bg-green-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline:
    "border border-gray-300 text-gray-800 bg-white hover:bg-gray-50",
  ghost: "text-[#27235c] hover:bg-gray-50",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-5 py-2.5 rounded-xl",
};

export default function SurveyButtonLoader({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  style = {},
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  leadingIcon = null,
  trailingIcon = null,
  loadingLabel = "Submitting...",
  fullWidth = false,
  title,
  ariaLabel,
}) {
  const isDisabled = isLoading || disabled;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const sz = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={style}
      title={title}
      aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
      aria-busy={isLoading ? "true" : "false"}
      aria-live="polite"
      className={[
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        v,
        sz,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {isLoading ? (
        <>
          <span>{loadingLabel}</span>
          <span
            className={[
              "inline-block w-4 h-4 border-2 rounded-full animate-spin",
              // spinner color: white on solid variants, brand on outline/ghost
              variant === "outline" || variant === "ghost"
                ? "border-[#27235c] border-t-transparent"
                : "border-white border-t-transparent",
            ].join(" ")}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {leadingIcon ? <span className="inline-flex">{leadingIcon}</span> : null}
          {children}
          {trailingIcon ? <span className="inline-flex">{trailingIcon}</span> : null}
        </>
      )}
    </button>
  );
}