import React from "react";
import useWebWorker from "../../hooks/useWebWorker";

const Worker_Component = () => {
  // Inline worker logic (runs inside the worker)
  function workerFunction(e) {
    const data = e.data;
    var num = 0;
    for (var i = 1; i <= data; i++) {
      num = num + i;
    }

    const processed = `Received in worker: ${num}`;
    postMessage(processed);
  }

  const { result, loading, error } = useWebWorker(workerFunction, 10000000000);

  // Without worker.js
  //   const sumOfNum = (n) => {
  //     var num = 0;
  //     for (let i = 0; i < n; i++) {
  //       num = num + i;
  //     }
  //     return num;
  //   };

  return (
    <div>
      <h1>Web Worker Example with Vite</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <h2>{result}</h2>}

      {/* <p>
        sum of Number:{" "}
        {sumOfNum(
          10000000000
        )}
      </p> */}
    </div>
  );
};

export default Worker_Component;
