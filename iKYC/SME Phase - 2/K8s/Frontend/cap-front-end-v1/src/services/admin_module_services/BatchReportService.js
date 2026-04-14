import axiosInstance from "../axiosInstance";

// export const getSkillBatchReport = (batchId) => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/skillbatchreport/${batchId}`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getSkillBatchUserReport = (batchId, assessmentId) => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/skillbatchuserreport/${batchId}/${assessmentId}`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getKnowledgwBatchReport = (batchId) => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/learnbatchreport/${batchId}`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getKnowledgeBatchAssessmentWiseUserReport = (
//   batchId,
//   assessmentId
// ) => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/learnbatchuserreport/${batchId}/${assessmentId}`
//     );
//   } catch (error) {
//     return error;
//   }
// };

export const getAdminUserDetailReport = (schedulingId, userId) => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/learning/assessmentReport/${schedulingId}/${userId}`
    );
  } catch (error) {
    return error;
  }
};

// export const getSkillAssessmentReportGraphData = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/skilloverallreport`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getKnowledgeAssessmentReportGraphData = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/admin/learnoverallreport`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getUnMappedUserSkillReportService = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/unmappeduserskillreport`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getUnMappedUserKnowledgeReportService = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/unmappeduserknowledgereport`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getKnowledgeAssessmentScheduledCount = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/schedule/knowledgecount`
//     );
//   } catch (error) {
//     return error;
//   }
// };

// export const getSkillAssessmentScheduledCount = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/schedule/skillcount`
//     );
//   } catch (error) {
//     return error;
//   }
// };

export const getUserRequestCount = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/userrequest`
    );
  } catch (error) {
    return error;
  }
};
// export const unMappedUserGraphReport = () => {
//   try {
//     return axiosInstance.get(
//       `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/overallunmappedreport`
//     );
//   } catch (error) {
//     return error;
//   }
// };

export const getFeedback = () => {
  try {
    return axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/feedback`
    );
  } catch (error) {
    return error;
  }
};
export const getFeedbackUser = async (assessmentId) => {
  try {
    return await axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/feedback/${assessmentId}`
    );
  } catch (error) {
    return error;
  }
};

export const getLeaderboardDetails = async () =>{
  try {
    return await axiosInstance.get(
      `${process.env.REACT_APP_ADMIN_MODULE_BASE_URL}/user/leaderboard`
    );
  } catch (error) {
    return error;
  }
}