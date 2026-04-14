import React, { useState, useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  DataGrid,
  GridActionsCellItem,
  GridLogicOperator,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { findUsersByBatch } from "../../../services/admin_module_services/BatchService";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../../../styles/admin_module_styles/report.css";
import { getBatchReport, getSkillBatchReport } from "../../../services/admin_module_services/Report_Service";
/**
 * @author ranjitha.rajaram
 * @version 5.0
 * @since 26/07/2024
 * @returns
 */
const SkillAssessmentBatchReport = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [batch, setBatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    laodBatch();
    loadData();
  }, [sessionStorage.getItem("batchId")]);

  const loadData = async () => {
    const batchId = sessionStorage.getItem("batchId");
    console.log(batchId);
    setLoading(true);
    await getBatchReport(batchId, "skill").then((response) => {
      setLoading(false);
      const assessment = response.data;
      console.log(assessment);
      const rowsData = assessment.map((assessment) => ({
        id: assessment.assessmentId,
        assessmentName: assessment.assessmentName,
        averageMarks: assessment.averageMarks,
      }));
      console.log(rowsData);
      setRows(rowsData);
      sessionStorage.setItem("assessmentId", assessment.assessmentId);
    });
  };

  const laodBatch = async () => {
    const batchId = sessionStorage.getItem("batchId");
    await findUsersByBatch(batchId).then((res) => {
      setBatch(res.data);
    });
  };

  const handleView = (id) => {
    const userbatchIds = sessionStorage.getItem("data");
    sessionStorage.setItem("assessmentId", id);
    const assessmentIds = sessionStorage.getItem("assessmentId");
    navigate(`/adminskillbatchwisereport`);
  };

  const columns = [
    {
      field: "assessmentName",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Assessment
        </Typography>
      ),
      flex: 1,
    },

    {
      field: "averageMarks",
      type: "number",
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Overall Average Score
        </Typography>
      ),
      flex: 1,
      renderCell: ({ row }) => {
        if (
          row.averageMarks >= 75 &&
          row.averageMarks <= 100 &&
          row.averageMarks > 0
        ) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}>
              <Box
                sx={{
                  width: "100px",
                  position: "relative",
                  alignItem: "center",
                }}>
                <LinearProgress
                  color="success"
                  sx={{
                    height: "25px",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "green",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={row.averageMarks}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}>
                  {row.averageMarks}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.averageMarks >= 45 && row.averageMarks < 75) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}>
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="warning"
                  sx={{
                    height: "25px",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "orange",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={row.averageMarks}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}>
                  {row.averageMarks}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.averageMarks >= 45 && row.averageMarks < 50) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}>
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="warning"
                  sx={{
                    height: "25px",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "yellow",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={rows.averageMarks}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}>
                  {rows.averageMarks}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.averageMarks >= 0 && row.averageMarks < 35) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}>
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="error"
                  sx={{
                    height: "25px",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "red",
                      opacity: 0.5,
                    },
                  }}
                  variant="determinate"
                  value={row.averageMarks}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}>
                  {row.averageMarks}%
                </Typography>
              </Box>
            </div>,
          ];
        }
      },
    },
    {
      field: "Action",
      filterable: false,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          View Users
        </Typography>
      ),
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltip title="View Users" arrow>
          <GridActionsCellItem
            icon={<PeopleAltIcon />}
            label="View Users"
            className="textPrimary"
            color="inherit"
            onClick={() => handleView(row.id)}
          />
        </Tooltip>
      ),
    },
  ];

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        field: "averageMarks",
        operator: ">",
        value: "10",
      },
    ],
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowX: "hidden",
        scrollbarWidth: "none",
      }}>
      <Button
        id="admin_module_batchreport-backbtn"
        variant="danger"
        endIcon={<ReplyIcon />}
        href="/cap/adminbatchreportview"
      >
        Back
      </Button>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowX: "hidden",
          scrollbarWidth: "none",
          paddingTop: "1%",
          minHeight: "150px",
          maxHeight: "150px",
        }}>
        <Card
          sx={{
            color: "white",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}>
                {batch.batchName}
              </Typography>
            }
          />
          <CardContent>
            <Typography
              variant="body1"
              sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <b>Batch Description: </b>
                <p>{batch.batchDescription}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <b>Present Count: </b>
                <p>{batch.presentCount}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <b>Batch Size: </b>
                <p>{batch.batchSize}</p>
              </div>
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Grid container spacing={2} style={{ flex: 1 }}>
        <Grid item xs={12} style={{ height: "auto" }}>
          <Paper
            elevation={3}
            style={{
              height: "auto",
              display: "flex",
              flexDirection: "column",
              marginLeft: "17px",
              marginRight: "17px",
              marginBottom: "30px",
            }}>
            <Box sx={{ height: "330px", minHeight: "auto", width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                scrollbarSize={0}
                paginationfilterModel={filterModel}
                onFilterModelChange={(newFilterModel) =>
                  setFilterModel(newFilterModel)
                }
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialState={{
                  ...rows.initialState,
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                sx={{
                  width: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
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
                }}
                slotProps={{
                  filterPanel: {
                    logicOperators: [GridLogicOperator.And],
                    columnsSort: "asc",
                    filterFormProps: {
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
                      "& .MuiDataGrid-filterForm": { p: 2 },
                      "& .MuiDataGrid-filterForm:nth-child(even)": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
                      },
                      "& .MuiDataGrid-filterFormLogicOperatorInput": { mr: 2 },
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
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default SkillAssessmentBatchReport;
