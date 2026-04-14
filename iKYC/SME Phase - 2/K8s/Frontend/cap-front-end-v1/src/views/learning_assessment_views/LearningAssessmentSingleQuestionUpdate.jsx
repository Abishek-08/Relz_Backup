import React from 'react'
import Adminnavbar from '../admin_module_views/Adminnavbar'
import SingleQuestionUpdate from '../../components/learningassessment_module_components/SingleQuestionUpdate'

const LearningAssessmentSingleQuestionUpdate = () => {
  return (
    <div className='fluid d-flex '>
      <Adminnavbar />
      <div className='container-fluid d-flex justify-content-center'>
      <SingleQuestionUpdate />
      </div>
    </div>
  )
}

export default LearningAssessmentSingleQuestionUpdate
