import { CODE_ASSESSMENT_QUESTION, CUSTOM_RUN_CODE, MAP_CODING_QUESTION, RUN_CODE, SKILL_BASE_URL, SUBMIT_CODE } from "../../../constants/skill_assessment_constants/APIConstants";
import axiosInstance from "../../axiosInstance";



// api for get all scheduled questions
const mapCodingQuestion = (userId, schedulingId) => {
    return axiosInstance.post(
        `${SKILL_BASE_URL}${MAP_CODING_QUESTION}/${userId}/${schedulingId}`
    );
};

const getAssessmentCodingQuestion = (attemptId) => {
    return axiosInstance.get(
        `${SKILL_BASE_URL}${CODE_ASSESSMENT_QUESTION}/${attemptId}`
    );
};

const runCodeSkeleton = (formData) => {

    return axiosInstance.post(
        `${SKILL_BASE_URL}${RUN_CODE}`,
        formData,
        
    );
};
const submitCode = (formData) => {
    return axiosInstance.put(`${SKILL_BASE_URL}${SUBMIT_CODE}`,formData);
}

const runCustomInput = (formData) =>{
    return axiosInstance.post(`${SKILL_BASE_URL}${CUSTOM_RUN_CODE}`,formData)
}


export {
    getAssessmentCodingQuestion, mapCodingQuestion, runCodeSkeleton, runCustomInput, submitCode
};

