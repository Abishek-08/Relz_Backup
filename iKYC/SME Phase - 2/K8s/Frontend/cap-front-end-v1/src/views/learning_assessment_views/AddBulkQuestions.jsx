import React from 'react'
import BulkQuestionUpload from '../../components/learningassessment_module_components/bulk_question_upload/BulkQuestionUpload';
import Adminnavbar from '../admin_module_views/Adminnavbar'

const AddBulkQuestions = () => {
  return (
    <div className="container-fluid d-flex m-0 p-0" style={{backgroundColor:'#f2f3f5'}}>
      <Adminnavbar />
      <BulkQuestionUpload />
    </div>
  )
}

export default AddBulkQuestions
