import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import CardContent from "@mui/material/CardContent";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Radio, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
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
import { IconButton } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  findUsersByBatch,
  getunmappedusers,
} from "../../../services/admin_module_services/UserService";
import {
  getAllBatch
} from "../../../services/admin_module_services/BatchService";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  resetAssessmentState,
  resetFormFields,
  resetFormReducer,
  resetProctorState,
  resetSkillQuestionPickState,
} from "../../../redux/actions/admin_module_actions/CreateAssessment";
import { getUsers } from "../../../services/admin_module_services/UserService";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {
  addSkillProctoring,
} from "../../../services/admin_module_services/AdminSkillAssessmentService";
import { addQuestionRequest } from "../../../services/admin_module_services/AdminSkillAssessmentService";
import "../../../styles/admin_module_styles/skill_assessment_schedule_admin/ScheduleAssessentStyle.css";
import { ToastContainer, toast } from "react-toastify";
import { ResetLearnCreationAction } from "../../../redux/actions/admin_module_actions/LearningAssessmentCreationAction";
import { addProctoring, createAssessment, createScheduling, mapUserToScheduling } from "../../../services/admin_module_services/SchedulingService";

const AssessmentScheduleRedux = () => {
  const navigate = useNavigate();
  const [time, setTime] = React.useState(dayjs().add(2, "minutes"));
  const [finalTime] = useState(dayjs().add(2, "minutes"));
  const [duration, setDuration] = useState(0);
  const [date, setDate] = React.useState(dayjs(Date().now));
  const [open, setopen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [schleType, setSchleType] = useState("Choose Batch");
  const [SelectBatch, setSelectBatch] = useState("Choose Batch");
  const [SelectBatchId] = useState(0);
  const [Batch, setBatch] = useState([]);
  const [, setBatchId] = useState(0);
  const [selectRow, setSelectedRow] = useState([]);
  const [Data, setData] = useState([]);
  const [PastTime, setPastTime] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [value, setValue] = React.useState("1");
  const [openValidate, setOpenValidate] = useState(false);
  const [openValidate1, setOpenValidate1] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);

  const [previousStepOpen, setPreviousStepOpen] = useState(false);

  //Create Assessment constants from Redux
  const instruction = useSelector((state) => state.createassessment.value);
  const assessmentName = useSelector(
    (state) => state.createassessment.assessmentName
  );
  const assessmentType = useSelector(
    (state) => state.createassessment.assessment
  );

  //Proctor Constants from Redux

  const cameraProctoring = useSelector(
    (state) => state.proctorReducer.cameraProctoring
  );
  const audioProctoring = useSelector(
    (state) => state.proctorReducer.audioProctoring
  );
  const copyPasteWarning = useSelector(
    (state) => state.proctorReducer.copyPasteWarning
  );
  const tabSwitchingWarning = useSelector(
    (state) => state.proctorReducer.tabSwitchingWarning
  );
  const violationCount = useSelector(
    (state) => state.proctorReducer.violationCount
  );

  //Question Request

  const questionRequest = useSelector(
    (state) => state.skillQuestionPick.request
  );

  const assessmentData = {
    assessmentName: assessmentName,
    instruction: instruction,
  };

  const dynamicAttribute = useSelector((state) => state.createFormReducer.formData);

  const dispatch = useDispatch();

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

  const handlechange = (e) => {
    setAddUserOpen(false);
    setSelectedRow([]);
    const option = e.target.value;
    setSchleType(e.target.value);

    if (option === "User") {
      fetchAllUser();
      setopen(true);
    }
  };

  const handleClose = () => {
    setopen(false);
    setAddUserOpen(true);
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
    const batchData = Batch.find((batch) => batch.batchId === newBatchId);
    setSelectBatch(batchData.batchName);
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
    console.log(minutes < 10);
    if (minutes === 0 && hours === 0) {
      setOpenValidate(true);
    } else {
      setOpenValidate(false);
      setOpenValidate1(false);
      console.log(duration);
      const hoursToMinutes = hours * 60;
      const totalMinutes = hoursToMinutes + minutes;
      console.log(totalMinutes);
      setDuration(totalMinutes);
    }
  };

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
    if (duration === 0) {
      setOpenValidate(true);
      setopen(false);
      setSchleType("Choose Batch");
    } else if (duration < 10) {
      setOpenValidate(false);
      setOpenValidate1(true);
      setopen(false);
      setSchleType("Choose Batch");
    } else {
      setOpenValidate(false);
      setOpenValidate1(false);
    }
  };

  const handleOrderSchedule = async () => {
    try {
      const response = await createAssessment(assessmentData);
      const assessmentIdData = response.data.assessmentId;

      console.log("handle here", response.data);
      console.log(assessmentIdData);
      const skillAssessmentData = {
        assessment: {
          assessmentId: assessmentIdData,
          assessmentName: assessmentName,
        },
      };

      const proctoringData = {
        cameraProctoring: cameraProctoring,
        audioProctoring: audioProctoring,
        copyPasteWarning: copyPasteWarning,
        tabSwitchingWarning: tabSwitchingWarning,
        violationCount: parseInt(violationCount),
        assessment: {
          assessmentId: assessmentIdData,
        },
      };

      console.log(proctoringData);

      if (assessmentType === "10") {
        console.log("skill assessment here", skillAssessmentData);
        const skillResponse = await addSkillProctoring(skillAssessmentData);
        const skillAssessmentId = skillResponse.data.skillAssessmentId;

        // Create a new copy of the questionRequest array
        const updatedQuestionRequest = questionRequest.map((request) => ({
          ...request,
          skillassessment: {
            ...request.skillassessment,
            skillAssessmentId: skillAssessmentId,
          },
        }));
        console.log("proctor data", proctoringData);
        console.log("updatedQuestionRequest", updatedQuestionRequest);
        await addProctoring(proctoringData);

        try {
          updatedQuestionRequest.forEach((request) => {
            addQuestionRequest(request);
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        await addProctoring(proctoringData);
      }
      return assessmentIdData;
    } catch (error) {
      console.error(error);
    }
  };

  const scheduleAssessment = async () => {
    const assessment = JSON.parse(sessionStorage.getItem("assessment"));
    if (selectRow.length === 0) {
      setOpenDialog(true);
    } else {
      const assessmentDate = date.format("MM/DD/YYYY").toString();
      const startTime = time.format("HH:mm").toString();
      console.log(selectRow);
      const assessmentId = await handleOrderSchedule(); // Get the assessmentId directly
      console.log(assessmentId)
      const scheduleData = {
        assessmentDate,
        startTime,
        duration,
        assessmentId,
        dynamicAttribute
      };
      setOpenLoading(true);
      console.log(scheduleData);
      createScheduling(scheduleData).then((response) => {
        mapUserToScheduling(response.data, selectRow)
          .then(() => {
            handleConvertDefault();
            setOpenLoading(false);
            sessionStorage.clear();
            navigate("/viewAllScheduling");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error while Scheduling Assessment, Please try again");
            setOpenLoading(false);
            navigate("/viewAllScheduling");
          });
      });
    }
  };

  const modalOpen = () => {
    setPreviousStepOpen(true);
  };

  const handlePreviousStep = () => {
    const decreaseStep = 2;
    sessionStorage.setItem("activeStep", decreaseStep);
    setPreviousStepOpen(false);
    navigate("/feedbackform");
  };

  const handleConvertDefault = () => {
    console.log("execution");
    dispatch(resetAssessmentState());
    dispatch(resetProctorState());
    dispatch(resetSkillQuestionPickState());
    dispatch(ResetLearnCreationAction());
    dispatch(resetFormReducer());
    dispatch(resetFormFields());
    console.log("Execution end");
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="assessment_schedule_super_parent"
    >
      <div className="container-fluid" id="assessment_schedule_Admin_Stepper">
        <Card>
          <CardContent style={{ alignSelf: "center" }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
      </div>
      <div
        className="container-fluid"
        id="assessment_schedule_Admin_card_component"
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            {addUserOpen && (
              <Stack sx={{ width: "100%" }}>
                <Alert severity="info">
                  <Typography variant="subtitle1" color="initial">
                    {selectRow.length} users added successfully
                  </Typography>
                </Alert>
              </Stack>
            )}

            <Grid container spacing={1}>
              <Grid
                container
                spacing={1}
                rowGap={2}
                id="assessment_schedule_Admin_schedule_first_components"
              >
                <Grid item xs={12} md={4}>
                  <div className="assessment_schedule_Admin_input_fields">
                    <InputLabel id="demo-simple-select-helper-label" required>
                      Assessment Date
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disablePast={true}
                        value={date}
                        onChange={(newValue) => handleTimePast(newValue)}
                      />
                    </LocalizationProvider>
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <div className="assessment_schedule_Admin_input_fields">
                    <InputLabel id="demo-simple-select-helper-label" required>
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
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <div className="assessment_schedule_Admin_input_fields">
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      required
                      sx={{ mb: -1 }} // adjust the margin bottom
                    >
                      Total Duration
                    </InputLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={["TimeField", "TimeField", "TimeField"]}
                      >
                        <TimeField
                          label=""
                          defaultValue={dayjs("2022-04-17T00:00")}
                          format="HH:mm"
                          onChange={(value) =>
                            convertHoursToMinutes(value.hour(), value.minute())
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    {openValidate && (
                      <FormHelperText sx={{ color: "red" }}>
                        Please give the duration
                      </FormHelperText>
                    )}
                    {openValidate1 && (
                      <FormHelperText sx={{ color: "red" }}>
                        Please give the minutes above 10
                      </FormHelperText>
                    )}
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={1}
                id="assessment_schedule_Admin_schedule_second_components"
              >
                <Grid item xs={6}>
                  <div id="assessment_schedule_Admin_schedule_choose_schedule_field">
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
                        disabled={openValidate || openValidate1}
                        control={<Radio />}
                        label="Batch"
                      />
                      <FormControlLabel
                        value="User"
                        disabled={openValidate || openValidate1}
                        control={<Radio />}
                        label="User"
                      />
                    </RadioGroup>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  {schleType === "Batch" && (
                    <div id="assessment_schedule_Admin_schedule_schedule_batch_user">
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
                    </div>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  id="assessment_schedule_Admin_schedule_buttons"
                >
                  <div id="assessment_schedule_Admin_schedule_schedule_button">
                    <Button
                      variant="contained"
                      onClick={modalOpen}
                      sx={{
                        width: "95%",
                        backgroundColor: "#27235c",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#97247e",
                        },
                      }}
                    >
                      BACK
                    </Button>
                  </div>
                  <div id="assessment_schedule_Admin_schedule_schedule_button">
                    <LoadingButton
                      sx={{
                        width: "100%",
                        backgroundColor: "#27235c",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#97247e",
                        },
                      }}
                      loading={openLoading}
                      onClick={scheduleAssessment}
                      variant="contained"
                      disabled={!(selectRow.length !== 0)}
                      endIcon={<CalendarMonthIcon />}
                    >
                      Schedule
                    </LoadingButton>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Dialog
          open={previousStepOpen}
          onClose={() => setPreviousStepOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <WarningRoundedIcon /> WARNING
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Moving to the previous step will reassign the schedule from the
              start. All previously entered time and date information will be
              lost due to Dynamic Time validation. Are you sure you want to
              proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setPreviousStepOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handlePreviousStep()}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Modal
          show={open}
          fullscreen={true}
          onHide={handleClose}
          enforceFocus={false}
        >
          <Modal.Header
            style={{
              backgroundColor: "#27235C",
              color: "white",
            }}
          >
            <Modal.Title
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {schleType === "Batch" ? <p>{SelectBatch}</p> : "Users List"}
            </Modal.Title>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                paddingRight: "70px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                endIcon={<GroupAddIcon />}
                onClick={handleClose}
              >
                ADD USER
              </Button>
            </div>
            {schleType === "Batch" && (
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext>
                  <TabPanel>
                    <Box sx={{ height: "370px", width: "100%" }}>
                      <DataGrid
                        scrollbarSize={0}
                        getRowId={(row) => row.userId}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        pageSizeOptions={
                          Data.length > 5 && [5, 10, 25, 50, 100]
                        }
                        initialState={{
                          ...Data.initialState,
                          pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        sx={{
                          width: "auto",
                          borderRadius: 2,
                          boxShadow: 3,
                          "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#27235c",
                            color: "white",
                          },
                          "& .MuiDataGrid-menuIconButton": {
                            color: "white",
                          },
                          "& .MuiDataGrid-sortIcon": {
                            color: "white",
                          },
                          "& .MuiDataGrid-checkboxInput": {
                            color: "#9E9AD9",
                          },
                          "& .MuiDataGrid-scrollbar": {
                            display: "none",
                          },
                        }}
                        slotProps={{
                          filterPanel: {
                            // Force usage of "And" operator
                            logicOperators: [GridLogicOperator.And],
                            // Display columns by ascending alphabetical order
                            columnsSort: "asc",
                            filterFormProps: {
                              // Customize inputs by passing props
                              logicOperatorInputProps: {
                                variant: "outlined",
                                size: "small",
                              },
                              columnInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              operatorInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              valueInputProps: {
                                InputComponentProps: {
                                  variant: "outlined",
                                  size: "small",
                                },
                              },
                              deleteIconProps: {
                                sx: {
                                  "& .MuiSvgIcon-root": { color: "#d32f2f" },
                                },
                              },
                            },
                            sx: {
                              // Customize inputs using css selectors
                              "& .MuiDataGrid-filterForm": { p: 2 },
                              "& .MuiDataGrid-filterForm:nth-child(even)": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#444"
                                    : "#f5f5f5",
                              },
                              "& .MuiDataGrid-filterFormLogicOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormColumnInput": {
                                mr: 2,
                                width: 150,
                              },
                              "& .MuiDataGrid-filterFormOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormValueInput": {
                                width: 200,
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            )}
            {schleType === "User" && (
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
                    <Box sx={{ height: "370px", width: "100%" }}>
                      <DataGrid
                        scrollbarSize={0}
                        getRowId={(row) => row.userId}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        pageSizeOptions={
                          Data.length > 5 && [5, 10, 25, 50, 100]
                        }
                        initialState={{
                          ...Data.initialState,
                          pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        sx={{
                          width: "auto",

                          borderRadius: 2,
                          boxShadow: 3,
                          "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#27235c",
                            color: "white",
                          },
                          "& .MuiDataGrid-menuIconButton": {
                            color: "white",
                          },
                          "& .MuiDataGrid-sortIcon": {
                            color: "white",
                          },
                          "& .MuiDataGrid-checkboxInput": {
                            color: "#9E9AD9",
                          },
                          "& .MuiDataGrid-scrollbar": {
                            display: "none",
                          },
                        }}
                        slotProps={{
                          filterPanel: {
                            // Force usage of "And" operator
                            logicOperators: [GridLogicOperator.And],
                            // Display columns by ascending alphabetical order
                            columnsSort: "asc",
                            filterFormProps: {
                              // Customize inputs by passing props
                              logicOperatorInputProps: {
                                variant: "outlined",
                                size: "small",
                              },
                              columnInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              operatorInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              valueInputProps: {
                                InputComponentProps: {
                                  variant: "outlined",
                                  size: "small",
                                },
                              },
                              deleteIconProps: {
                                sx: {
                                  "& .MuiSvgIcon-root": { color: "#d32f2f" },
                                },
                              },
                            },
                            sx: {
                              // Customize inputs using css selectors
                              "& .MuiDataGrid-filterForm": { p: 2 },
                              "& .MuiDataGrid-filterForm:nth-child(even)": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#444"
                                    : "#f5f5f5",
                              },
                              "& .MuiDataGrid-filterFormLogicOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormColumnInput": {
                                mr: 2,
                                width: 150,
                              },
                              "& .MuiDataGrid-filterFormOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormValueInput": {
                                width: 200,
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">
                    <Box sx={{ height: "370px", width: "100%" }}>
                      <DataGrid
                        scrollbarSize={0}
                        getRowId={(row) => row.userId}
                        rows={Data}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        pageSizeOptions={
                          Data.length > 5 && [5, 10, 25, 50, 100]
                        }
                        initialState={{
                          ...Data.initialState,
                          pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        sx={{
                          width: "auto",

                          borderRadius: 2,
                          boxShadow: 3,
                          "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#27235c",
                            color: "white",
                          },
                          "& .MuiDataGrid-menuIconButton": {
                            color: "white",
                          },
                          "& .MuiDataGrid-sortIcon": {
                            color: "white",
                          },
                          "& .MuiDataGrid-checkboxInput": {
                            color: "#9E9AD9",
                          },
                          "& .MuiDataGrid-scrollbar": {
                            display: "none",
                          },
                        }}
                        slotProps={{
                          filterPanel: {
                            // Force usage of "And" operator
                            logicOperators: [GridLogicOperator.And],
                            // Display columns by ascending alphabetical order
                            columnsSort: "asc",
                            filterFormProps: {
                              // Customize inputs by passing props
                              logicOperatorInputProps: {
                                variant: "outlined",
                                size: "small",
                              },
                              columnInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              operatorInputProps: {
                                variant: "outlined",
                                size: "small",
                                sx: { mt: "auto" },
                              },
                              valueInputProps: {
                                InputComponentProps: {
                                  variant: "outlined",
                                  size: "small",
                                },
                              },
                              deleteIconProps: {
                                sx: {
                                  "& .MuiSvgIcon-root": { color: "#d32f2f" },
                                },
                              },
                            },
                            sx: {
                              // Customize inputs using css selectors
                              "& .MuiDataGrid-filterForm": { p: 2 },
                              "& .MuiDataGrid-filterForm:nth-child(even)": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#444"
                                    : "#f5f5f5",
                              },
                              "& .MuiDataGrid-filterFormLogicOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormColumnInput": {
                                mr: 2,
                                width: 150,
                              },
                              "& .MuiDataGrid-filterFormOperatorInput": {
                                mr: 2,
                              },
                              "& .MuiDataGrid-filterFormValueInput": {
                                width: 200,
                              },
                            },
                          },
                        }}
                      />
                    </Box>
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default AssessmentScheduleRedux;
