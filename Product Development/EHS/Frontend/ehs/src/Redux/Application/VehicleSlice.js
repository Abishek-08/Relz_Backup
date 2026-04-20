import { createSlice } from "@reduxjs/toolkit";

const intitialState = {
  parkingStatus: {
    occupied_slot: 0,
    Unoccupied_slot: 0,
    ImproperlyParked: 0,
  },
};

export const vehicleDashboardSlice = createSlice({
  name: "vehicleSlice",
  initialState: intitialState,
  reducers: {
    changeStatus: (state, actions) => {
      state.parkingStatus = actions.payload;
    },
  },
});

export const { changeStatus } = vehicleDashboardSlice.actions;

export default vehicleDashboardSlice.reducer;
