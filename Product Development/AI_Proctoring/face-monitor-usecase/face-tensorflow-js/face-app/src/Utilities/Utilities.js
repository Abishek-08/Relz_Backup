export const drawRect = (detections, ctx) => {
  const personList = detections.filter(
    (detect) => detect["class"] === "person"
  );

  if (personList.length > 1) {
    console.log("Two persons are detected");
  } else {
    personList.forEach((prediction) => {
      // Get Prediction Results
      const [x, y, width, height] = prediction["bbox"];
      const text = prediction["class"];

      // set styling
      const color = "red";
      ctx.strokeStyle = color;
      ctx.font = "22px Arial";
      ctx.fillStyle = color;

      // Draw Rectangle and text
      ctx.beginPath();
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    });
  }
};


