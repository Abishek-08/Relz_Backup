import { ActionTypes } from "../../constants/ActionTypes";

/*
This is an example for action
where you can include all your action like this 
*/

export const BatchAction = (batch) => {
  return {
    type: ActionTypes.SET_APPICATION_BATCH,
    payload: batch,
  };
};
