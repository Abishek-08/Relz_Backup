import { useEffect, useRef, useState } from "react";

export default function DetectorControls({ channel }) {
  const [detectors, setDetectors] = useState({
    pose: true,
    hands: false,
    face: false,
  });

  // Handle checkbox change
  const handleToggle = (key) => {
    const updated = { ...detectors, [key]: !detectors[key] };
    setDetectors(updated);

    // Send update to FastAPI through data channel
    if (channel && channel.readyState === "open") {
      channel.send(
        JSON.stringify({
          command: "update_detectors",
          detectors: updated,
        })
      );
      console.log("Sent update:", updated);
    }
  };

  return (
    <div style={{ margin: "10px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Enable / Disable Detectors</h3>
      <label>
        <input
          type="checkbox"
          checked={detectors.pose}
          onChange={() => handleToggle("pose")}
        />
        Pose Detection
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={detectors.hands}
          onChange={() => handleToggle("hands")}
        />
        Hand Gesture
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={detectors.face}
          onChange={() => handleToggle("face")}
        />
        Face Movement
      </label>
    </div>
  );
}
