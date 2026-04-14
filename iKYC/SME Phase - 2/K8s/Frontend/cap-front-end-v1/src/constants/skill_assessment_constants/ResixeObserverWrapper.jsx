import { useState } from "react";

export const ResizeObserverWrapper = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    const handleResizeObserverError = (error) => {
        if (error.name === 'ResizeObserverError') {
            setHasError(true);
        }
    };

    return (
        <div
            onResizeCapture={handleResizeObserverError}
            style={{ display: hasError ? 'none' : 'block' }}
        >
            {children}
        </div>
    );
};