import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import loadingAnimation from '../../assets/admin-module-assets/Loading.gif';
import nodatafound from "../../assets/admin-module-assets/no-data-found.jpg";
import {
  findUsersByBatch,
  removeUsersfromBatch,
} from "../../services/admin_module_services/BatchService";
import "../../styles/admin_module_styles/batch.css";
import AdminNavbar from "./AdminNavbar";

const columns = [
  {
    field: "userId",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        UserId
      </Typography>
    ),
    flex: 1,
  },
  {
    field: "userName",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        UserName
      </Typography>
    ),
    flex: 1,
  },
  {
    field: "userEmail",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Email
      </Typography>
    ),
    flex: 1,
  },
  {
    field: "userMobile",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Mobile
      </Typography>
    ),
    flex: 1,
  },
  {
    field: "userStatus",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Status
      </Typography>
    ),
    flex: 1,
  },
];

export default function BatchUser() {
  const batchId = sessionStorage.getItem("batchId");
  const [data, setData] = useState([]);
  const [title, setTitle] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openValidate, setOpenValidate] = useState(false);


  const handleSelectionChange = (selectionModel) => {
    setSelectedIds(selectionModel);
  };

  const loader = useCallback(async () => {
    try {
      setLoading(true);
      const response = await findUsersByBatch(batchId);
      setData(response.data.user);
      setTitle(response.data.batchName);
    } catch (error) {
      console.error("Error loading users by batch:", error);
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    loader();
  }, [count, loader]);

  const handleRemove = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    setOpenValidate(true);
  };

  const handleConfirmRemove = async () => {
    const promise = removeUsersfromBatch(batchId, selectedIds);
    toast.promise(promise, {
      pending: "Removing users from batch...",
      success: "Users removed from batch successfully!",
      error: "Error removing users from batch!",
    });

    try {
      const response = await promise;
      if (response.status === 200) {
        setCount((prevCount) => prevCount + 1);
        navigate("/viewallbatch"); // Navigate to viewallbatch page
      }
    } catch (error) {
      console.error("Error removing users from batch:", error);
    }

    setOpenValidate(false);
  };

  const backToBatch = () => {
    navigate("/viewallbatch");
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      style={{ backgroundColor: "#f2f3f5", minHeight: "100%", height: "100%", flexDirection: "column" }}
    >
      <AdminNavbar />
      <ToastContainer />

      {loading ? (
        <div id="admin_module_loading">
          <img src={loadingAnimation}
            alt="Loading..."
            style={{ mixBlendMode: "multiply" }} />
        </div>
      ) : (
        <div
          className="container-fluid d-flex m-0 p-0"
          style={{ backgroundColor: "#f2f3f5", minHeight: "100vh", height: "100vh", flexDirection: "column" }}>
          {data.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", height: "100vh" }}>
              <div id="admin_module_norecord1"
                style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div>
                  <img
                    src={nodatafound}
                    alt="No Data Found"
                    className="admin_viewallbatch_no-data-found"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
                <div>
                  <h4 id="admin_viewbatch_h4">No Data Found</h4>
                </div>
                <div>
                  <h5 id="admin_viewbatch_marquee">
                    Click Below to Add User into Batch
                  </h5>
                </div>
                <div className="admin_viewbatch_button">
                  <Button
                    variant="contained"
                    onClick={() => navigate("/adduserintobatch")}
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
                    Add User to Batch
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ width: "100%", marginTop: '6%' }}>
              <div className="admin_batch_view_details_page_title">
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
                        {title}
                      </Typography>
                    }
                  />
                </Card>
              </div>
              <Card
                sx={{ marginLeft: "3%", marginRight: "3%", paddingBottom: "1%" }}>
                <div id="admin_userbatch_content">

                  <Button
                    id="admin_module_batchuser_deletebutton"
                    variant="danger"
                    onClick={handleRemove}
                  >
                    Remove User
                  </Button>
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
                        Are you sure you want to remove?
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
                        onClick={handleConfirmRemove}
                      >
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Button
                    id="admin_module_batchuser_backbutton"
                    variant="danger"
                    onClick={backToBatch}
                  >
                    Back
                  </Button>
                </div>

                <Box sx={{ height: "400px", width: "100%", padding: "1%" }}>
                  <DataGrid
                    getRowId={(data) => data.userId}
                    rows={data}
                    scrollbarSize={0}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    initialState={{
                      ...data.initialState,
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                    sx={{
                      width: "100%",
                      backgroundColor: "white",
                      ".MuiDataGrid-columnHeader": {
                        backgroundColor: "#27235c",
                        color: "white",
                        fontWeight: "bold",
                        height: "400px",
                        textAlign: "center",
                        border: "none"
                      },
                      ".MuiDataGrid-columnHeaderCheckbox": {
                        backgroundColor: "#27235c",
                      },
                      ".MuiDataGrid-columnHeaderCheckbox .MuiIconButton-root": {
                        color: "white",
                      },
                      "& .MuiDataGrid-scrollbar": {
                        display: "none",
                      },
                      "& .MuiDataGrid-menuIconButton": {
                        color: "white",
                      },
                      "& .MuiDataGrid-sortIcon": {
                        color: "white",
                      },
                      border: "none",
                      "& .MuiDataGrid-main": {
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                    }}
                  />
                </Box>
              </Card>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
