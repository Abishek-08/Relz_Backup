import React, { useEffect, useRef } from "react";

const App = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Set the MJPEG stream URL
    videoRef.current.src = "http://127.0.0.1:5000/live"; // Flask server URL for MJPEG stream
  }, []);

  return (
    <div>
      <h1>Live Object Detection Stream</h1>

      <img
        ref={videoRef}
        alt="Live Stream"
        width="640"
        height="480"
        style={{ border: "1px solid black" }}
      />
      {/* <video
        ref={videoRef}
        alt="Live Video Stream"
        controls
        autoPlay
        style={{ width: "100%", height: "auto" }}
      /> */}
    </div>
  );
};

export default App;
