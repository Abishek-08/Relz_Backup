import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Radio, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "react-bootstrap/Modal";
import TabList from "@mui/lab/TabList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TabPanel from "@mui/lab/TabPanel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useNavigate } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  getunmappedusers,
} from "../../services/admin_module_services/UserService";
import { getAllBatch, findUsersByBatch} from "../../services/admin_module_services/BatchService";
import { getUsers } from "../../services/admin_module_services/UserService";
import AdminNavbar from "./AdminNavbar";
import AdminHorizontalLinearAlternativeLabelStepper from "./ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import "../../styles/admin_module_styles/user.css";
import { createScheduling, mapUserToScheduling } from "../../services/admin_module_services/SchedulingService";

const AssessmentScheduling = () => {
  const navigate = useNavigate();
  const [time, setTime] = React.useState(dayjs().add(2, "minutes"));
  const [finalTime] = useState(dayjs().add(2, "minutes"));
  const [duration, setDuration] = useState("");
  const [date, setDate] = React.useState(dayjs(Date().now));
  const [open, setopen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [schleType, setSchleType] = useState("choose");
  const [SelectBatch] = useState("choose");
  const [SelectBatchId] = useState(0);
  const [Batch, setBatch] = useState([]);
  const [, setBatchId] = useState(0);
  const [selectRow, setSelectedRow] = useState([]);
  const [Data, setData] = useState([]);
  const [PastTime, setPastTime] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [value, setValue] = React.useState("1");
  const [openValidate, setOpenValidate] = useState(false);
  //const [, setOpenBufferValidate] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setSelectedRow([]);
    const tabValue = newValue;
    if (tabValue === "1") {
      fetchAllUser();
    }
    if (tabValue === "2") {
      fetchUnMappedUser();
    }
    setValue(newValue);
  };

  const handleCloseLoading = () => {
    setOpenLoading(false);
  };

  // const handleCloseValidate = () => {
  //   setOpenValidate(false);
  // };
  console.log(selectRow);
  const handlechange = (e) => {
    setSelectedRow([]);
    const option = e.target.value;
    setSchleType(e.target.value);

    if (option === "Individual User") {
      fetchAllUser();
      setopen(true);
    }
  };

  const handleClose = () => {
    setopen(false);
    setValue("1");
  };

  // const handleCloseBuffer = () => {
  //   setOpenBufferValidate(false);
  // };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const previousDate = dayjs(Date().now);
    handleTimePast(previousDate);
    fetchBatch();
  }, []);

  const fetchUnMappedUser = () => {
    getunmappedusers().then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  };

  const fetchBatch = () => {
    getAllBatch().then((response) => {
      console.log(response.data);
      setBatch(response.data);
    });
  };

  const fetchAllUser = () => {
    getUsers().then((response) => {
      setData(response.data);
    });
  };

  const columns = [
    { field: "userName", headerName: "Name", flex: 1 },
    { field: "userEmail", headerName: "Email", flex: 1 },
    { field: "userMobile", headerName: "Mobile", flex: 1 },
    { field: "userGender", headerName: "Gender", flex: 1 },
  ];

  const handleSelectionChange = (selectionModel) => {
    setSelectedRow(selectionModel);
  };

  const handleBatchSelect = (e) => {
    const newBatchId = e.target.value;
    setBatchId(newBatchId);
    fetchBatchUser(newBatchId);
    setopen(true);
  };

  const fetchBatchUser = async (newBatchId) => {
    await findUsersByBatch(newBatchId)
      .then((response) => {
        console.log(response.data.user);
        setData(response.data.user);
      })
      .catch(() => {});
  };

  const convertHoursToMinutes = (hours, minutes) => {
    console.log(minutes);
    if (hours === 0) {
      setOpenValidate(true);
    } else {
      setOpenValidate(false);
      console.log(duration);
      const hoursToMinutes = hours * 60;
      const totalMinutes = hoursToMinutes + minutes;
      console.log(totalMinutes);
      setDuration(totalMinutes);
    }
  };

  console.log(duration);

  const handleTimePast = (newValue) => {
    const previousDate = newValue.format("MM/DD/YYYY");
    console.log(dayjs(Date().now).format("MM/DD/YYYY"));
    if (previousDate === dayjs(Date().now).format("MM/DD/YYYY")) {
      setPastTime(true);
    } else {
      setPastTime(false);
    }

    setDate(newValue);
  };

  const validateInput = () => {
    if (duration === "") {
      setOpenValidate(true);
      setopen(false);
      setSchleType("choose");
    } else {
      setOpenValidate(false);
    }
  };

  const scheduleAssessment = () => {
    const assessment = JSON.parse(sessionStorage.getItem("assessment"));
    if (selectRow.length === 0) {
      setOpenDialog(true);
    } else {
      const assessmentId = assessment.assessmentId;
      const assessmentDate = date.format("MM/DD/YYYY").toString();
      const startTime = time.format("HH:mm").toString();
      const scheduleData = {
        assessmentDate,
        startTime,
        duration,
        assessmentId,
      };
      console.log(scheduleData);
      console.log(selectRow);
      setOpenLoading(true);
      createScheduling(scheduleData).then((response) => {
        mapUserToScheduling(response.data, selectRow)
          .then(() => {
            setOpenLoading(false);
            sessionStorage.clear();
            navigate("/viewAllScheduling");
          })
          .catch((error) => {
            console.log(error);
            setOpenLoading(false);
          });
      });
    }
  };

  return (
    <div className="container-fluid d-flex m-0 p-0">
      <AdminNavbar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: "1125px",
            marginTop: "110px",
            display: "flex",
            justifyContent: "center",
            marginLeft: "90px",
          }}
        >
          <AdminHorizontalLinearAlternativeLabelStepper />
        </div>
        <div>
          <Grid container spacing={1}>
            <Grid item xs={1}></Grid>
            <Grid item container sx={{ width: "600px" }} xs={10}>
              <Card
              id="admin-module-schedule-assessment"
                sx={{ width: "600px", mt: "60px", ml: "200px", mb: "50px" }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ ml: "130px" }}
                    variant="h5"
                    component="div"
                  >
                    Assessment Scheduling
                  </Typography>
                  <br />
                  <Grid container spacing={2}>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 1, width: "500px" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <InputLabel
                            id="demo-simple-select-helper-label"
                            required
                          >
                            Assessment Date
                          </InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disablePast={true}
                              value={date}
                              onChange={(newValue) => handleTimePast(newValue)}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <br />

                        <Grid item xs={6}>
                          <InputLabel
                            id="demo-simple-select-helper-label"
                            required
                          >
                            Start Time
                          </InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                              defaultValue={time}
                              minTime={PastTime && finalTime}
                              disablePast={PastTime}
                              onChange={(newValue) => {
                                setTime(newValue);
                              }}
                              renderInput={time}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <InputLabel
                            id="demo-simple-select-helper-label"
                            required
                          >
                            Total Duration
                          </InputLabel>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                              components={[
                                "TimeField",
                                "TimeField",
                                "TimeField",
                              ]}
                            >
                              <TimePicker
                                views={["hours", "minutes"]}
                                format="hh:mm"
                                ampm={false}
                                onChange={(value) =>
                                  convertHoursToMinutes(
                                    value.hour(),
                                    value.minute()
                                  )
                                }
                              />
                              {/* <TimeField
                                defaultValue={dayjs("2022-04-17T00:00")}
                                onChange={(value) =>
                                  convertHoursToMinutes(
                                    value.hour(),
                                    value.minute()
                                  )
                                }
                                format="HH:mm"
                              /> */}
                            </DemoContainer>
                          </LocalizationProvider>
                          {openValidate && (
                            <FormHelperText sx={{ color: "red" }}>
                              Please give the duration
                            </FormHelperText>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <InputLabel id="demo-simple-select-helper-label">
                            Choose Scheduling Type
                          </InputLabel>

                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => handlechange(e)}
                            onMouseEnter={validateInput}
                          >
                            <FormControlLabel
                              value="Batch"
                              disabled={openValidate}
                              control={<Radio />}
                              label="Batch"
                            />
                            <FormControlLabel
                              value="Individual User"
                              disabled={openValidate}
                              control={<Radio />}
                              label="Individual User"
                            />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={6}>
                          {schleType === "Batch" && (
                            <>
                              <InputLabel id="demo-simple-select-helper-label">
                                Choose Batch
                              </InputLabel>

                              <Select
                                fullWidth
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={SelectBatchId}
                                renderValue={() => SelectBatch}
                                onChange={(e) => handleBatchSelect(e)}
                              >
                                {Batch.map((data) => (
                                  <MenuItem value={data.batchId}>
                                    {data.batchName}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item sx={{ ml: "40px" }} xs={12}>
                          <LoadingButton
                            sx={{ width: "90%" }}
                            loading={openLoading}
                            onClick={scheduleAssessment}
                            variant="contained"
                            disabled={!(selectRow.length !== 0)}
                            endIcon={<CalendarMonthIcon />}
                          >
                            Schedule
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>

          <Modal
            show={open}
            fullscreen={true}
            onHide={handleClose}
            enforceFocus={false}
            style={{ marginTop: "60px" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Select the Users </Modal.Title>
            </Modal.Header>
            <Button
              sx={{ ml: "1000px",mt:"10px" }}
              variant="contained"
              color="primary"
              endIcon={<GroupAddIcon />}
              onClick={handleClose}
            >
              Add User
            </Button>
            <Modal.Body>
              {schleType === "Batch" && (
                <Box
                  sx={{ width: "100%", typography: "body1", borderBottom: 10 }}
                >
                  <TabContext>
                    <TabPanel>
                      <DataGrid
                        getRowId={(row) => row.userId}
                        style={{
                          height: 500,
                          width: "100%",
                          marginBottom: "50px",
                        }}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              )}
              {schleType === "Individual User" && (
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChangeTab}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Over-All Users" value="1" />
                        <Tab label="UnMapped Users" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <DataGrid
                        sx={{ marginBottom: "50px" }}
                        getRowId={(row) => row.userId}
                        style={{ height: 500, width: "100%", zIndex: 3000 }}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <DataGrid
                        sx={{ marginBottom: "50px" }}
                        getRowId={(row) => row.userId}
                        style={{ height: 500, width: "100%", zIndex: 3000 }}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              )}
            </Modal.Body>
          </Modal>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            disableEnforceFocus
          >
            <DialogTitle id="alert-dialog-title" sx={{ color: "orange" }}>
              <NewReleasesIcon /> warning !!
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please select users to Schedule the Assessment
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                size="small"
                onClick={handleCloseDialog}
                autoFocus
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          {/* <Dialog open={openLoading} onClose={handleCloseLoading}>
            <DialogTitle sx={{ color: "green" }}>
              <AutoModeIcon /> Please wait a minute....
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <CircularProgress sx={{ ml: "100px" }} />
              </DialogContentText>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
    </div>
  );
};

export default AssessmentScheduling;
