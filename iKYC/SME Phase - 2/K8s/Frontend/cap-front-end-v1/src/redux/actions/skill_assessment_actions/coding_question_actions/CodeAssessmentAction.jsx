import { getQuestionRequest } from "../../../constants/skill_assessment_constants/coding_question_ constants/ViewCodeActionType";
/**
 * @author Srinivasan S - 12113
 * @since: 06-07-2024
 *
 */

const getCodeAssessmentQuestions = (question) => {
  return {
    type: getQuestionRequest.GET_CODE_ASSESSMENT_QUESTION,
    payload: question,
  };
};

const resetCodeAssessmentQuestions = () => {
  return {
    type: getQuestionRequest.RESET_CODE_ASSESSMENT_QUESTION,
  };
};



export { getCodeAssessmentQuestions, resetCodeAssessmentQuestions };

