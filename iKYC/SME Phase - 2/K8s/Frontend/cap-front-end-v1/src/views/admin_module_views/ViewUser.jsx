import React from "react";
import AdminNavbar from "../../components/admin_module_components/AdminNavbar";
import ViewAllUser from "../../components/admin_module_components/ViewAllUser";



const ViewUser = () => {

  return (
    <div className='container-fluid d-flex m-0 p-0' style={{backgroundColor:"#f2f3f5",maxHeight:"auto", minHeight:"100vh", overflowY: "hidden"}}>
      <div className="Admin_View_All_User_Admin_Navbar">
        <AdminNavbar />
        
      </div>
      <div className="Admin_View_All_User_Admin_Component" style={{width: "100%"}}>
        <ViewAllUser />
      </div>
    </div>
  )
}

export default ViewUser;

