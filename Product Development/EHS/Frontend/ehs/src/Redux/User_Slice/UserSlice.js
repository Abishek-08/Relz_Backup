import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userName: "",
  userProfile: "",
  userEmail: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    handleLogging: (state, actions) => {
      state.isLoggedIn = true;
      state.userName = actions.payload.userName;
      state.userProfile = actions.payload.userProfile;
      state.userEmail = actions.payload.userEmail;
    },

    handleLogout: () => initialState,
  },
});

export const { handleLogging, handleLogout } = loginSlice.actions;

export default loginSlice.reducer;
