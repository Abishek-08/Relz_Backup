import React from "react";
import ViewAllCodingQuestion from "../../../components/skill_assessment_components/coding_question_components/ViewAllCodingQuestion";
import AdminNavbar from "../../../components/admin_module_components/AdminNavbar";
import { ToastContainer } from "react-toastify";

const AllCodingQuestionView = () => {
  return (
    <div className="d-flex" style={{ backgroundColor: "#f2f3f5", maxHeight: "auto", minHeight: "100vh" }}>
      <div>
        <AdminNavbar />
        <ToastContainer />
      </div>
      <div className="w-100 mt-5">
        <ViewAllCodingQuestion />
      </div>
    </div>
  );
};

export default AllCodingQuestionView;
