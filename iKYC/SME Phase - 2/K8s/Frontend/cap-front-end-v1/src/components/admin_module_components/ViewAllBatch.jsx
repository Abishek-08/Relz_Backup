import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Card,
  CardHeader,
} from "@mui/material";
import "../../styles/admin_module_styles/batch.css";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  DataGrid,
  GridActionsCellItem,
  GridLogicOperator,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  addBatch,
  checkBatchName,
  getAllBatch,
  removeBatch,
} from "../../services/admin_module_services/BatchService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";
import UpdateBatch from "./UpdateBatch";
import nodatafound from "../../assets/admin-module-assets/no-data-found.jpg";
import { red } from "@mui/material/colors";
import loadingAnimation from "../../assets/admin-module-assets/Loading.gif";

const ViewAllBatch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const batch = useSelector((state) => state.batch.batch);
  const [show, setShow] = useState(false);
  const [showBatchError, setShowBatchError] = useState(false);
  const [openValidate, setOpenValidate] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [rows, setRows] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [count, setCount] = useState(0);
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [dataloading, setDataLoading] = useState(true); // Add a loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const add = async (data) => {
    setLoading(true);
    try {
      await addBatch(data);
      setCount(count + 1);
      setShow(false);
      toast.success("Batch added successfully!");
      navigate("/viewAllBatch");
    } catch (error) {
      toast.error("Error adding batch!");
      console.error("Error adding batch:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "batchName",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Batch Name
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "batchSize",
      type: "number",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Batch Size
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "presentCount",
      type: "number",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Present Count
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "batchCreationDate",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Creation Date
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "batchUpdationDate",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Updation Date
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "batchDescription",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Description
        </Typography>
      ),
      flex: 1,
      headerClassName: "custom-header",
    },
    {
      field: "actions",

      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Actions
        </Typography>
      ),
      filterable: false,
      flex: 1,
      headerClassName: "custom-header",
      renderCell: ({ row }) => [
        <Tooltip title="View Users" arrow key="view">
          <GridActionsCellItem
            icon={<RemoveRedEyeOutlined />}
            label="viewUsers"
            className="textPrimary"
            color="primary"
            onClick={() => handleView(row.id)}
          />
        </Tooltip>,
        <Tooltip title="Delete" arrow key="delete">
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: red[500] }} />}
            label="delete"
            className="textPrimary"
            color="inherit"
            onClick={() => {
              setDeleteId(row.id);
              setOpenValidate(true);
            }}
          />
        </Tooltip>,
        <Tooltip title="Edit" arrow key="edit">
          <GridActionsCellItem
            icon={<EditIcon />}
            label="edit"
            className="textPrimary"
            color="inherit"
            onClick={() => {
              setBatchId(row.id);
              setOpenEditModal(true);
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  const loadData = async () => {
    try {
      const response = await getAllBatch();
      const batch = response.data;
      const rowsData = batch.map((batchItem) => ({
        id: batchItem.batchId,
        batchName: batchItem.batchName,
        batchSize: batchItem.batchSize,
        presentCount: batchItem.presentCount,
        batchCreationDate: batchItem.batchCreationDate,
        batchUpdationDate: batchItem.batchUpdationDate,
        batchDescription: batchItem.batchDescription,
      }));
      setRows(rowsData);
      // setDataLoading(false);
    } catch (error) {
      console.error("Error loading batch data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [count]);

  const handleDelete = async () => {
    setOpenValidate(false);
    try {
      const res = await removeBatch(deleteId);
      if (res.status === 200) {
        toast.success("Batch Deleted Successfully");
        setCount(count + 1);
      } else if (res.status === 404) {
        toast.error("Batch not found");
      } else {
        toast.error("Error deleting batch");
      }
    } catch (error) {
      // toast.error("An unexpected error occurred");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };

  const handleBlur = () => {
    checkBatchName(batchName)
      .then(() => setShowBatchError(true))
      .catch(() => setShowBatchError(false));
  };

  const handleView = (batchId) => {
    sessionStorage.setItem("batchId", batchId);
    navigate(`/batchview`);
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="page_resposive"
      style={{
        backgroundColor: "#f2f3f5",
        minHeight: "100vh",
        height: "auto",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#f2f3f5",
          minHeight: "100vh",
          height: "auto",
          width: "100%",
        }}
      >
        <div>
          <AdminNavbar />
        </div>
        <div className="admin_module_viewallbatch">
          {dataloading ? (
            <div className="admin_view_all_batch_loader">
              <img
                src={loadingAnimation}
                style={{ mixBlendMode: "multiply" }}
                alt="loading"
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {rows.length === 0 ? (
                <div id="admin_module_norecord">
                  <div>
                    <img
                      src={nodatafound}
                      alt="No Data Found"
                      className="admin_viewallbatch_no-data-found"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <div>
                    <h4 id="admin_viewbatch_h4">No Data Found</h4>
                  </div>
                  <div>
                    <h5 id="admin_viewbatch_marquee">
                      Click Below to Add Batch
                    </h5>
                  </div>
                  <div className="admin_viewbatch_button">
                    <Button
                      variant="contained"
                      onClick={handleShow}
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
                      Create New Batch
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  style={{ width: "100%", marginRight: "3%", marginLeft: "3%" }}
                >
                  <div id="admin_batch_heading">
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
                            BATCH DETAILS
                          </Typography>
                        }
                      />
                    </Card>
                  </div>
                  <Card>
                    <div id="admin_viewallbatch_content">
                      <Button
                        variant="contained"
                        id="admin_batch_add"
                        onClick={handleShow}
                        sx={{
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                          },
                        }}
                      >
                        CREATE BATCH
                      </Button>
                    </div>

                    <Box sx={{ width: "100%" }}>
                      <Collapse in={open}>
                        <Alert
                          severity="warning"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => setOpen(false)}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2, ml: 2, mr: 2, fontWeight: "700" }}
                        >
                          Batch can't be deleted because users are mapped to
                          this batch!
                        </Alert>
                      </Collapse>
                    </Box>

                    <Box
                      sx={{
                        minHeight: "400px",
                        maxHeight: "400px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        paddingLeft: "1%",
                        paddingRight: "1%",
                      }}
                    >
                      <DataGrid
                        scrollbarSize={0}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={
                          rows.length > 5 && [5, 10, 25, 50, 100]
                        }
                        initialState={{
                          ...rows.initialState,
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
                  </Card>
                </div>
              )}
            </div>
          )}
           {/* delete batch confirmation */}
          <Dialog
            open={openValidate}
            onClose={() => setOpenValidate(false)}
            disableScrollLock
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the Batch?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenValidate(false)}
                id="admin_module_viewall_cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                id="admin_module_viewall_delete_button"
              >
                Delete
                <DeleteIcon />
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Modal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          aria-labelledby="edit-batch-title"
          aria-describedby="edit-batch-description"
        >
          <Box
            sx={{
              width: 400,
              padding: 4,
              backgroundColor: "white",
              margin: "auto",
              marginTop: "10%",
            }}
          >
            <Typography variant="h6" component="h2">
              Edit Batch
            </Typography>
            <UpdateBatch
              batchId={batchId}
              handleClose={() => setOpenEditModal(false)}
            />
          </Box>
        </Modal>
        <ToastContainer />
      </div>
            {/* add batch modal */}
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(add)}
          sx={{
            width: 400,
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <div id="admin_viewallbatch_add">
            <Typography variant="h6" component="h6" marginLeft={11}>
              <p id="admin_viewallbatch_p">ADD NEW BATCH</p>
            </Typography>
          </div>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                autoComplete="batchName"
                name="batchName"
                required
                fullWidth
                id="batchName"
                label="Batch Name"
                autoFocus
                {...register("batchName", {
                  required: "Please fill the field",
                  onChange: (e) => setBatchName(e.target.value),
                  onBlur: handleBlur,
                })}
                error={!!errors.batchName || showBatchError}
                helperText={
                  errors.batchName?.message ||
                  (showBatchError && "Batch Name Already Exists")
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="batchDescription"
                label="Batch Description"
                name="batchDescription"
                autoComplete="batchDescription"
                {...register("batchDescription", {
                  required: "Please fill the field",
                })}
                error={!!errors.batchDescription}
                helperText={errors.batchDescription?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="batchSize"
                label="Batch Size"
                name="batchSize"
                autoComplete="batchSize"
                type="number"
                {...register("batchSize", {
                  required: "Please fill the field",
                  pattern: {
                    value: /^([1-9][0-9]?|100)$/,
                    message: "Please enter a valid batch size",
                  },
                })}
                error={!!errors.batchSize}
                helperText={errors.batchSize?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                // color="primary"
                disabled={showBatchError || loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#27235c",
                  "&:hover": {
                    backgroundColor: "#97247e",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewAllBatch;
