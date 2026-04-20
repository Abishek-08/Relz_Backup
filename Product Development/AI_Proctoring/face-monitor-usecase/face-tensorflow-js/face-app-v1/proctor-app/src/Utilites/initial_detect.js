import { detectFaceMesh } from "./face_movement_detect";
import { facialRecognitionDetection } from "./face_recognition";

let noPersonTimer = null;
let noPersonSeconds = 0;

function startNoPersonTimer() {
  if (noPersonTimer === null) {
    noPersonTimer = setInterval(() => {
      noPersonSeconds++;
      console.log("No person detected for:", noPersonSeconds, "seconds");

      if (noPersonSeconds >= 60) {
        clearInterval(noPersonTimer);
        noPersonTimer = null;
        noPersonSeconds = 0;
        alert("Warning: No person detected for 1 minute!");
      }
    }, 1000);
  }
}

function resetNoPersonTimer() {
  if (noPersonTimer !== null) {
    clearInterval(noPersonTimer);
    noPersonTimer = null;
  }
  noPersonSeconds = 0;
}

export const validateDetection = (detections, video) => {
  const hasPerson = detections.some((detect) => detect["class"] === "person");

  // Check for phone
  detections.forEach((detect) => {
    if (detect["class"] === "cell phone") {
      alert("Mobile Phone is detected in the monitor screen");
    }
  });

  // Handle person detection logic
  const detectedPersonList = detections.filter(
    (detect) => detect["class"] === "person"
  );

  if (detectedPersonList.length === 0) {
    startNoPersonTimer();
  } else {
    resetNoPersonTimer(); // Reset the timer if any person is detected

    if (detectedPersonList.length > 1) {
      alert("Two Persons are Detected");
    } else {
      // detectedPersonList.forEach(async (prediction) => {
      //   console.log("Detected Person's Coordinates: ", prediction);
      //   await detectFaceMesh(video, (warning) => {
      //     console.log("warning: ", warning);
      //   });
      // });

      const loop = async () => {
        await detectFaceMesh(video, (warning) => {
          console.log("warning: ", warning);
        });
      };

      loop();
    }
  }
};
