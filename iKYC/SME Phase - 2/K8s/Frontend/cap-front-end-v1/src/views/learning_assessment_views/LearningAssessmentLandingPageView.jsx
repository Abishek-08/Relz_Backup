import React from 'react'
import UserNavbar from '../../components/user_module_components/user_components/UserNavbar'
import LearningAssessmentLandingPage from '../../components/learningassessment_module_components/learningassessmentengine/LearningAssessmentLandingPage'

const LearningAssessmentLandingPageView = () => {
  return (
    <div className="fluid d-flex">
      <UserNavbar />
      <LearningAssessmentLandingPage />
    </div>
  )
}

export default LearningAssessmentLandingPageView
