import React, { useEffect, useState } from "react";
import FaceApp from "./Components/FaceApp";
import FaceMesh from "./Components/FaceMesh";
import FaceMesh2 from "./Components/FaceMesh2";
import FaceRecognition from "./Components/FaceRecognition";
import NoiseDetector from "./Components/NoiseDetector";
import Custom_Object_Detection from "./Components/Custom_Object_Detection";
import Multiple_Face_Image_Recognition from "./Components/Multiple_Face_Image_Recognition";

const App = () => {
  return (
    <div>
      <h1>Face App</h1>
      {/* <FaceApp /> */}
      {/* <FaceMesh /> */}
      {/* <FaceMesh2 /> */}
      {/* <FaceRecognition /> */}
      {/* <NoiseDetector /> */}
      {/* <Custom_Object_Detection /> */}
      <Multiple_Face_Image_Recognition />
    </div>
  );
};

export default App;
