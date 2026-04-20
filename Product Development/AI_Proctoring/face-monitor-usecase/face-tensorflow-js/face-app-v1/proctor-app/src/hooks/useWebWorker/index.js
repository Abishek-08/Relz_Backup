import { useCallback, useEffect, useState } from "react";

const useWebWorker = (workerFunction, inputData) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const memorizedWorkerFunction = useCallback(workerFunction, []);

  useEffect(() => {
    if (!memorizedWorkerFunction || inputData == null) return;

    setLoading(true);
    setError(null);

    try {
      const functionBody = memorizedWorkerFunction.toString();
      const blob = new Blob([`self.onmessage = ${functionBody}`], {
        type: "application/javascript",
      });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (e) => {
        setResult(e.data);
        setLoading(false);
      };

      worker.onerror = (e) => {
        setError(e.message);
        setLoading(false);
      };

      worker.postMessage(inputData);

      return () => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [memorizedWorkerFunction, inputData]);

  return { result, loading, error };
};

export default useWebWorker;
