import React from "react";
import UpdateProfile from "../../../components/user_module_components/user_components/UpdateProfile";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";

const UpdateView = () => {
  return (
    <div>
      <div className="position-fixed">
        <UserNavbar />
      </div>
      <div>
      <UpdateProfile />
      </div>
    </div>
  );
};

export default UpdateView;