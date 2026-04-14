import { ActionTypes } from "../../constants/learning_assessment_constants/ActionTypes";

export const getAllLearningAction = (data) => {
  return {
    type: ActionTypes.GET_ALL_LEARNING_ASSESSMENT_QUESTIONS,
    payload: data,
  };
};

export const deleteQuestionAction = (questionId) => {
  return {
    type: ActionTypes.DELETE_LEARNING_ASSESSMENT_QUESTIONS,
    questionId,
  };
};

export const disableQuestionAction = (questionId) => {
  return {
    type: ActionTypes.DISABLE_LEARNING_ASSESSMENT_QUESTIONS,
    payload: questionId,
  };
};

export const fetchTopics = (data) => {
  return {
    type: ActionTypes.FETCH_TOPICS_SUCCESS,
    payload: data,
  };
};

export const loadQuestions = (response) => {
  return async (dispatch, getState) => {
    console.log(response);
    const state = getState();
    const previouslySelectedAnswers = state.selectedAnswers || {};
    try {
      if (Array.isArray(response.data)) {
        const questionsWithSelectedAnswers = response.data.map((question) => {
          const isMultiSelector = question.type === 'MSQ'; // Adjust the condition based on your data structure
          return {
            ...question,
            selectedAnswer: isMultiSelector
              ? previouslySelectedAnswers[question.id] || [] // Default to empty array for multi-selector
              : previouslySelectedAnswers[question.id] || null, // Default to null for single-selector
          }
        });
        dispatch({
          type: ActionTypes.LOAD_QUESTIONS,
          payload: questionsWithSelectedAnswers,
        });
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };
};


export const answerQuestion = (questionId, index, optionContent, mark) => {
  return {
    type: ActionTypes.ANSWER_QUESTION,
    payload: { questionId, index, optionContent, mark },
  };
};

export const answerMultiQuestion = (questionId, updatedAnswer, mark) => {
  return {
    type: ActionTypes.ANSWER_MULTI_QUESTION,
    payload: {
      questionId,
      updatedAnswer,
      mark,
    },
  };
};

export const nextQuestion = () => {
  return {
    type: ActionTypes.NEXT_QUESTION,
  };
};

export const previousQuestion = () => {
  return {
    type: ActionTypes.PREVIOUS_QUESTION,
  };
};

export const setQuizCompleted = () => {
  return {
    type: ActionTypes.SET_QUIZ_COMPLETED,
  };
};

export const toggleFlag = (questionId) => {
  return {
    type: ActionTypes.TOGGLE_FLAG,
    payload: { questionId },
  };
};

export const clearAnswer = (questionId) => {
  return {
    type: ActionTypes.CLEAR_ANSWER,
    payload: { questionId },
  };
};

export const resetQuiz = () => ({
  type: ActionTypes.RESET_QUIZ,
});

export const setCurrentQuestionIndex = (index) => {
  return {
    type: ActionTypes.SET_CURRENT_QUESTION_INDEX,
    payload: index,
  };
};

export const setLearningAssessmentDurationMinutes = (assessmentDurationMinutes) => {
  return {
    type: ActionTypes.SET_ASSESSMENT_DURATION_MINUTES,
    payload: assessmentDurationMinutes,
  };
}

export const learningAssessmentDate = (currentDate) => {
  return {
    type: ActionTypes.LEARNING_ASSESSMENT_DATE,
    payload: currentDate,
  }
}

export const learningAssessmentStartTime = (assessmentStartTime) => {
  return {
    type: ActionTypes.LEARNING_ASSESSMENT_START_TIME,
    payload: assessmentStartTime,
  }
}

export const updateTimeLeft = (timeLeft) => ({
  type: ActionTypes.UPDATE_TIME_LEFT,
  payload: timeLeft,
});