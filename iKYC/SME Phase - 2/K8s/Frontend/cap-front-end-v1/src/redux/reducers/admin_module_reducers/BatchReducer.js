import { ActionTypes } from "../../constants/ActionTypes";

/*
This is an example for separate reducer
where you can include your reducers in a separate file
*/

const initialState = {
  //example initial value
  batch: [],
};

export const BatchReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_APPICATION_BATCH:
      return {
        ...state,
        batch:payload,
      };

    default:
      return state;
  }
};
