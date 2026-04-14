import { ActionTypes } from "../../constants/ActionTypes";

export const FeedbackAction = (feedback) => {
  return {
    type: ActionTypes.SET_USER_FEEDBACK,
    payload: feedback,
  };
};