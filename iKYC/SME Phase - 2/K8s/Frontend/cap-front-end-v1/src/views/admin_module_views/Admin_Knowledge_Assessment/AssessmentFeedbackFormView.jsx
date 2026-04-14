import React from 'react'
import AdminNavbar from '../../../components/admin_module_components/AdminNavbar'
import AssessmentFeedbackForm from '../../../components/admin_module_components/ScheduleSkillAssessment/AssessmentFeedbackForm'

const AssessmentFeedbackFormView = () => {
  return (
    <div>
       <div className="container-fluid d-flex m-0 p-0" style={{backgroundColor: "#f5f5f5", height: "100vh", overflowY: "hidden"}}>
        <div>
          <AdminNavbar />
        </div>
        <div style={{ width: "100%", marginTop: "50px" }}>
          <AssessmentFeedbackForm />
        </div>
      </div>
    </div>
  )
}

export default AssessmentFeedbackFormView
