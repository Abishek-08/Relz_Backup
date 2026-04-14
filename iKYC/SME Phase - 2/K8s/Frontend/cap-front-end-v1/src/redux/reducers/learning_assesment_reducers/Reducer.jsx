import { ActionTypes } from "../../constants/learning_assessment_constants/ActionTypes";

const initialState = {
  questions: [],
  topics: [],
  currentQuestionIndex: 0,
  answer: {},
  selectedAnswers: {}, // Object to store answers by questionId
  flaggedQuestions: {}, //object to store flagged questions by questionId
  attemptedQuestions: [],
  quizCompleted: false,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_ALL_LEARNING_ASSESSMENT_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };

    case ActionTypes.FETCH_TOPICS_SUCCESS:
      return { ...state, topics: action.payload };

    case ActionTypes.DELETE_LEARNING_ASSESSMENT_QUESTIONS:
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question.questionId !== action.questionId
        ),
      };
    case ActionTypes.DISABLE_LEARNING_ASSESSMENT_QUESTIONS:
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.questionId === action.payload
            ? { ...question, disabled: true }
            : question
        ),
      };



    default:
      return state;
  }
};
export default Reducer;
