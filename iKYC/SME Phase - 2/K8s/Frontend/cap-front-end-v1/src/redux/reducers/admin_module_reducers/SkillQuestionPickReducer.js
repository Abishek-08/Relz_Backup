import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  totalQuestions: null,
  request: [], // Array of question objects
};

const skillQuestionPick = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_SKILL_TOTAL_COUNT:
      return { ...state, totalQuestions: action.payload };

    case ActionTypes.CHANGE_SKILL_QUESTION_LIST:
      const updatedRequest = [...state.request];
      const existingItemIndex = updatedRequest.findIndex(
        (item) =>
          item.level === action.payload.level &&
          item.category.categoryId === action.payload.category.categoryId &&
          item.category.categoryName === action.payload.category.categoryName
      );

      if (existingItemIndex !== -1) {
        // Update the count of the existing item
        updatedRequest[existingItemIndex] = {
          ...updatedRequest[existingItemIndex],
          count:
            parseInt(updatedRequest[existingItemIndex].count, 10) +
            parseInt(action.payload.count, 10),
        };
      } else {
        // Add new item
        updatedRequest.push(action.payload);
      }

      return { ...state, request: updatedRequest };

    case ActionTypes.DELETE_SKILL_QUESTION:
      // Filter out the item to be deleted
      const filteredRequest = state.request.filter(
        (item) => item !== action.payload
      );
      return { ...state, request: filteredRequest };
    case ActionTypes.RESET_SKILL_QUESTION_PICK_STATE:
      return initialState;

    default:
      return state;
  }
};

export default skillQuestionPick;
