import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
    feedback: [],
};

const FeedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_FEEDBACK:
      return {...state, feedback: action.payload };
    default:
      return state;
  }
  
};

export  { FeedbackReducer }; 