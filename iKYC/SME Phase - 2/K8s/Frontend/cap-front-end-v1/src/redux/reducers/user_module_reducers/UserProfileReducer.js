import { ActionTypes } from "../../constants/ActionTypes";

/*
This is an example for separate reducer
where you can include your reducers in a separate file
*/

const initialState = {
  //example initial value
  profileDetails: {},
};

export const UserProfileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_USER_PROFILE_DETAILS:
      return {
        ...state,
        profileDetails: payload,
      };

    default:
      return state;
  }
};


