import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbackShownData: {},
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    addfeedbackShownData: (state, action) => {
      state.feedbackShownData = action.payload;
    },
  },
});

export const { addfeedbackShownData } = feedbackSlice.actions;
export default feedbackSlice.reducer;
