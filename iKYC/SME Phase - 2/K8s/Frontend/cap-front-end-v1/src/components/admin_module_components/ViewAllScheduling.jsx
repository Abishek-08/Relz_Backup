import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridLogicOperator,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Modal from "react-bootstrap/Modal";
import TabList from "@mui/lab/TabList";
import Divider from "@mui/material/Divider";
import { Card, CardHeader } from '@mui/material'
import TabPanel from "@mui/lab/TabPanel";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Chip from "@mui/material/Chip";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import ChecklistIcon from "@mui/icons-material/Checklist";
import QuizIcon from "@mui/icons-material/Quiz";
import "../../styles/admin_module_styles/viewassessment.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Adminnavbar from "../../views/admin_module_views/Adminnavbar";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UpdateSCheduling from "./UpdateSCheduling";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleAction } from "../../redux/actions/admin_module_actions/ScheduleAction";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileDatePicker } from "@mui/x-date-pickers";
import loadingAnimation from '../../assets/admin-module-assets/Loading.gif'
import { getAssessmentDetails } from "../../services/admin_module_services/Report_Service";
import { cancelScheduleService, deleteScheduleService, getAllScheduling, getScheduledUsers, getUnScheduledUsers, mapUserToScheduling, removeUserFromScheduleService } from "../../services/admin_module_services/SchedulingService";


const ViewAllScheduling = () => {
  const tempScheduleStatus = useSelector(
    (state) => state.assessmentScheduleStatus.status
  );
  //const schedule = useSelector((state) => state.assessmentSchedules.schedule);
  const [open, setOpen] = useState(false);
  //const [buttonId, setButtonId] = useState(0);
  const [reScheduleValidate, setRescheduleValidate] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const [selectedRow, setSelectedRow] = useState([]);
  const [rows, setRows] = useState([]);
  const [Data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [unScheduleUsers, setUnScheduleUsers] = useState([]);
  const [schedulingId, setSchedulingId] = useState(0);
  const [openLoading, setOpenLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [openValidate, setOpenValidate] = useState(false);
  const [deleteValidate, setDeleteValidate] = useState(false);
  const [reScheduleOpen, setReScheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [sameDateResch, setsameDateResch] = useState(false);
  const [ClorReschlData, setClorReschlData] = useState([]);
  const [tempUpdateStatus] = useState(tempScheduleStatus);
  const [reason1, setReason] = useState("");
  const [postponedTime, setPostponedTime] = useState("");
  const [cancelButtonFlag, setCancelButtonFlag] = useState(true);
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dataGridLoading, setDataGridLoading] = useState(false);
  const [RemoveUserOpen, setRemoveUserOpen] = useState(false);
  const [dataloading, setDataLoading] = useState(true); // Add a loading state

  const dispatch = useDispatch();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseDeleteValidate = () => {
    setDeleteValidate(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReScheduleclose = () => {
    setRescheduleValidate(false);
    dispatch(ScheduleAction(ClorReschlData));
    setUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setUpdateOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("1");
    setSelectedRow([]);
  };

  const handleCloseLoading = () => {
    setOpenLoading(false);
  };

  const handleChangeTab = (event, newValue) => {
    const tabValue = newValue;

    if (tabValue === "2") {
      viewUnScheduledUsers();
    }
    setSelectedRow([]);
    setValue(newValue);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedRow(selectionModel);
  };

  const viewScheduledUser = (data) => {
    setOpen(true);
    setSchedulingId(data.id);
    getScheduledUsers(data.id).then((response) => {
      const tempUserData = response.data.user;

      const rowData = tempUserData.map((user) => ({
        id: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
        userGender: user.userGender,
      }));

      setData(rowData);
    });
  };

  const viewUnScheduledUsers = () => {
    getUnScheduledUsers().then((response) => {
      const tempUserData = response.data;

      const rowData = tempUserData.map((user) => ({
        id: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
        userGender: user.userGender,
      }));

      setUnScheduleUsers(rowData);
    });
  };

  const updateSchedule = (data) => {
    dispatch(ScheduleAction(data));
    setUpdateOpen(true);
  };

  const addUserToSchedule = () => {
    if (selectedRow.length === 0) {
      setOpenDialog(true);
    } else {
      setOpenLoading(true);
      mapUserToScheduling(schedulingId, selectedRow)
        .then(() => {
          setOpenLoading(false);
          setOpen(false);
          setValue("1");
        })
        .catch((err) => console.log(err));
    }
  };

  const cancelScheduling = (row) => {
    const schedulingId = row.id;
    const updateDuration = row.duration.slice(0, 3);
    const startTime = row.startTime;
    const assessmentDate = row.assessmentDate;
    const status = "cancelled";
    const reason = reason1;
    const date = postponedTime
    const data = {
      schedulingId,
      updateDuration,
      startTime,
      assessmentDate,
      status,
      date,
      reason
    };

    setLoading(true);
    cancelScheduleService(data)
      .then(() => {
        setCount(count + 1);
        setClorReschlData([]);
        setLoading(false);
        setCancelOpen(false);
      })
      .catch((error) => console.log(error));
  };

  const reScheduleAssessment = (row) => {
    var oldDate = new Date(row.assessmentDate);

    const schedulingId = row.id;
    const updateDuration = row.duration.slice(0, 3);
    const startTime = row.startTime;
    const assessmentDate = row.assessmentDate;
    const status = "scheduled";
    const date = postponedTime;
    const reason = reason1
    const data = {
      schedulingId,
      updateDuration,
      startTime,
      assessmentDate,
      status,
      date,
      reason
    };

    if (dayjs().isSame(oldDate, "day")) {
      setReScheduleOpen(false);
      setsameDateResch(true);
    } else if (dayjs().isBefore(oldDate, "day")) {
      setLoading(true);
      setRescheduleValidate(false);
      cancelScheduleService(data)
        .then(() => {
          setCount(count + 1);
          setLoading(false);
          setReScheduleOpen(false);
          setClorReschlData([]);
        })
        .catch((error) => console.log(error));
    } else if (dayjs().isAfter(oldDate, "day")) {
      setReScheduleOpen(false);
      setRescheduleValidate(true);
    }
  };

  const handleDelete = (row) => {
    if (row.status === "cancelled") {
      setDeleteId(row.id);
      setOpenValidate(true);
    } else {
      setDeleteValidate(true);
      setOpenValidate(false);
    }
  };

  const deleteSchedule = () => {
    setLoading(true);
    deleteScheduleService(deleteId)
      .then(() => {
        setLoading(false);
        setOpenValidate(false);
        setCount(count + 1);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const removeUserFromSchedule = () => {
    if (selectedRow.length === 0) {
      setOpenDialog(true);
    } else {
      setRemoveUserOpen(true)
    }
  };

  const removeUserFromSchedule1 = () => {
    setRemoveUserOpen(false)
    setOpenLoading(true);
    removeUserFromScheduleService(schedulingId, selectedRow, reason1, postponedTime)
      .then(() => {
        setOpenLoading(false);
        setOpen(false);
        setValue("1");
      })
      .catch((err) => console.log(err));
  }

  const cancelOrReschFns = (row) => {
    setClorReschlData(row);
    if (row.status === "scheduled" || row.status === "postponed") {
      setCancelOpen(true);
    }
    if (row.status === "cancelled") {
      setReScheduleOpen(true);
    }
  };

  const handleDetailView = (assessmentId) => {
    getAssessmentDetails(assessmentId).then((response) => {
      setAssessmentDetails(response.data);
      setDetailOpen(true);
    });
  };

  const columns = [
    {
      field: "assessmentName",
      headerName: "Assessment Name",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assessmentDate",
      headerName: "Scheduled Date",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "duration",
      headerName: "Total Duration",
      flex: 1,
      headerAlign: "center",
      align: "center",
      headerClassName: "super-app-theme--header",
      type: "number",
      renderCell: ({ row }) => {
        return row.duration + " Mins";
      },
    },

    {
      field: "users",
      headerName: "View Users",
      sortable: false,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      filterable: false,
      renderCell: ({ row }) => {
        return [
          <Tooltip title="viewUsers" arrow>
            <GridActionsCellItem
              icon={<PeopleAltIcon />}
              label="viewUsers"
              className="textPrimary"
              disabled={row.status === "cancelled" ? true : false}
              color="inherit"
              onClick={() => viewScheduledUser(row)}
            />
          </Tooltip>,
        ];
      },
    },
    {
      field: "Edit",
      headerName: "Actions",
      filterable: false,
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row }) => {
        return [
          <Tooltip title="update" arrow>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="viewUsers"
              className="textPrimary"
              color="inherit"
              onClick={() => updateSchedule(row)}
            />
          </Tooltip>,
          <Tooltip title="delete" arrow>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="viewUsers"
              className="textPrimary"
              color="inherit"
              onClick={() => handleDelete(row)}
            />
          </Tooltip>,

          <Tooltip title="Assessment Details" arrow>
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="viewUsers"
              className="textPrimary"
              color="inherit"
              onClick={() => handleDetailView(row.assessmentId)}
            />
          </Tooltip>,
        ];
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        if (dayjs().isAfter(new Date(row.assessmentDate), "day")) {
          return <Chip label="Expired" color="default" />;
        } else if (row.status === "cancelled") {
          return <Chip label={row.status} color="error" />;
        } else if (row.status === "scheduled") {
          return <Chip label={row.status} color="success" />;
        } else if (row.status === "postponed") {
          return <Chip label={row.status} color="warning" />;
        }
      },
    },

    {
      filed: "Change Status",
      headerName: "Change Status",
      headerClassName: "super-app-theme--header",
      filterable: false,
      flex: 1.2,
      align: "center",
      headerAlign: "center",
      resizable: false,
      valueGetter: (value, row) => {
        //setStatus(row.status);
      },
      renderCell: ({ row }) => {
        if (row.status === "scheduled" || row.status === "postponed") {
          return [
            <Button
              endIcon={<CancelIcon />}
              size="small"
              //loading={buttonId === row.id && loading}
              variant="outlined"
              color="error"
              onClick={() => cancelOrReschFns(row)}
            >
              cancel
            </Button>,
          ];
        } else if (row.status === "cancelled") {
          return [
            <Button
              size="small"
              //loading={buttonId === row.id && loading}
              endIcon={<CalendarMonthIcon />}
              variant="outlined"
              onClick={() => cancelOrReschFns(row)}
            >
              Reschedule
            </Button>,
          ];
        }
      },
    },
  ];

  const columns1 = [
    { field: "userName", headerName: "Name", flex: 1 },
    { field: "userEmail", headerName: "Email", flex: 1 },
    { field: "userGender", headerName: "Gender", flex: 1 },
  ];

  useEffect(() => {
    const fetchAssessments = async () => {
      setDataGridLoading(true);
      try {
        const response = await getAllScheduling();
        const scheduling = response.data;
        console.log(response.data)

        const rowsData = scheduling.map((scheduling) => ({
          id: scheduling.schedulingId,
          assessmentDate: scheduling.assessmentDate,
          startTime: scheduling.startTime,
          duration: scheduling.duration,
          assessmentLink: scheduling.assessmentLink,
          status: scheduling.status,
          assessmentName: scheduling.assessment.assessmentName,
          assessmentId: scheduling.assessment.assessmentId,
        }));
        console.log("rowsData", rowsData)
        setRows(rowsData);
        setDataGridLoading(false);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setDataGridLoading(false);
      }
      finally {
        setDataLoading(false);
      }
    };

    if (tempScheduleStatus > tempUpdateStatus) {
      setUpdateOpen(false);
    }

    fetchAssessments();
  }, [count, tempScheduleStatus]);

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .no-results-primary": {
      fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
    },
    "& .no-results-secondary": {
      fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
    },
  }));

  const CustomNoResultsOverlay = () => {
    return (
      <StyledGridOverlay>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width={96}
          viewBox="0 0 523 299"
          aria-hidden
          focusable="false"
        >
          <path
            className="no-results-primary"
            d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
          />
          <path
            className="no-results-primary"
            d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
          />
          <path
            className="no-results-primary"
            d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
          />
          <path
            className="no-results-secondary"
            d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
          />
        </svg>
        <Box sx={{ mt: 2 }}>No results found.</Box>
      </StyledGridOverlay>
    );
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      style={{ flexDirection: "column"}}
    >
      <Adminnavbar />

      {dataloading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* <CircularProgress /> */}
          <img src={loadingAnimation}
            style={{ mixBlendMode: "multiply" }} />
        </div>
      ) : (

        <div
          className="container-fluid"
          id="admin_viewallassessment_body"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div>
            <div style={{ marginTop: "2%" }}>
              <Card
                sx={{
                  color: "white",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"

                }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      SCHEDULED ASSESSMENTS
                    </Typography>
                  }
                />
              </Card>
            </div>
            <div className="admin_viewallassessment_schedule">
              <Card sx={{ p: 1 }}>
                <Box sx={{ height: "400px", width: "100%" }}>
                  <DataGrid
                    scrollbarSize={0}
                    loading={dataGridLoading}
                    rows={rows}
                    columns={columns}
                    autoHeight={false}
                    rowHeight={isSmallScreen ? 40 : 50}
                    disableExtendRowFullWidth={!isSmallScreen}
                    pageSizeOptions={rows.length > 6 && [6, 20, 25, 50, 100]}
                    initialState={{
                      ...rows.initialState,
                      pagination: { paginationModel: { pageSize: 6 } },
                    }}
                    slots={{
                      noResultsOverlay: CustomNoResultsOverlay,
                    }}
                    sx={{
                      width: "100%",
                      minHeight: "400px",
                      maxHeight: "400px",
                      "& .super-app-theme--header": {
                        backgroundColor: "#27235c",
                        color: "white",
                      },
                      "& .MuiDataGrid-menuIconButton": {
                        color: "white",
                      },
                      "& .MuiDataGrid-sortIcon": {
                        color: "white",
                      },
                      "& .MuiDataGrid-scrollbar": {
                        display: "none",
                      },
                      border: "none",
                      "& .MuiDataGrid-main": {
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
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
                          "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                          "& .MuiDataGrid-filterFormValueInput": { width: 200 },
                        },
                      },
                    }}
                  />
                </Box>
              </Card>
            </div>
          </div>

        </div>
      )}

      <Modal
        show={open}
        fullscreen={true}
        onHide={handleClose}
        enforceFocus={false}
        style={{ color: "white" }}
      >
        <Modal.Header
          style={{
            backgroundColor: "#27235C",
            color: "white",
          }}
        >
          <Modal.Title>Users</Modal.Title>
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

        <Modal.Body style={{ backgroundColor: "rgb(245, 245, 245)" }}>
          {value === "1" && (
            <Button
              sx={{ marginLeft: "1150px" }}
              variant="contained"
              color="error"
              endIcon={<PersonRemoveAlt1Icon />}
              onClick={removeUserFromSchedule}
            >
              Remove
            </Button>
          )}
          {value === "2" && (
            <Button
              sx={{ ml: "1150px" }}
              variant="contained"
              color="primary"
              endIcon={<CalendarMonthIcon />}
              onClick={addUserToSchedule}
            >
              Schedule
            </Button>
          )}
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Scheduled users" value="1" />
                  <Tab label="UnScheduled-users" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Box sx={{ height: "418px", width: "100%" }}>
                  <DataGrid
                    sx={{
                      width: "auto",

                      borderRadius: 2,
                      boxShadow: 3,
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#27235C",
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
                          "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                          "& .MuiDataGrid-filterFormValueInput": { width: 200 },
                        },
                      },
                    }}
                    rows={Data}
                    columns={columns1}
                    checkboxSelection
                    pageSizeOptions={Data.length > 5 && [5, 10, 25, 50, 100]}
                    initialState={{
                      ...Data.initialState,
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    onRowSelectionModelChange={handleSelectionChange}
                  />
                </Box>
              </TabPanel>
              <TabPanel value="2">
                <Box sx={{ height: "418px", width: "100%" }}>
                  <DataGrid
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
                          "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                          "& .MuiDataGrid-filterFormValueInput": { width: 200 },
                        },
                      },
                    }}
                    rows={unScheduleUsers}
                    pageSizeOptions={
                      unScheduleUsers.length > 5 && [5, 10, 25, 50, 100]
                    }
                    columns={columns1}
                    checkboxSelection
                    initialState={{
                      ...unScheduleUsers.initialState,
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    onRowSelectionModelChange={handleSelectionChange}
                  />
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Modal.Body>
      </Modal>
      <Modal
        show={updateOpen}
        fullscreen={true}
        onHide={handleCloseUpdate}
        enforceFocus={false}
      >
        <Modal.Header
          style={{
            backgroundColor: "#27235C",
            color: "white",
          }}
        >
          <Modal.Title>Update Scheduling</Modal.Title>{" "}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseUpdate}
            aria-label="close"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Modal.Header>
        <Modal.Body>
          <UpdateSCheduling />
        </Modal.Body>
      </Modal>
      <Dialog open={openLoading} onClose={handleCloseLoading}>
        <DialogTitle sx={{ color: "green" }}>
          <AutoModeIcon /> Please wait a minute....
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <CircularProgress sx={{ ml: "100px" }} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={reScheduleValidate}
        onClose={handleReScheduleclose}
        disableEnforceFocus
        disableScrollLock
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="warning">
                <AlertTitle>Warning !!</AlertTitle>
                You cannot able to ReSchedule the Assessment, because your
                Assessment Date is in past. So, please change the Date.
              </Alert>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={handleReScheduleclose}
            variant="contained"
            autoFocus
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={sameDateResch}
        onClose={() => setsameDateResch(false)}
        disableEnforceFocus
        disableScrollLock
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="info">
                Your Assessment Date is current Date.So, please check the time
                and schedule the assessment.
              </Alert>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setsameDateResch(false);
              dispatch(ScheduleAction(ClorReschlData));
              setUpdateOpen(true);
            }}
            variant="contained"
            autoFocus
            size="small"
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog} disableEnforceFocus>
        <DialogTitle sx={{ color: "orange" }}>
          <NewReleasesIcon /> warning !!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select the users to continue....
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={handleCloseDialog}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteValidate}
        onClose={handleCloseDeleteValidate}
        disableEnforceFocus
        disableScrollLock
      >
        <DialogTitle sx={{ color: "orange" }}>
          <NewReleasesIcon /> warning !!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You cannot able to delete this Assessment, because it is in
            <b> "Scheduled" </b> status
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={() => {
              setDeleteValidate(false);
            }}
            variant="contained"
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openValidate}
        onClose={() => setOpenValidate(false)}
        disableScrollLock
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete the Assessment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => setOpenValidate(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            size="small"
            loading={loading}
            onClick={() => deleteSchedule()}
          >
            yes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reScheduleOpen}
        onClose={() => setReScheduleOpen(false)}
        disableScrollLock
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to ReSchedule the Assessment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => setReScheduleOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            size="small"
            loading={loading}
            onClick={() => reScheduleAssessment(ClorReschlData)}
          >
            yes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        disableScrollLock

      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to cancel the Assessment?
          </DialogContentText>
          <div sx={{ marginTop: "5px", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", }}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Reason"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setReason(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem sx={{ width: "100%", mt: "10px" }} label=" Please choose Postponed Date">
                <MobileDatePicker
                  size="small"
                  onChange={(newValue) => {
                    setPostponedTime(newValue.format('DD/MM/YYYY'));
                    setCancelButtonFlag(false);
                  }}
                  disablePast={true} />
              </DemoItem>
            </LocalizationProvider></div>

        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => setCancelOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            size="small"
            loading={loading}
            onClick={() => cancelScheduling(ClorReschlData)}
            disabled={cancelButtonFlag}
          >
            yes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reScheduleValidate}
        onClose={handleReScheduleclose}
        disableEnforceFocus
        disableScrollLock
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="warning">
                <AlertTitle>Warning !!</AlertTitle>
                You cannot able to ReSchedule the Assessment, because your
                Assessment Date is in past. So, please change the Date.
              </Alert>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={handleReScheduleclose}
            variant="contained"
            autoFocus
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        disableEnforceFocus
        disableScrollLock
        maxWidth={"lg"}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography gutterBottom variant="h6" component="div">
              Assessment Details
            </Typography>
            <Divider />
            <br />
            <Typography variant="body2" color="text.secondary">
              <Chip
                variant="outlined"
                color="primary"
                icon={<QuizIcon />}
                label={assessmentDetails.assessmentName}
              />
              {assessmentDetails.assessmentName !== "skill" && (
                <Chip
                  variant="outlined"
                  color="primary"
                  icon={<ChecklistIcon />}
                  sx={{ ml: "50px" }}
                  label={assessmentDetails.assessmentType + " Assessment"}
                />
              )}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={RemoveUserOpen}
        onClose={() => setRemoveUserOpen(false)}
        disableScrollLock

      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to cancel the Assessment?
          </DialogContentText>
          <div sx={{ marginTop: "5px", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", }}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Reason"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setReason(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem sx={{ width: "100%", mt: "10px" }} label=" Please choose Postponed Date">
                <MobileDatePicker
                  size="small"
                  onChange={(newValue) => {
                    setPostponedTime(newValue.format('DD/MM/YYYY'));
                    setCancelButtonFlag(false);
                  }}
                  disablePast={true} />
              </DemoItem>
            </LocalizationProvider></div>

        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={(e) => setRemoveUserOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={removeUserFromSchedule1}
          >
            yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewAllScheduling;
