"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [log, setLog] = useState<string>("Waiting for detection...");

  useEffect(() => {
    const pc = new RTCPeerConnection();

    // 1️⃣ Create DataChannel
    const channel = pc.createDataChannel("detection");
    channel.onopen = () => console.log("✅ Data channel open");
    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLog(JSON.stringify(data, null, 2));
      } catch {
        console.warn("Non-JSON message:", event.data);
      }
    };

    // 2️⃣ Capture webcam
    async function initWebcam() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      // Add all tracks to PeerConnection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3️⃣ Create offer AFTER adding tracks
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 4️⃣ Send offer to FastAPI
      const resp = await fetch("http://localhost:8088/webrtc/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pc.localDescription),
      });
      const answer = await resp.json();
      await pc.setRemoteDescription(answer);
    }

    initWebcam();

    pc.onconnectionstatechange = () =>
      console.log("PC connection state:", pc.connectionState);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Real-Time Pose Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="border rounded w-80"
      />
      <h2 className="mt-4 font-semibold">Detection JSON Output:</h2>
      <pre className="mt-2 p-2 bg-gray-200 rounded h-64 overflow-y-scroll text-xs">
        {log}
      </pre>
    </div>
  );
}
