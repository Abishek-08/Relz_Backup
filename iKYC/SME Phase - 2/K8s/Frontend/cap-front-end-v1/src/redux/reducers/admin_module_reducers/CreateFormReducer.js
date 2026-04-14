import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  formData: [],
};

const createFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_FORM_FIELDS:
      return {
        ...state,
        formData: [...action.payload], // Ensure a new array is returned
      };
    case ActionTypes.RESET_FORM_FIELDS:
      return initialState;
    default:
      return state;
  }
};

export default createFormReducer;
