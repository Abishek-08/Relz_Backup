import React from 'react'
import ReportTreeView from '../../components/admin_module_components/AssessementReports/ReportTreeView'
import AdminNavbar from '../../components/admin_module_components/AdminNavbar'
 
const ReportTreeViewPage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', scrollbarWidth: "none" }}>
  <AdminNavbar />
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box',marginTop:"20px" }}>
    {/* Adjust width dynamically based on AdminNavbar width */}
    <div style={{ flex: 1, overflowX: 'hidden' }}>
      <ReportTreeView />
    </div>
  </div>
</div>

  )
}
 
export default ReportTreeViewPage
 