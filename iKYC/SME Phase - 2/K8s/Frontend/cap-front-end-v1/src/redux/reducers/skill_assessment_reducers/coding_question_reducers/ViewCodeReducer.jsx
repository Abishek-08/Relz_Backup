import { getQuestionRequest } from "../../../constants/skill_assessment_constants/coding_question_ constants/ViewCodeActionType";


const initialState = {
  //example initial value
  question: [],
};

export const QuestionReducer = (state = initialState,action) => {
  switch (action.type) {
    case getQuestionRequest.GET_QUESTION:
      return {
        ...state,
        question: action.payload,
      };
    case getQuestionRequest.FILTER_BY_LANGUAGE:
      return {
        ...state,
        question: action.payload,
      };
      case getQuestionRequest.FILTER_BY_CATEGORY:
        return {
          ...state,
          question: action.payload,
        };
        case getQuestionRequest.FILTER_BY_LEVEL:
          return {
            ...state,
            question: action.payload,
          };
    default:
      return state;
  }
};
