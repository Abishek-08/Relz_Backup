import React from "react";
import UserDashboard from "../../../components/user_module_components/user_components/UserDashboard";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";

const DashboardView = () => {
  return (
    <div>
      <div style={{ position: "fixed", zIndex: "1000" }}>
        <UserNavbar />
      </div>
      <div id="user_dashboard_view">
        <UserDashboard />
      </div>
    </div>
  );
};

export default DashboardView;
