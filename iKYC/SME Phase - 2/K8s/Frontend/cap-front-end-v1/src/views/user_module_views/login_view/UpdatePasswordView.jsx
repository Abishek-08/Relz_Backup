import React from "react";
import UpdatePasswordComponent from "../../../components/user_module_components/login_components/UpdatePasswordComponent";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";

const UpdatePasswordView = () => {
  return (
    <div>
      <div className="position-fixed"> 
        <UserNavbar />
      </div>
      <div id="update_password_component_user_module">
        <UpdatePasswordComponent />
      </div>
    </div>
  );
};

export default UpdatePasswordView;
