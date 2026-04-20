const ButtonLoader = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  style = {},
  className = "",
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={style}
      className={` text-white rounded-xl shadow-lg transition-all ${
        isDisabled ? "opacity-70" : "hover:bg-[#1f3a5c]"
      } ${className} disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <span>Submitting...</span>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoader;
