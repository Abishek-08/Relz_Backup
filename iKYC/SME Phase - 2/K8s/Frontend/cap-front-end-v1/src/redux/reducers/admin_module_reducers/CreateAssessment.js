import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  value: '',
  assessment: '',
  assessmentName: '',
};

const assessmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_VALUE:
      return { ...state, value: action.payload };
    case ActionTypes.CHANGE_ASSESSMENT:
      return { ...state, assessment: action.payload };
    case ActionTypes.CHANGE_ASSESSMENT_NAME:
      return { ...state, assessmentName: action.payload };
    case ActionTypes.RESET_ASSESSMENT_STATE:
      return initialState;
    default:
      return state;
  }
};

export default assessmentReducer;
