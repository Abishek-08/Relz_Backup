import React, { useState, useEffect } from 'react';

function WindowDetection() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isScreenSplit, setIsScreenSplit] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      setIsWindowOpen(false);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isWideScreen = width >= 1200; // Adjust threshold as needed

      if (isWideScreen && height / width < 0.8) {
        setIsScreenSplit(true);
      } else {
        setIsScreenSplit(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const handleViolation = () => {
  //   // Implement your violation handling logic here
  //   console.log('Window opened or screen split detected');
  // };

  return (
    <div>
      {/* Your proctoring content */}
      {isWindowOpen || isScreenSplit ? (
        <div>Violation detected: Window opened or screen split</div>
      ) : null}
    </div>
  );
}

export default WindowDetection;