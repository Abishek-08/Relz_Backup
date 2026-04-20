import { useEffect, useRef, useState } from "react";
import { detectFaceMesh, initFaceLandmarker } from "../Utilities/detectorMesh";

export default function FaceMesh2() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const animationRef = useRef();
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    async function start() {
      await initFaceLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadeddata = () => {
        runDetection();
      };
    }

    start();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const runDetection = async () => {
    const loop = async () => {
      await detectFaceMesh(videoRef.current, canvasRef.current, (warning) => {
        setWarning(warning); // setWarning from React state
      });
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline style={{ width: 480 }} />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {warning !== null && <h5>{warning}</h5>}
    </div>
  );
}
