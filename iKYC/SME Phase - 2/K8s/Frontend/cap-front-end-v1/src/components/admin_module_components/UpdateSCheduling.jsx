import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleStatusAction } from "../../redux/actions/admin_module_actions/ScheduleAction";
import { updateScheduleService } from "../../services/admin_module_services/SchedulingService";


const UpdateSCheduling = () => {
  const dispatch = useDispatch();
  const SchedleUpdateData = useSelector(
    (state) => state.assessmentSchedules.schedule
  );
  const [time, setTime] = React.useState(dayjs().add(2, "minutes"));
  const [finalTime] = useState(dayjs().add(2, "minutes"));
  const [previousTime, setPreviousTime] = useState("");
  const [updateValidate, setUpdateValidate] = useState(false);
  const [updatedButton, setUpdatedButton] = useState(false);
  const [duration, setDuration] = useState("");
  const [previousDuration, setPreviousDuration] = useState("");
  const [Pdate, setDate] = React.useState(dayjs(dayjs(Date().now)));
  const [PastTime, setPastTime] = useState(false);
  const [timeChecked, setTimeChecked] = useState(true);
  const [dateChecked, setDateChecked] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [durationChecked, setDurationChecked] = useState(true);

  const handleCloseUpdate = () => {
    setUpdateValidate(false);
  };

  const convertHoursToMinutes = (hours, minutes) => {
    const hoursToMinutes = hours * 60;
    const totalMinutes = hoursToMinutes + minutes;

    setDuration(totalMinutes);
  };

  const handleTimePast = (newValue) => {
    const previousDate = newValue.format("MM/DD/YYYY");

    if (previousDate === dayjs(Date().now).format("MM/DD/YYYY")) {
      setPastTime(true);
    } else {
      setPastTime(false);
    }

    setDate(newValue);
  };

  const convertMintuesToHours = () => {
    const tempDuration = SchedleUpdateData.duration;

    const totalDuration = tempDuration.slice(0, 3);

    const tempHours = Math.floor(parseInt(totalDuration) / 60).toString();
    const tempMinutes = Math.floor(parseInt(totalDuration) % 60).toString();
    setPreviousDuration(tempHours + ":" + tempMinutes);
  };

  const convertTimeZone = () => {
    const tempTime = SchedleUpdateData.startTime;
    let Ctime = tempTime
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [Ctime];

    if (Ctime.length > 1) {
      // If time format correct
      Ctime = Ctime.slice(1); // Remove full string match value
      Ctime[5] = +Ctime[0] < 12 ? "AM" : "PM"; // Set AM/PM
      Ctime[0] = +Ctime[0] % 12 || 12; // Adjust hours
    }
    setPreviousTime(Ctime.join("")); // return adjusted time or original string
  };

  useEffect(() => {
    convertMintuesToHours();
    const previousDate = dayjs(Date().now);
    handleTimePast(previousDate);
    convertTimeZone();
  }, []);

  const validateUpdateForm = () => {
    if (!durationChecked && duration === "") {
      setUpdateValidate(true);
    } else {
      updateScheduleDetails();
    }
  };

  const updateScheduleDetails = () => {
    let startTime = "";
    let assessmentDate = "";
    let updateDuration = "";
    let status = "postponed";
    let reason = "";
    let date = "";
    let schedulingId = SchedleUpdateData.id;

    if (!timeChecked) {
      startTime = time.format("HH:mm").toString();
    } else {
      startTime = SchedleUpdateData.startTime;
    }

    if (!dateChecked) {
      assessmentDate = Pdate.format("MM/DD/YYYY").toString();
    } else {
      assessmentDate = SchedleUpdateData.assessmentDate;
    }

    if (!durationChecked) {
      updateDuration = duration;
    } else {
      const tempDuration = SchedleUpdateData.duration;
      const totalDuration = tempDuration.slice(0, 3);
      updateDuration = totalDuration;
    }
    const data = {
      assessmentDate,
      startTime,
      updateDuration,
      schedulingId,
      status,
      reason,
      date,
    };
    setLoading(true);

    updateScheduleService(data)
      .then(() => {
        dispatch(ScheduleStatusAction());
        setLoading(false);
        setUpdatedButton(true);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div
      style={{
        // backgroundColor: "#f5f5f5",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* <AdminNavbar/> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginRight: "5%",
          marginLeft: "5%",
        }}
      >
        <Card
          sx={{
            width: "100%",
            // backgroundColor: "black",
            mt: "20px",
            mb: "100px",
          }}
        >
          <CardContent>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="info">
                <AlertTitle>
                  Info : Please Checkbox the field need to update !!
                </AlertTitle>
              </Alert>
            </Stack>
            <div style={{ marginTop: "30px" }}>
              <Grid container spacing={1} flexDirection="row">
                <Grid
                  item
                  xs={2}
                  md={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    size="small"
                    onChange={() => {
                      dateChecked
                        ? setDateChecked(false)
                        : setDateChecked(true);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Assessment Date
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast={true}
                      value={Pdate}
                      disabled={dateChecked}
                      onChange={(newValue) => handleTimePast(newValue)}
                    />
                  </LocalizationProvider>
                  <FormHelperText>
                    Previous Date: {SchedleUpdateData.assessmentDate}
                  </FormHelperText>
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    size="small"
                    onChange={() => {
                      timeChecked
                        ? setTimeChecked(false)
                        : setTimeChecked(true);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Start Time
                  </InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      value={time}
                      minTime={PastTime && finalTime}
                      disabled={timeChecked}
                      disablePast={PastTime}
                      onChange={(newValue) => {
                        setTime(newValue);
                      }}
                      renderInput={time}
                    />
                  </LocalizationProvider>
                  <FormHelperText>
                    Previous StartTime:
                    {previousTime}
                  </FormHelperText>
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    size="small"
                    onChange={() => {
                      durationChecked
                        ? setDurationChecked(false)
                        : setDurationChecked(true);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Total Duration
                  </InputLabel>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimeField"]}>
                      {/* <TimePicker
                        views={["hours", "minutes"]}
                        format="hh:mm"
                        ampm={false}
                        disabled={durationChecked}
                        onChange={(value) =>
                          convertHoursToMinutes(value.hour(), value.minute())
                        }
                      /> */}
                      <TimeField
                        label=""
                        defaultValue={dayjs("2022-04-17T00:00")}
                        format="HH:mm"
                        disabled={durationChecked}
                        onChange={(value) =>
                          convertHoursToMinutes(value.hour(), value.minute())
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <FormHelperText>
                    Previous Duration: {previousDuration}
                  </FormHelperText>
                </Grid>
              </Grid>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              {updatedButton ? (
                <Button
                  variant="contained"
                  color="success"
                  disabled
                  sx={{ width: "29ch" }}
                >
                  success
                </Button>
              ) : (
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  sx={{ width: "29ch" }}
                  onClick={validateUpdateForm}
                >
                  update
                </LoadingButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={updateValidate} onClose={handleCloseUpdate}>
        <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
          <NewReleasesIcon /> warning !!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please fill the duration to continue....
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateSCheduling;
