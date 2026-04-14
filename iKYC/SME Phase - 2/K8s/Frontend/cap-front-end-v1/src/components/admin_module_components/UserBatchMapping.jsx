import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useCallback } from "react";
// import { Button } from ";
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import { Alert, Button, Collapse, IconButton, Typography, Paper, Card, CardContent, CardHeader, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  addUserstoBatch,
  getAllBatch
} from "../../services/admin_module_services/BatchService";
import {getunmappedusers} from "../../services/admin_module_services/UserService";
import { useNavigate } from "react-router-dom";
import "../../styles/admin_module_styles/batch.css";
import nodatafound from "../../assets/admin-module-assets/no-data-found.jpg";
import loadingAnimation from '../../assets/admin-module-assets/Loading.gif'

const columns = [
  {
    field: "userId",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        UserId
      </Typography>
    ),
    flex: 1,
    headerClassName: "admin-userbatch-mapping",
  },
  {
    field: "userName",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        UserName
      </Typography>
    ),
    flex: 1,
    headerClassName: "admin-userbatch-mapping",
  },
  {
    field: "userEmail",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Email
      </Typography>
    ),
    flex: 1,
    headerClassName: "admin-userbatch-mapping",
  },
  {
    field: "userMobile",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Mobile
      </Typography>
    ),
    flex: 1,
    headerClassName: "admin-userbatch-mapping",
  },
  {
    field: "userStatus",
    headerName: (
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Status
      </Typography>
    ),
    flex: 1,
    headerClassName: "admin-userbatch-mapping",
    renderCell: ({ row }) => {
      if (row.userStatus === "ACTIVE") {
        return [<Chip label={row.userStatus} color="success" />];
      } else {
        return [<Chip label={row.userStatus} color="error" />];
      }
    },
  },
];

const UserBatchMapping = () => {
  const [unMappedUser, setUnMappedaUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [batchSelected, setBatchSelected] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const [dataloading, setDataLoading] = useState(true); // Add a loading state

  const handleSelectionChange = (selectionModel) => {
    setUserData(selectionModel);
  };

  console.log(userData);

  const addUser = async () => {
    if (!batchSelected) {
      toast.error("Please choose a batch");
      return;
    }

    if (userData.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const promise = addUserstoBatch(batchSelected, userData);
    toast.promise(promise, {
      pending: "Adding user to batch...",
      success: "User added to batch successfully!",
      error: "Error adding user to batch!",
    });

    promise
      .then((response) => {
        if (response.status === 200) {
          toast.success("User added to the batch Successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          setCount((prevCount) => prevCount + 1);
          navigate("/viewAllBatch");
        }
      })
      .catch((error) => {
        setOpen(true);
      });
  };

  const getBatch = useCallback(() => {
    getAllBatch().then((res) => {
      setBatchData(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getunmappedusers(), getBatch()])
      .then(([usersResponse]) => {
        setUnMappedaUser(usersResponse.data);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [count, getBatch]);

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="page_resposive"
      style={{ backgroundColor: "#f2f3f5", minHeight: "100vh", height: "auto", width: "100%", flexDirection: "column" }}
    >
      <div>
        <AdminNavbar />
      </div>

      {dataloading ? (
          <div className="admin_view_all_user_loader" style={{width: "100%"}}>
           <img src={loadingAnimation} 
              style={{mixBlendMode: "multiply"}}/>
          </div>
        ) : (
      <div style={{ width: "100%", paddingTop: "8%", paddingRight: "3%", paddingLeft: "3%" }}>
        {unMappedUser.length === 0 ? (
          <div id="admin_module_norecord" style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={nodatafound}
              style={{
                mixBlendMode: 'multiply'
              }}
              alt="No Data Found"
              className="admin_viewallbatch_no-data-found"
            />
            <h4 id="admin_viewbatch_h4">No Data Found</h4>
            <h5 id="admin_viewbatch_marquee">Click Below to Add Users</h5>
            <div className="admin_viewbatch_button">
              <Button
                variant="contained"
                onClick={() => navigate("/adduser")}
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
                Create Users
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <div className="admin_view_details_page_title">
              <Card
                sx={{
                  color: "white",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  height: "50px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "1%"
                }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      USER BATCH MAPPING
                    </Typography>
                  }
                />
              </Card>
            </div>
            <div style={{ width: "100%" }}>
              <Card>
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "1%", paddingRight: "1%", paddingBottom: "0.5%" }}>
                    <div className="custom-select-container">
                      <select
                        className="custom-select"
                        onChange={(e) => setBatchSelected(e.target.value)}
                        id="admin_module_batch_dropdown"
                      >
                        <option
                          value=""
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          Select a batch
                        </option>
                        {batchData.map((batch) => (
                          <option
                            style={{ backgroundColor: "white", color: "black" }}
                            key={batch.batchId}
                            value={batch.batchId}
                          >
                            {batch.batchName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div id="admin_userbatchmapping_content">

                      <Button
                        id="admin_module_batch_user_addbutton"
                        variant="contained"
                        onClick={addUser}
                        sx={{
                          backgroundColor: "#27235c",
                          width: "50px",
                          "&:hover": {
                            backgroundColor: "#97247e",
                          },
                        }}
                      >
                        ADD USERS TO BATCH
                      </Button>
                    </div>
                  </div>
                  <Box sx={{height: "400px"}}>
                    <DataGrid
                      getRowId={(row) => row.userId}
                      rows={unMappedUser}
                      columns={columns}
                      checkboxSelection
                      onRowSelectionModelChange={handleSelectionChange}
                      pageSizeOptions={
                        unMappedUser.length > 5 && [5, 10, 25, 50, 100]
                      }
                      initialState={{
                        ...unMappedUser.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      sx={{
                        width: "100%",
                        height: "400px",
                        backgroundColor: "white",
                        ".MuiDataGrid-columnHeaderCheckbox": {
                          backgroundColor: "#27235c",
                        },
                        ".MuiDataGrid-columnHeaderCheckbox .MuiIconButton-root": {
                          color: "white",
                        },
                        "& .MuiDataGrid-checkboxInput": {
                          color: "#9E9AD9",
                        }
                        ,
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
                    />
                  </Box>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      )}

      <Collapse in={open}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          style={{ marginTop: "10%" }}
        >
          Batch Maximum size is Exceeded
        </Alert>
      </Collapse>
      <ToastContainer />

    </div>
  );
};

export default UserBatchMapping;
