import React from 'react'
import LearningDetailReportAdminSide from '../../components/learningassessment_module_components/LearningDetailReportAdminSide'
import AdminNavbar from '../../components/admin_module_components/AdminNavbar'

const LearningDetailedReportsAdminSide = () => {
  return (
    <div className="fluid d-flex">
  <AdminNavbar className="col-md-2" />
  <div className="col-md-10 justify-content-center">
    <LearningDetailReportAdminSide />
  </div>
</div>

  )
}

export default LearningDetailedReportsAdminSide
