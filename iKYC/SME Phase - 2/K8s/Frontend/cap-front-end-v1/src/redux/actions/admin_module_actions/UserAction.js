import { ActionTypes } from "../../constants/ActionTypes";

export const UserAction = (users) => {
  return {
    type: ActionTypes.SET_USERS,
    payload: users,
  };
};