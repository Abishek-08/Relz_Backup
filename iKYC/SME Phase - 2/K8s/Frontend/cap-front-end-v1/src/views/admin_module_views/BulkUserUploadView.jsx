import React from 'react'
import AdminNavbar from '../../components/admin_module_components/AdminNavbar'
import BulkUserUpload from '../../components/admin_module_components/BulkUserUpload/BulkUserUpload'
import BulkUserUploadViewStyle from '../../styles/admin_module_styles/BulkUserUpload/BulkUserUploadViewStyle.css'
function BulkUserUploadView() {
    return (
        <div className='container-fluid d-flex m-0 p-0' style={{backgroundColor:"#f2f3f5", minHeight:"100vh", height:"auto"}}>
            <div className='Admin_Bulk_user_view_Upload_Navbar'>
                <AdminNavbar />
            </div>
            <div className='Admin_Bulk_user_view_upload_component' >
                <BulkUserUpload />
            </div>
        </div>
    )
}

export default BulkUserUploadView
