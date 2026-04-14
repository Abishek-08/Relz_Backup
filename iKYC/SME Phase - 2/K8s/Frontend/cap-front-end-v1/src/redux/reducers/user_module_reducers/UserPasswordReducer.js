import { ActionTypes } from "../../constants/ActionTypes";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const UserPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case ActionTypes.UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case ActionTypes.UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default UserPasswordReducer;
