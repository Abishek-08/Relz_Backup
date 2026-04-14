import { ActionTypes } from "../../constants/ActionTypes";

export const updatePasswordRequest = () => ({
  type: ActionTypes.UPDATE_PASSWORD_REQUEST,
});

export const updatePasswordSuccess = () => ({
  type: ActionTypes.UPDATE_PASSWORD_SUCCESS,
});

export const updatePasswordFailure = (error) => ({
  type: ActionTypes.UPDATE_PASSWORD_FAILURE,
  payload: error,
});
