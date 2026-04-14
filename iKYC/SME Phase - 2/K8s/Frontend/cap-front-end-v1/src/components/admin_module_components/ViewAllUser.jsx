import DeleteIcon from "@mui/icons-material/Delete";
import { TableContainer, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Box } from "@mui/material";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  InputAdornment,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import nodatafound from "../../assets/admin-module-assets/no-data-found.jpg";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState, useCallback } from "react";
import { Button as BootstrapButton, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAction } from "../../redux/actions/admin_module_actions/UserAction";
import {
  deleteUser,
  enableUserStatus,
  getUsers,
  updateUserStatus,
} from "../../services/admin_module_services/UserService";
import AddUserModel from "../admin_module_components/AddUserModel";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import "../../styles/admin_module_styles/user.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Tooltip from "@mui/material/Tooltip";
import ViewUserDetails from "./ViewUserDetails";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import loadingAnimation from "../../assets/admin-module-assets/Loading.gif";

const ViewAllUser = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  console.log(users);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayusers, setDisplayUsers] = useState();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [openViewModal, setOpenViewModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [openValidate, setOpenValidate] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [changeStatusId, setChangeStatusId] = useState(0);
  const [openDisableModal, setOpenDisableModal] = useState(false);
  const [openViewUserDetails, setOpenViewUserDetails] = useState(false);
  const [dataloading, setDataLoading] = useState(true); // Add a loading state

  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState("name");

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  // Fetch users from API
  const loadData = useCallback(async () => {
    try {
      const response = await getUsers();
      dispatch(UserAction(response.data));
      setFilteredUsers(response.data);
      setDisplayUsers(response.data);
      //setDataLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setDataLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  console.log(rowsPerPage)
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Filtering users based on search term
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredUsers = users.filter((user) => {
      switch (filterBy) {
        case "name":
          return user.userName.toLowerCase().includes(searchTerm);
        case "email":
          return user.userEmail.toLowerCase().includes(searchTerm);
        case "mobile":
          return (
            user.userMobile && user.userMobile.toString().includes(searchTerm)
          );
        default:
          return true;
      }
    });
    setFilteredUsers(filteredUsers);
    setPage(1);
  };
  // Modal handlers
  const handleShowAddUserModal = () => setShowAddUserModal(true);
  const handleCloseAddUserModal = () => setShowAddUserModal(false);

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setOpenViewUserDetails(true);
  };
  const handleCloseViewUserDetails = () => setOpenViewUserDetails(false);

  // Delete confirmation modal
  const deleteFunction = (userId) => {
    setOpenValidate(true);
    setDeleteId(userId);
  };

  // Delete user
  const handleDelete = async (userId) => {
    setOpenValidate(false);
    const toastId = toast.loading("Deleting user...", {
      position: "top-right",
    });
    try {
      const response = await deleteUser(userId);
      dispatch(UserAction(response.data));
      toast.dismiss(toastId);
      toast.success("User Deleted Successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.dismiss(toastId);
      toast.error("Failed to delete user", {
        position: "top-right",
      });
    } finally {
      loadData();
    }
  };

  // Disable user
  const openDisableFunction = (userId) => {
    setOpenDisableModal(true);
    setChangeStatusId(userId);
  };

  const [loading, setLoading] = useState(false);

  const handleDisable = () => {
    setOpenDisableModal(false);
    const toastId = toast.loading("Updating Status...", {
      position: "top-right",
    });
    const status = "INACTIVE";
    updateUserStatus(changeStatusId, status)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(toastId);
          loadData();
        }
      })
      .catch((error) => {
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
      });
  };

  const handleEnable = (userId) => {
    const toastId = toast.loading("Updating Status...", {
      position: "top-right",
    });
    const status = "ACTIVE";
    enableUserStatus(userId, status)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(toastId);
          loadData();
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
  // Calculate pagination
  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div id="admin_module_viewalluser">
      <ToastContainer />
      <div className="admin_view_all_user_row">
        {dataloading ? (
          <div className="admin_view_all_user_loader">
            {/* <CircularProgress /> */}
            <img src={loadingAnimation} style={{ mixBlendMode: "multiply" }} />
          </div>
        ) : displayusers.length === 0 ? (
          <div className="admin_module_norecord">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={nodatafound}
                  alt="No Data Found"
                  className="admin_viewallbatch_no-data-found"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h4 id="admin_viewbatch_h4">No Data Found</h4>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h5 id="admin_viewbatch_marquee">Click Below to Add User</h5>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  id="admin-module-adduser-btn"
                  variant="contained"
                  onClick={handleShowAddUserModal}
                  sx={{
                    mt: 1,
                    mb: 2,
                    color: "white",
                    backgroundColor: "#27235c",
                    "&:hover": {
                      backgroundColor: "#97247e",
                      color: "white",
                    },
                  }}
                >
                  ADD NEW USER
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div id="admin-module-viewalldetails">
            <div className="admin_view_all_user_details_page_title">
              <Card
                sx={{
                  color: "white",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      VIEW ALL USERS
                    </Typography>
                  }
                />
              </Card>
            </div>
            <div className="admin_view_details_table">
              <Card sx={{ width: "100%" }}>
                <CardContent sx={{ width: "100%" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FormControl
                          variant="outlined"
                          sx={{ minWidth: 120, mr: 2 }}
                        >
                          <InputLabel htmlFor="filter-select">
                            Filter By
                          </InputLabel>
                          <Select
                            value={filterBy}
                            onChange={handleFilterChange}
                            id="filter-select"
                            label="Filter By"
                            displayEmpty
                            sx={{
                              height: "40px",
                              borderRadius: "10px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#27235c",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#97247e",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#97247e",
                                },
                            }}
                          >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="mobile">Mobile</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          value={searchTerm}
                          onChange={handleSearch}
                          variant="outlined"
                          autoComplete="off"
                          placeholder={`Search by ${filterBy}...`}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchOutlinedIcon />
                              </InputAdornment>
                            ),
                            style: {
                              borderRadius: "10px",
                              height: "40px",
                            },
                          }}
                          sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#27235c",
                              },
                              "&:hover fieldset": {
                                borderColor: "#97247e",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#97247e",
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: "right" }}>
                      <Button
                        id="admin-module-adduser-btn"
                        variant="contained"
                        onClick={handleShowAddUserModal}
                        sx={{
                          mt: 1,
                          mb: 2,
                          color: "white",
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                            color: "white",
                          },
                        }}
                      >
                        ADD NEW USER
                      </Button>
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="demo-simple-select">
                          Rows per Page
                        </InputLabel>
                        <Select
                          value={rowsPerPage}
                          id="demo-simple-select"
                          onChange={handleChangeRowsPerPage}
                          label="Rows per Page"
                          displayEmpty
                          inputProps={{ "aria-label": "rows per page" }}
                          sx={{
                            minWidth: 20,
                            "& .MuiSelect-select": {
                              height: "13px", // adjust the height to your liking
                              padding: "8px", // optional, adjust the padding if needed
                            },
                          }}
                          startAdornment={
                            <InputAdornment
                              position="start"
                              style={{ marginTop: "5px" }}
                            >
                              {/* <Typography variant="body2">Rows:</Typography> */}
                            </InputAdornment>
                          }
                        >
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TableContainer
                    sx={{
                      minHeight: 300,
                      maxHeight: 300,
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px", // decrease the width of the scrollbar
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ccc", // change the color of the scrollbar thumb to light grey
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f0f0f0", // change the color of the scrollbar track to light grey
                      },
                    }}
                  >
                    <Table>
                      <TableHead id="admin_module_viewalluser_header">
                        <TableRow id="admin_module_viewalluser_header_row">
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>S.No</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Profile</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Name</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              textAlign: "center",
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Email</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              textAlign: "center",
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Mobile</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              textAlign: "center",
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Status</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              textAlign: "center",
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Action</b>
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              position: "sticky",
                              top: 0,
                              textAlign: "center",
                              alignItems: "center",
                              backgroundColor: "#27235c",
                              zIndex: 1,
                            }}
                          >
                            <b>Change Status</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody id="admin_module_viewalluser_content">
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} align="center">
                              <h1
                                style={{
                                  fontSize: 24,
                                  color: "#333",
                                  fontWeight: 400,
                                }}
                              >
                                No Data Found
                              </h1>
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentItems.map((user, index) => (
                            <TableRow key={user.userId}>
                              <TableCell>
                                {indexOfFirstItem + index + 1}
                              </TableCell>
                              <TableCell>
                                <Avatar
                                  alt={user.userName}
                                  src={`data:image/jpeg;base64,${user.userImageData}`}
                                />
                              </TableCell>
                              <TableCell>{user.userName}</TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.userEmail}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.userMobile}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.userStatus === "ACTIVE" ? (
                                  <Chip
                                    label={user.userStatus}
                                    color="success"
                                  />
                                ) : (
                                  <Chip label={user.userStatus} color="error" />
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="error"
                                  onClick={() => deleteFunction(user.userId)}
                                >
                                  <DeleteIcon />
                                </Button>
                                <Button
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <RemoveRedEyeOutlined />
                                </Button>
                              </TableCell>
                              <TableCell>
                                {user.userStatus === "ACTIVE" ? (
                                  <Button
                                    color="error"
                                    size="large"
                                    onClick={() =>
                                      openDisableFunction(user.userId)
                                    }
                                    sx={{
                                      color: "LightBlue",
                                      transition: "all 0.6s ease-in-out",
                                    }}
                                  >
                                    <Tooltip title="Disable">
                                      <ToggleOnIcon fontSize="large" />
                                    </Tooltip>
                                  </Button>
                                ) : (
                                  <Button
                                    size="large"
                                    sx={{
                                      color: "grey",
                                      transition: "all 0.6s ease-in-out",
                                    }}
                                    onClick={() => handleEnable(user.userId)}
                                    className="admin_view_all_user_enable_button"
                                  >
                                    <Tooltip title="Enable">
                                      <ToggleOffIcon fontSize="large" />
                                    </Tooltip>
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* // Custom Pagination */}
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <Grid item xs={4}>
                      {/* Empty grid item for spacing */}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      container
                      justifyContent="center"
                      alignItems="center"
                      id="admin-module-arrowbutton"
                    >
                      <Pagination
                        count={pageCount}
                        page={page}
                        onChange={() => handleChangePage}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Typography variant="body2" sx={{ mr: 0 }}>
                        {/* Rows per page: */}
                      </Typography>
                      {/* <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    displayEmpty
                    inputProps={{ "aria-label": "rows per page" }}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select> */}
                    </Grid>
                  </Grid>
                  {/* View User Details Modal */}
                  <Dialog
                    open={openViewUserDetails}
                    onClose={handleCloseViewUserDetails}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                      style: {
                        borderRadius: "20px",
                        padding: "20px",
                        width: "90%",
                        maxWidth: "800px",
                      },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      User Details
                    </DialogTitle>
                    <DialogContent>
                      {selectedUser && <ViewUserDetails user={selectedUser} />}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleCloseViewUserDetails}
                        color="primary"
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          padding: "8px 20px",
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                          },
                        }}
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* Delete confirmation dialog */}
                  <Dialog
                    open={openValidate}
                    onClose={() => setOpenValidate(false)}
                    disableScrollLock
                  >
                    <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
                      Alert
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the user?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="plain"
                        color="neutral"
                        onClick={() => setOpenValidate(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(deleteId)}
                      >
                        Delete
                        <DeleteIcon />
                      </Button>
                    </DialogActions>
                  </Dialog>
                </CardContent>

                {/* Disable user */}
                <Dialog
                  open={openDisableModal}
                  onClose={() => setOpenDisableModal(false)}
                  disableScrollLock
                >
                  <DialogTitle id="alert-dialog-title" sx={{ color: "red" }}>
                    Alert
                  </DialogTitle>
                  <Divider />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to Disable the user?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="plain"
                      color="neutral"
                      onClick={() => setOpenDisableModal(false)}
                    >
                      No
                    </Button>
                    <Button onClick={handleDisable}>YES</Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </div>
          </div>
        )}
      </div>
      {/* Add User Modal */}
      <Modal
        closeButton
        show={showAddUserModal}
        onHide={handleCloseAddUserModal}
        style={{ marginTop: "5%" }}
      >
        <Modal.Body>
          <AddUserModel onClose={handleCloseAddUserModal} loadData={loadData} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewAllUser;
