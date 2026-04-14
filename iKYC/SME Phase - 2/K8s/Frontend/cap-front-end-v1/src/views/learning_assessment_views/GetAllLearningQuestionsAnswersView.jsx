import React from "react";
import GetAllLearningAssessment from "../../components/learningassessment_module_components/GetAllLearningAssessment";
import Adminnavbar from "../admin_module_views/Adminnavbar";

const GetAllLearningQuestionsAnswersView = () => {
  return (
    <div
      className="fluid d-flex"
      style={{ backgroundColor: "#f2f3f5", minHeight: "100vh", height: "auto" }}
    >
      <Adminnavbar />
      <GetAllLearningAssessment />
    </div>
  );
};

export default GetAllLearningQuestionsAnswersView;
