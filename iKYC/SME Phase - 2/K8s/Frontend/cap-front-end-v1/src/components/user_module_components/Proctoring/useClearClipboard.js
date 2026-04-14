import { useCallback } from "react";

const useClearClipboard = () => {
  const clearClipboard = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText("   ") // Set clipboard content to an empty string
        .then(() => {
          console.log("Clipboard cleared");
        })
        .catch((error) => {
          console.error("Failed to clear clipboard:", error);
        });
    } else {
      console.warn("Clipboard API not supported");
    }
  }, []);

  return clearClipboard;
};

export default useClearClipboard;
