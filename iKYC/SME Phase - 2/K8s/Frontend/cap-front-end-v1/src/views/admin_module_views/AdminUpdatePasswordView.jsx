import React from 'react';
import Adminnavbar from './Adminnavbar';
import AdminChangePassword from '../../components/admin_module_components/AdminUpdatePassword/AdminChangePassword';

const AdminUpdatePasswordView = () => {
  return (
    <div>
    <div className="position-fixed"> 
      <Adminnavbar />
    </div>
    <div id="update_password_component_user_module">
      <AdminChangePassword />
    </div>
  </div>
  )
}

export default AdminUpdatePasswordView
