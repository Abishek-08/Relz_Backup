import {
  scheduleData,
  scheduleStatus,
} from "../../constants/Admin_Module_Constants/Scheduling_Actions_Type";

const initialState = {
  schedule: [],
};

const scheduleStatusInital = {
  status: 0,
};

export const ScheduleReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case scheduleData.SCHEDULING_DATA:
      return {
        ...state,
        schedule: payload,
      };

    default:
      return state;
  }
};

export const ScheduleStatusReducer = (
  state = scheduleStatusInital,
  { type }
) => {
  switch (type) {
    case scheduleStatus.GET_SCHEDULE_STATUS:
      return {
        status: state.status + 1,
      };
    default:
      return state;
  }
};
