import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  surveyShownData: {},
};

export const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    addSurveyShownData: (state, action) => {
      state.surveyShownData = action.payload;
    },
  },
});

export const { addSurveyShownData } = surveySlice.actions;
export default surveySlice.reducer;
