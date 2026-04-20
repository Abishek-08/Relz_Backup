import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Canditate_Registration_Main_Screen from "../Components/Candidate_Registration_Screens/Canditate_Registration_Main_Screen";
import Assessment_Proctoring_AI_Screen from "../Components/Assessment_Proctoring_Screens/Assessment_Proctoring_AI_Screen";
import AdminDashboard from "../Components/AdminScreens/AdminDashboard";
import Worker_Component from "../Components/Practice/Worker_Component";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Canditate_Registration_Main_Screen />} path="/" />
        <Route
          element={<Assessment_Proctoring_AI_Screen />}
          path="/assessment"
        />
        <Route element={<AdminDashboard />} path="/admin-dash" />
        <Route element={<Worker_Component />} path="/worker" />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
