import React from 'react'
import AdminNavbar from '../../components/admin_module_components/AdminNavbar'
import IndividualReports from '../../components/admin_module_components/AssessementReports/IndividualReports'

const IndividualReportsView = () => {
  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div style={{paddingTop: "5%"}}>
        <IndividualReports />
      </div>
    </div>
  )
}

export default IndividualReportsView
