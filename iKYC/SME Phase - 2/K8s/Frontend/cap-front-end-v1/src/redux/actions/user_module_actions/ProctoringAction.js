import { ActionTypes } from "../../constants/ActionTypes";

export const incrementTabSwitch = () => ({
  type: ActionTypes.INCREMENT_TAB_SWITCH,
});

export const incrementCopyPaste = () => ({
  type: ActionTypes.INCREMENT_COPY_PASTE,
});

export const setAllowedViolations = (violationCount) => {
  console.log(violationCount);
  return {
    type: ActionTypes.SET_ALLOWED_VIOLATION,
    payload: violationCount,
  };
};

export const setProctoring = () => {
  console.log("object");
  return {
    type: ActionTypes.SET_PROCTORING,
  };
};
