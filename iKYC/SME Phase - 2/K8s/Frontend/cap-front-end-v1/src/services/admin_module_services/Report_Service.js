import { GET_ALL_ASSESSMENTS_URL, GET_ASSESSMENTS_TYPE_URL, GET_BATCH_REPORT_URL, GET_INDIVIDUAL_USERS_REPORT_URL, GET_KNOWLEDGE_ASSESSMENT_SCHEDULED_COUNT_URL, GET_KNOWLEDGE_BATCH_ASSESSMENT_WISE_USER_REPORT_URL, GET_OVERALL_BATCH_REPORT_URL, GET_SKILL_ASSESSMENT_SCHEDULED_COUNT_URL, GET_SKILL_BATCH_USER_REPORT_URL, GET_UNMAPPED_USER_KNOWLEDGE_REPORT_URL, GET_UNMAPPED_USER_SKILL_REPORT_URL, REPORT_BASE_URL, UNMAPPED_USER_GRAPH_REPORT_URL } from "../../constants/admin_module_constants/APIConstants";
import axiosInstance from "../axiosInstance";

export const getIndividualUsersReport = (schedulingId, type) => {
    try {
        return axiosInstance.get(`${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_INDIVIDUAL_USERS_REPORT_URL}${schedulingId}/${type}`);
    } catch (error) {
        return error;
    }
}

export const getAllAssessments = (type) => {
    try {
        return axiosInstance.get(`${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_ALL_ASSESSMENTS_URL}${type}`);
    } catch (error) {
        return error;
    }
}


export const getUnMappedUserSkillReportService = () => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_UNMAPPED_USER_SKILL_REPORT_URL}`
        );
    } catch (error) {
        return error;

    };
}



export const getUnMappedUserKnowledgeReportService = () => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_UNMAPPED_USER_KNOWLEDGE_REPORT_URL}`
        );
    } catch (error) {
        return error;
    }
};

export const unMappedUserGraphReport = () => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${UNMAPPED_USER_GRAPH_REPORT_URL}`
        );
    } catch (error) {
        return error;
    }
};

export const getBatchReport = (batchId, type) => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_BATCH_REPORT_URL}${batchId}/${type}`
        );
    } catch (error) {
        return error;
    }
};

export const getKnowledgeBatchAssessmentWiseUserReport = (
    batchId,
    assessmentId
) => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_KNOWLEDGE_BATCH_ASSESSMENT_WISE_USER_REPORT_URL}${batchId}/${assessmentId}`
        );
    } catch (error) {
        return error;
    }
};


export const getSkillBatchUserReport = (batchId, assessmentId) => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_SKILL_BATCH_USER_REPORT_URL}${batchId}/${assessmentId}`
        );
    } catch (error) {
        return error;
    }
};

export const getOverAllBatchReport = (type) => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_OVERALL_BATCH_REPORT_URL}/${type}`
        );
    } catch (error) {
        return error;
    }
};


export const getKnowledgeAssessmentScheduledCount = () => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_KNOWLEDGE_ASSESSMENT_SCHEDULED_COUNT_URL}`
        );
    } catch (error) {
        return error;
    }
};

export const getSkillAssessmentScheduledCount = () => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_SKILL_ASSESSMENT_SCHEDULED_COUNT_URL}`
        );
    } catch (error) {
        return error;
    }
};

export const getAssessmentDetails = (data) => {
    try {
        return axiosInstance.get(
            `${process.env.REACT_APP_BASE_URL}${REPORT_BASE_URL}${GET_ASSESSMENTS_TYPE_URL}${data}`
        );
    } catch (error) {
        return error;
    }
};

