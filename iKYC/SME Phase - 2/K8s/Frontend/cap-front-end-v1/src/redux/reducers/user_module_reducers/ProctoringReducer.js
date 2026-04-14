import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  copyPaste: 0,
  tabSwitch: 0,
  allowedViolations: 0,
};

const proctoringReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.INCREMENT_TAB_SWITCH:
      return {
        ...state,
        tabSwitch: state.tabSwitch + 1,
      };
    case ActionTypes.INCREMENT_COPY_PASTE:
      return {
        ...state,
        copyPaste: state.copyPaste + 1,
      };
    case ActionTypes.SET_PROCTORING:
      return {
        ...state,
        allowedViolations: 0,
        copyPaste: 0,
        tabSwitch: 0,
      };
    case ActionTypes.SET_ALLOWED_VIOLATION:
      console.log(payload);
      return {
        ...state,
        allowedViolations: payload,
      };
    default:
      return state;
  }
};

export default proctoringReducer;
