import { getAssessmentConstant } from "../../../constants/skill_assessment_constants/assessment_report_constants/AssessmentReportConstants";
/**
 *@author Srinivasan.S 12113
 * @since 22-07-2023
 */

const getAssessmentResult = (action) => {
  return {
    type: getAssessmentConstant.GET_RESPONSES,
    payload: action,
  };
};

export { getAssessmentResult };
