import { assessmentConstants } from "../../../constants/skill_assessment_constants/assessment_view_constants/CodingAssessmentActionType";
import { getQuestionRequest } from "../../../constants/skill_assessment_constants/coding_question_ constants/ViewCodeActionType";

/**
 * @author: Srinivasan S - 12113
 * @since: 06-07-2024
 *
 */

const initialState = {
  questionId: 0,
  questionTitle: "",
  questionDescription: "",
  currentQuestion: 0,
};

export const CodeAssessmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case getQuestionRequest.GET_CODE_ASSESSMENT_QUESTION:
      return {
        ...state,
        ...action.payload,
      };
    case getQuestionRequest.RESET_CODE_ASSESSMENT_QUESTION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const currentState = {
  languageName: "",
  codeSkeleton: ""
};

export const CurrentLanguageSkeleton = (state = currentState, action) => {
  switch (action.type) {
    case assessmentConstants.GET_CURRENT_LANGUAGE_SKELETON:
      return {
        ...state,
        ...action.payload
      }
    case assessmentConstants.RESET_CURRENT_LANGUAGE_SKELETON:
      return {
        ...currentState,
      }
    default:
      return state;
  }
};