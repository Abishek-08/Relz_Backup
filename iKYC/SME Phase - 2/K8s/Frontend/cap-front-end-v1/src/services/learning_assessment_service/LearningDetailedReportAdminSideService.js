import {DETAILED_REPORT_GETASSESSMENT_NAME, DETAILED_REPORT_GET_USERS, LEARNING_ASSESSMENT_REPORT} from "../../constants/knowledge_assessment_constants/APIConstants";
import axiosInstance from "../axiosInstance";




export const getAllAssessmentName=()=>{
    return axiosInstance.get(`${DETAILED_REPORT_GETASSESSMENT_NAME}`);
}

export const getAssessmentUserDetails = (assessmentId) => {
  return axiosInstance.get(`${DETAILED_REPORT_GETASSESSMENT_NAME}${DETAILED_REPORT_GET_USERS}/${assessmentId}`);
}

export const getUserDetailReport =(assessmentId,userId)=>{
    return axiosInstance.get(`${LEARNING_ASSESSMENT_REPORT}/${assessmentId}/${userId}`);
}

