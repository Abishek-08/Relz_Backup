import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainHomepage from "../Views/MainHomepage";
import User_Login_Form from "../Components/User_Component/User_Login_Form";
import Top_Navbar from "../Components/Navbar_Component/Top_Navbar";
import User_Registration_Form from "../Components/User_Component/User_Registration_Form";
import Test from "../Test";
import Admin_Main_Dashboard from "../Components/Admin_Components/Dashboard/Admin_Dashboard/Admin_Main_Dashboard";
import SolutionsPage from "../Components/Admin_Components/Dashboard/Admin_Solutions/SolutionsPage";
import ForgetPassword from "../Components/Admin_Components/Dashboard/Admin_Authentication/ForgetPassword";
import ResetPassword from "../Components/Admin_Components/Dashboard/Admin_Authentication/ResetPassword";
import ProfileLock from "../Components/Admin_Components/Dashboard/Admin_Authentication/ProfileLock";
import PPE_Admin_Main_Dashboard from "../Components/Applications/PPE_Detection/Dashboard/PPE_Admin_Main_Dashboard";
import Fall_Admin_Main_Dashboard from "../Components/Applications/Fall_Detection/Fall_Admin_Main_Dashboard";

import PARKING_Admin_Main_Dashboard from "../Components/Applications/Vehicle_Detection/Dashboard/PARKING_Admin_Main_Dashboard";
import COUNTING_Admin_Main_Dashboard from "../Components/Applications/Product_Counting/Dashboard/COUNTING_Admin_Main_Dashboard";
import CONVEYOR_Admin_Main_Dashboard from "../Components/Applications/Conveyor_Belt_Detection/Dashboard/CONVEYOR_Admin_Main_Dashboard";

const MainRouter = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  return (
    <div>
      <BrowserRouter basename={baseUrl}>
        <Routes>
          <Route element={<MainHomepage />} path="/" />
          <Route element={<Top_Navbar />} path="/tnav" />
          <Route element={<Admin_Main_Dashboard />} path="/admindash" />
          <Route element={<User_Registration_Form />} path="/signup" />
          <Route element={<User_Login_Form />} path="/signin" />
          <Route element={<SolutionsPage />} path="/solutions" />
          <Route element={<Test />} path="/test" />
          <Route element={<ForgetPassword />} path="/forget-password" />
          <Route element={<ResetPassword />} path="/reset-password" />
          <Route element={<ProfileLock />} path="/profile-lock" />
          <Route element={<PPE_Admin_Main_Dashboard />} path="/ppe-dash" />
          <Route element={<Fall_Admin_Main_Dashboard />} path="/fall-dash" />
          <Route
            element={<PARKING_Admin_Main_Dashboard />}
            path="/parking-dash"
          />
          <Route
            element={<COUNTING_Admin_Main_Dashboard />}
            path="/counting-dash"
          />
          <Route
            element={<CONVEYOR_Admin_Main_Dashboard />}
            path="/conveyor-dash"
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default MainRouter;
