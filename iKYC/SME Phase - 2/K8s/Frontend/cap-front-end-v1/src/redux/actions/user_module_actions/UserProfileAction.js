import { ActionTypes } from "../../constants/ActionTypes";

/*
This is an example for action
where you can include all your action like this 
*/

export const UserProfileAction = (profileDetail) => {
  console.log(profileDetail);
  return {
    type: ActionTypes.SET_USER_PROFILE_DETAILS,
    payload: profileDetail,
  };
};


