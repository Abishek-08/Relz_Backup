import { ActionTypes } from "../../constants/learning_assessment_constants/ActionTypes";

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  flaggedQuestions: {},
  quizCompleted: false,
  assessmentDurationMinutes: 0,
  assessmentDate: "00-00-0000",
  assessmentStartTime: "",
  timeLeft: 0,
};

const learningEngineReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        currentQuestionIndex: 0,
      };

    case ActionTypes.ANSWER_QUESTION:
      const { questionId, index, optionContent, mark } = action.payload;
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: optionContent,
        },
      };

    case ActionTypes.ANSWER_MULTI_QUESTION:
      const {
        questionId: multiQuestionId,
        updatedAnswer,
        mark: multiMark,
      } = action.payload;
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [multiQuestionId]: updatedAnswer,
        },
      };

    case ActionTypes.CLEAR_ANSWER:
      const { questionId: questionIdToClear } = action.payload;
      const questionType = state.questions.find(q => q.id === questionIdToClear)?.questionType;

      const newSelectedAnswers = { ...state.selectedAnswers };
      if (questionType === "MSQ") {
        newSelectedAnswers[questionIdToClear] = []; // Ensure it's cleared for multi-selector
      } else {
        delete newSelectedAnswers[questionIdToClear]; // For single-selector
      }

      return {
        ...state,
        selectedAnswers: newSelectedAnswers,
      };

    case ActionTypes.TOGGLE_FLAG:
      const { questionId: flagQuestionId } = action.payload;
      const updatedFlags = {
        ...state.flaggedQuestions,
        [flagQuestionId]: !state.flaggedQuestions[flagQuestionId],
      };
      return {
        ...state,
        flaggedQuestions: updatedFlags,
      };


    case ActionTypes.SET_CURRENT_QUESTION_INDEX:
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };

    case ActionTypes.NEXT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case ActionTypes.PREVIOUS_QUESTION:
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
      };

    case ActionTypes.SET_QUIZ_COMPLETED:
      return {
        ...state,
        quizCompleted: true,
      };

    case ActionTypes.SET_ASSESSMENT_DURATION_MINUTES:
      return {
        ...state,
        assessmentDurationMinutes: action.payload,
      };

    case ActionTypes.LEARNING_ASSESSMENT_DATE:
      return {
        ...state,
        assessmentDate: action.payload,
      };

    case ActionTypes.LEARNING_ASSESSMENT_START_TIME:
      return {
        ...state,
        assessmentStartTime: action.payload,
      };

    case ActionTypes.UPDATE_TIME_LEFT:
      return {
        ...state,
        timeLeft: action.payload,
      };

    case ActionTypes.RESET_QUIZ:
      return initialState;

    default:
      return state;
  }
};

export default learningEngineReducer;
