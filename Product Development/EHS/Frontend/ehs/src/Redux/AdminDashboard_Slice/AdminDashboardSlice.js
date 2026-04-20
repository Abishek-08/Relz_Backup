import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentView: "Dashboard",
  industry: {
    industryId: 0,
    industryType: "",
  },
};

export const adminDashboardSlice = createSlice({
  name: "adminDashSlice",
  initialState,
  reducers: {
    changeView: (state, actions) => {
      state.currentView = actions.payload;
    },
    changeIndustryId: (state, actions) => {
      state.industry.industryId = actions.payload;
    },
    changeIndustryType: (state, actions) => {
      state.industry.industryType = actions.payload;
    },
  },
});

export const { changeView, changeIndustryId, changeIndustryType } =
  adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
