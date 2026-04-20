import React, { useState, useEffect, useRef } from "react";

function NoiseDetector() {
  const [decibels, setDecibels] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const startAudioProcessing = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256; // Adjust as needed
        source.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateDecibels = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sumSquares = 0;
          for (let i = 0; i < bufferLength; i++) {
            sumSquares += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sumSquares / bufferLength);
          // Assuming a reference amplitude for dB calculation (e.g., 1 for uncalibrated)
          const db = 20 * Math.log10(rms / 1);
          setDecibels(db.toFixed(2));
          animationFrameIdRef.current = requestAnimationFrame(updateDecibels);
        };

        updateDecibels();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    startAudioProcessing();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Environmental Noise Level: {decibels} dB</h1>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: "45%" }}
        />
        {((decibels / 120) * 100).toFixed()} %
      </div>
    </div>
  );
}

export default NoiseDetector;
