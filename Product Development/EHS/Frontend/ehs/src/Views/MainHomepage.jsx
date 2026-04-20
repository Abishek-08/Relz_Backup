import React from "react";
import TopNavbar from "../Components/Navbar_Component/Top_Navbar";
import HomePage from "../Components/Homepage_Component/Homepage";

const MainHomepage = () => {
  return (
    <div>
      {/* Navbar stays on top */}
      <TopNavbar />

      {/* Main page content */}
      <HomePage />
    </div>
  );
};

export default MainHomepage;
