import React from 'react'
import { SingleQuestionUploads } from '../../components/learningassessment_module_components/SingleQuestionUploads'
import Adminnavbar from '../admin_module_views/Adminnavbar'

const AddSingleQuestions = () => {
  return (
    <div className="fluid d-flex" style={{backgroundColor:'#f2f3f5' }}>
      <Adminnavbar />
      <SingleQuestionUploads />
    </div>
  )
}

export default AddSingleQuestions
