import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: "step-1",
  userDetails: {
    userName: "",
    userEmail: "",
    userCompany: "",
  },
  snaps: { IDProofSnap: "", personSnap: "" },
};

export const proctoringSlice = createSlice({
  name: "proctoringSlice",
  initialState,
  reducers: {
    changeStepReducer: (state, action) => {
      state.currentStep = action.payload;
    },
    userDetailsReducer: (state, action) => {
      state.userDetails = action.payload;
    },
    idProofReducer: (state, action) => {
      state.snaps.IDProofSnap = action.payload;
    },
    personSnapReducer: (state, action) => {
      state.snaps.personSnap = action.payload;
    },
  },
});

export const {
  userDetailsReducer,
  idProofReducer,
  personSnapReducer,
  changeStepReducer,
} = proctoringSlice.actions;

export default proctoringSlice.reducer;
