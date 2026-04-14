import ReplyIcon from "@mui/icons-material/Reply";
import { Box, Button, Card, CardHeader, Tooltip, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  userRequests,
  userRequestsEnable,
} from "../../../services/admin_module_services/UserService";
import AdminNavbar from "../AdminNavbar";

const UserRequestHistory = () => {
  const [rowsdata, setRowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [count]);

  const loadData = async () => {
    console.log("hello");
    const userRequest = await userRequests();
    const userDetails = userRequest.data;
    console.log(userDetails);
    const rowData = userDetails
      .filter(
        (users) =>
          users.requestStatus === "REJECTED" ||
          users.requestStatus === "RESOLVED"
      ) // filter by status
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
  };
  const handleView = (requestDescription) => {
    console.log(requestDescription);
    setDescription(requestDescription);
    setOpen(true);
  };
  const handleEnable = (userId) => {
    console.log("enable");
    console.log(userId);
    const toastId = toast.loading("Updating Status...", {
      position: "top-right",
    });
    const status = "ACTIVE";
    userRequestsEnable(userId)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(toastId);
          toast.success("user successfully unlocked");
          setCount(count + 1);
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
      headerName: "Status",
      flex: 1,
    },
    // {
    //   field: "status",
    //   headerClassName: "super-app-theme--header",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: "Change Status",
    //   flex: 1,
    //   renderCell: ({ row }) => [
    //     <div>
    //       <>
    //         {" "}
    //         <Tooltip title="Unlock User">
    //           <Button
    //             variant="contained"
    //             color="success"
    //             onClick={() => handleEnable(row.id)}
    //             sx={{ height: "30px", width: "80px" }}
    //           >
    //             Unlock
    //           </Button>
    //         </Tooltip>
    //         <Tooltip title="Reject Request">
    //           <Button
    //             variant="contained"
    //             color="error"
    //             sx={{ height: "30px", width: "80px", marginLeft: "10px" }}
    //             onClick={() => handleEnable(row.id)}
    //           >
    //             Reject
    //           </Button>
    //         </Tooltip>
    //       </>
    //     </div>,
    //   ],
    // },
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
                  User Requests History
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
              onClick={() => navigate("/userRequest")}
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
            {/* <Button
            variant="contained"
            // onClick={() => navigate("/admindashboard")}
            sx={{
              color: "white",
              backgroundColor: "#27235c",
              "&:hover": {
                backgroundColor: "#97247e",
                color: "white",
              },
            }}
            endIcon={<HistoryIcon />}
          >
            Request History
          </Button> */}
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
    </div>
  );
};

export default UserRequestHistory;
