/*
This is an example for action
where you can include all your action like this 
*/

import {
  scheduleData,
  scheduleStatus,
} from "../../constants/Admin_Module_Constants/Scheduling_Actions_Type";

export const ScheduleAction = (schedules) => {
  return {
    type: scheduleData.SCHEDULING_DATA,
    payload: schedules,
  };
};

export const ScheduleStatusAction = () => {
  return {
    type: scheduleStatus.GET_SCHEDULE_STATUS,
  };
};
