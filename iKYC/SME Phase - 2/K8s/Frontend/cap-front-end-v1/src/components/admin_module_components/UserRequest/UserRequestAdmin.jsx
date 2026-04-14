import HistoryIcon from "@mui/icons-material/History";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Button as Btn } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  userRequests,
  userRequestsEnable,
} from "../../../services/admin_module_services/UserService";
import loadingAnimation from "../../../assets/admin-module-assets/Loading.gif";
import AdminNavbar from "../AdminNavbar";

const UserRequestAdmin = () => {
  const [rowsdata, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [acceptConfirmation, setAcceptConfirmation] = useState(false);
  const [rejectConfirmation, setRejectConfirmation] = useState(false);
  const [userId, setUserId] = useState(0);
  const [requestId, setRequestId] = useState(0);
  const [requestStatus, setRequestStatus] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [count]);

  const loadData = async () => {
    try {
      console.log("hello");
      const userRequest = await userRequests();
      const userDetails = userRequest.data;
      console.log(userDetails);
      const rowData = userDetails
        .filter((users) => users.requestStatus === "PENDING") // filter by status
        .map((users) => ({
          id: users.user.userId,
          userName: users.user.userName,
          email: users.user.userEmail,
          status: users.user.userStatus,
          requestId: users.userRequestId,
          requestDescription: users.description,
          requestStatus: users.requestStatus,
        }));
      console.log(rowData);
      setRowsData(rowData);
    } catch (error) {
      console.error("Error loading data:", error);
      // You can also update the state with an error message or a flag to indicate that an error occurred
      // setError(true);
      // setErrorMsg("Failed to load data");
    } finally {
      setLoading(false); // always set loading to false, regardless of success or error
    }
  };
  const handleView = (requestDescription) => {
    console.log(requestDescription);
    setDescription(requestDescription);
    setOpen(true);
  };
  const handleEnable = () => {
    setLoading(true);
    setAcceptConfirmation(false);
    setRejectConfirmation(false);
    console.log(userId);
    console.log(requestId);
    const toastId = toast.loading("Updating Status...", {
      position: "top-right",
    });
    userRequestsEnable(userId, requestId, requestStatus)
      .then((response) => {
        if (response.status === 200) {
          if (requestStatus === "RESOLVED") {
            toast.dismiss(toastId);
            toast.success("user successfully unlocked");
            setCount(count + 1);
          } else if (requestStatus === "REJECTED") {
            toast.dismiss(toastId);
            toast.success("request succesfully Rejected");
            setCount(count + 1);
          }
        } else {
          toast.error("Status Updation Failed.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.dismiss(toastId);
        toast.error("Status Updation Failed.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
      });
  };

  const handleConfirmation = (id, requestId, status) => {
    console.log("id" + id + "reque" + requestId + "status" + status);
    setUserId(id);
    setRequestId(requestId);
    setRequestStatus(status);
    if (status === "RESOLVED") {
      setAcceptConfirmation(true);
    } else if (status === "REJECTED") {
      setRejectConfirmation(true);
    }
  };

  const columns = [
    {
      field: "userName",
      headerClassName: "super-app-theme--header",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerClassName: "super-app-theme--header",
      headerName: "Email",
      flex: 1,
    },

    {
      field: "description",
      headerClassName: "super-app-theme--header",
      headerName: "Request Description",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => [
        <Tooltip title="View Description" arrow key="view">
          <Button
            variant="contained"
            color="success"
            style={{
              size: "20px",
              width: "50px",
              height: "25px",
            }}
            onClick={() => handleView(row.requestDescription)}
          >
            View
          </Button>
        </Tooltip>,
      ],
    },
    {
      field: "requestStatus",
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      headerName: "Change Status",
      flex: 1,
      renderCell: ({ row }) => [
        <div>
          <Dropdown as={ButtonGroup}>
            <Btn
              variant="warning"
              style={{ height: "30px", width: "70px", fontSize: "12px" }}
            >
              {row.requestStatus}
            </Btn>

            <Dropdown.Toggle
              split
              variant="warning"
              id="dropdown-split-basic"
              style={{ height: "30px" }}
            />

            <Dropdown.Menu
              style={{
                backgroundColor: "#fff",

                ":hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <Dropdown.Item
                onClick={() =>
                  handleConfirmation(row.id, row.requestId, "RESOLVED")
                }
              >
                Resolve
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  handleConfirmation(row.id, row.requestId, "REJECTED")
                }
              >
                Reject
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <div className="d-flex container-fluid m-0 p-0">
        <AdminNavbar />
      </div>
      <div
        style={{
          backgroundColor: "#f2f3f5",
          minHeight: "90vh",
          maxHeight: "auto",
          width: "100%",
          paddingTop: "4%",
          paddingRight: "3%",
          paddingLeft: "3%",
        }}
      >
        <div>
          {loading && (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <img
                  src={loadingAnimation}
                  style={{ mixBlendMode: "multiply" }}
                  alt="loading"
                />
              </div>
            </div>
          )}
          <Card
            sx={{
              color: "white",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              height: "50px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2%",
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  User Requests
                </Typography>
              }
            />
          </Card>
        </div>

        <Card sx={{ marginTop: "1%", padding: "1%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "1%",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/admindashboard")}
              sx={{
                color: "white",
                backgroundColor: "#27235c",
                "&:hover": {
                  backgroundColor: "#97247e",
                  color: "white",
                },
              }}
              endIcon={<ReplyIcon />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/userrequesthistory")}
              sx={{
                color: "white",
                backgroundColor: "#808080",
                "&:hover": {
                  backgroundColor: "#97247e",
                  color: "white",
                },
              }}
              endIcon={<HistoryIcon />}
            >
              Request History
            </Button>
          </div>

          <Box
            sx={{
              width: "100%",
              minHeight: "400px",
              maxHeight: "400px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DataGrid
              scrollbarSize={0}
              rows={rowsdata}
              columns={columns}
              pageSizeOptions={rowsdata.length > 5 && [5, 10, 25, 50, 100]}
              initialState={{
                ...rowsdata.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              sx={{
                zIndex: "0",
                width: "1200px",
                height: "400px",
                backgroundColor: "white",
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
                "& .MuiDataGrid-main": {},
                "& .MuiDataGrid-cell": {
                  overflow: "visible",
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
                        theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
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
        <ToastContainer />
        <Dialog
          // fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Users Request Description
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Resolved status  Confirmation */}
      <Dialog
        open={acceptConfirmation}
        onClose={() => setAcceptConfirmation(false)}
        id="code-deletebox"
      >
        <DialogTitle id="codeDelete-confirm">Confirm Unlock</DialogTitle>
        <DialogContent>Are you sure you want to Unlock the User?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAcceptConfirmation(false)}
            id="cancelCode-deletebtn"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEnable()}
            id="deleteCode-deletebtn"
            autoFocus
            style={{ backgroundColor: "green", color: "white" }}
            // endIcon={LockOpenIcon}
          >
            <LockOpenIcon />
            Unlock
          </Button>
        </DialogActions>
      </Dialog>
      {/* Rejected status Confirmation */}
      <Dialog
        open={rejectConfirmation}
        onClose={() => setRejectConfirmation(false)}
        id="code-deletebox"
      >
        <DialogTitle id="codeDelete-confirm">Confirm Reject</DialogTitle>
        <DialogContent>
          Are you sure you want to Reject the request?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectConfirmation(false)}
            id="cancelCode-deletebtn"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEnable()}
            id="deleteCode-deletebtn"
            autoFocus
            // endIcon={LogoutRoundedIcon}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserRequestAdmin;
