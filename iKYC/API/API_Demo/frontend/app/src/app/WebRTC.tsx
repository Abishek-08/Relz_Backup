"use client";
import { useEffect, useRef, useState } from "react";

export default function WebRTC() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [log, setLog] = useState<string>("Waiting for detection...");
  const [channel, setChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection();
    const channel = pc.createDataChannel("detection");
    setChannel(channel);

    channel.onopen = () => console.log("✅ Data channel open");
    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLog(JSON.stringify(data, null, 2));
      } catch {}
    };

    async function initWebcam() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const resp = await fetch("https://www.ikyc.local/v1/ikyc/webrtc/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pc.localDescription),
      });

      const answer = await resp.json();
      await pc.setRemoteDescription(answer);
    }

    initWebcam();

    return () => {
      pc.close();
    };
  }, []);

  // ✅ Toggle detectors
  const toggleDetector = (detector: string) => {
    if (channel && channel.readyState === "open") {
      channel.send(JSON.stringify({ enable: [detector] }));
      console.log("🔧 Requested enable:", detector);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Real-Time Multi Detection</h1>
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div className="mt-4 space-x-2">
        <button
          className="bg-red-400 rounded-lg p-2"
          onClick={() => toggleDetector("pose")}
        >
          Enable Pose
        </button>
        <button
          className="bg-blue-400 rounded-lg p-2"
          onClick={() => toggleDetector("hands")}
        >
          Enable Hands
        </button>
        <button
          className="bg-green-400 rounded-lg p-2"
          onClick={() => toggleDetector("blink")}
        >
          Enable Blink
        </button>
        <button
          className="bg-green-400 rounded-lg p-2"
          onClick={() =>
            channel?.send(JSON.stringify({ command: "reset_blink" }))
          }
        >
          Reset Blink status
        </button>
      </div>

      <h2 className="mt-4 font-semibold">Detection JSON:</h2>
      <pre className="mt-2 p-2 bg-gray-200 rounded h-64 overflow-y-scroll text-xs">
        {log}
      </pre>
    </div>
  );
}
