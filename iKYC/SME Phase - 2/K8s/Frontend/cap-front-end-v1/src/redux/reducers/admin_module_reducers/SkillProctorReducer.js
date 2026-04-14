import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  cameraProctoring: false,
  audioProctoring: false,
  copyPasteWarning: false,
  tabSwitchingWarning: false,
  violationCount: '',
};

const proctorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_CAMERA_PROCTOR:
      return { ...state, cameraProctoring: action.payload };
    case ActionTypes.CHANGE_AUDIO_PROCTOR:
      return { ...state, audioProctoring: action.payload };
    case ActionTypes.CHANGE_COPY_PASTE_PROCTOR:
      return { ...state, copyPasteWarning: action.payload };
    case ActionTypes.CHANGE_TAB_SWITCH_PROCTOR:
      return { ...state, tabSwitchingWarning: action.payload };
    case ActionTypes.CHANGE_VIOLATION_COUNT:
      return { ...state, violationCount: action.payload };
    case ActionTypes.RESET_PROCTOR_STATE:
      return initialState;
    default:
      return state;
  }
};

export default proctorReducer;
