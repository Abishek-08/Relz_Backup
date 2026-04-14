import React from 'react'
import {
  Card,
  Button,
  CardHeader, Typography, CardContent, Select, MenuItem, InputLabel, FormControl, Box, LinearProgress, Chip
} from '@mui/material';
import { DataGrid, GridLogicOperator, GridOverlay } from "@mui/x-data-grid";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from "../../../assets/admin-module-assets/Search2.gif"
import { getAllAssessments, getIndividualUsersReport } from '../../../services/admin_module_services/Report_Service';
const IndividualReports = () => {

  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [assessmentList, setAssessmentList] = useState([]);
  const [rows, setRows] = useState([]);
  const [skillRows, setSkillRows] = useState([]);
  const [TotalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadTable, setLoadTable] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const handleChange = (e) => {
    const type = e.target.value
    setType(type);
    if (type === "Skill") {
      getAllAssessments(type).then(
        (response) => {
          setAssessmentList(response.data)
          console.log(response.data)
        }
      )
    }
    else if (type === "Knowledge") {
      getAllAssessments(type).then(
        (response) => {
          setAssessmentList(response.data)
          console.log(response.data)
        }
      )
    }

  }

  const handleAssessmentNameSelect = (e) => {
    const assessmentId = e.target.value;
    console.log(assessmentId);
    if (type === "Skill") {
      setPageLoading(false);
      getIndividualUsersReport(assessmentId, "skill")
        .then((responseData) => {
          console.log(responseData.data)

          if (Array.isArray(responseData.data)) {
            // setIsEmpty(false)
            const scoreData = responseData.data;
            const tableData = scoreData.map((data) => ({
              id: data.attemptId,
              name: data.userName,
              email: data.userEmail,
              score: data.score,
              status: data.status || "Not Started",
              assessmentName: data.assessmentName,
              assessmentDate: data.assessmentDate,
            }));
            setSkillRows(tableData);
            let totalMark = 0;
            scoreData.map((data) => {
              totalMark = totalMark + data.totalScore;
              setTotalScore(totalMark);
            });
          }

        })
    }
    else if (type === "Knowledge") {
      setPageLoading(false);
      getIndividualUsersReport(assessmentId, "knowledge")
        .then((responseData) => {
          if (Array.isArray(responseData.data)) {
            const scoreData = responseData.data;
            const tableData = scoreData.map((data) => ({
              id: data.userId,
              uid: data.userId,
              Name: data.userName,
              email: data.userEmail,
              Score: data.score,
              Result: data.status,
              ScheduledId: data.schedulingId,
              assessmentName: data.assessmentName,
              assessmentDate: data.assessmentDate,
            }));

            setRows(tableData);
            let totalMark = 0;
            scoreData.forEach((data) => {
              totalMark = totalMark + data.score;
              setTotalScore(totalMark);
            });
          }
        }
        )
    }
  }

  const handleView = (uid, ScheduledId, Name, Score, Result) => {
    const id = uid;
    const data = { id, Name, ScheduledId, Score, Result };
    console.log(data);
    sessionStorage.setItem("data", JSON.stringify(data));
    navigate(`/adminlearningdetailedreport/`);
  };

  const handleSKillReportView = (attemptId) => {
    navigate(`/codereport/${attemptId}`);
  };

  const columns = [
    {
      field: "Name",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Name
        </Typography>
      ),
      flex: 1,
      headerClassName: "admin-unmappeduser-knowledge",
    },
    {
      field: "email",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Email
        </Typography>
      ),

      flex: 2,
      headerClassName: "admin-unmappeduser-knowledge",
    },
    {
      field: "assessmentName",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Assessment
        </Typography>
      ),

      flex: 1.5,
      headerClassName: "admin-unmappeduser-knowledge",
    },
    {
      field: "assessmentDate",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Date
        </Typography>
      ),

      flex: 1,
      headerClassName: "admin-unmappeduser-knowledge",
    },
    {
      field: "Result",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Result
        </Typography>
      ),

      flex: 1,
      renderCell: ({ row }) => {
        let color = "error";
        if (row.Result === "FAIL") {
          color = "error";
        } else if (row.Result === "PASS") {
          color = "success";
        }
        return (
          <Chip
            label={row.Result}
            color={color}
            style={{ marginBottom: "7px", height: "25px" }}
          />
        );
      },
      headerClassName: "admin-unmappeduser-knowledge",
    },

    {
      field: "Score",
      type: "number",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Score
        </Typography>
      ),
      flex: 1,
      renderCell: ({ row }) => {
        if (row.Score >= 75 && row.Score <= 100 && row.Score > 0) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <Box
                sx={{
                  width: "100px",
                  position: "relative",
                  alignItem: "center",
                }}
              >
                <LinearProgress
                  color="success"
                  sx={{
                    height: "25px",
                    "&.MuiLinearProgress-bar": {
                      backgroundColor: "green",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={row.Score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.Score}%
                </Typography>
              </Box>
            </div>
          );
        } else if (row.Score >= 45 && row.Score < 75) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="warning"
                  sx={{
                    height: "25px",
                    "&.MuiLinearProgress-bar": {
                      backgroundColor: "orange",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={row.Score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.Score}%
                </Typography>
              </Box>
            </div>
          );
        } else if (row.Score >= 45 && row.Score < 50) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="warning"
                  sx={{
                    height: "25px",
                    "&.MuiLinearProgress-bar": {
                      backgroundColor: "yellow",
                      opacity: 0.8,
                    },
                  }}
                  variant="determinate"
                  value={row.Score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.Score}%
                </Typography>
              </Box>
            </div>
          );
        } else if (row.Score >= 0 && row.Score < 45) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <Box sx={{ width: "100px", position: "relative" }}>
                <LinearProgress
                  color="error"
                  sx={{
                    height: "25px",
                    "&.MuiLinearProgress-bar": {
                      backgroundColor: "red",
                      opacity: 0.5,
                    },
                  }}
                  variant="determinate"
                  value={row.Score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.Score}%
                </Typography>
              </Box>
            </div>
          );
        }
      },
      headerClassName: "admin-unmappeduser-knowledge",
    },

    {
      field: "Action",
      flex: 1,
      resizable: false,
      align: "left",
      headerAlign: "center",
      filterable: false,
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Actions
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Button
          // endIcon={<AssessmentIcon />}
          // size="small"
          style={{
            size: "20px",
            width: "90px",
            height: "25px",
            marginLeft: "5px",
            marginBottom: "5px",
          }}
          variant="contained"
          color="success"
          onClick={() =>
            handleView(
              row.uid,
              row.ScheduledId,
              row.Name,
              row.Score,
              row.Result
            )
          }
        // disabled={row.Result === "Not Started"}
        >
          <p
            style={{
              width: "10px",
              marginRight: "30px",
              fontSize: "12px",
              marginTop: "14px",
            }}
          >
            View
          </p>
        </Button>
      ),
      flex: 1,
      headerClassName: "admin-unmappeduser-knowledge",
    },
  ];

  const skillColumns = [
    {
      field: "name",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Name
        </Typography>
      ),
      flex: 1,
      headerClassName: "admin-unmappeduser-skill",
    },
    {
      field: "email",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Email
        </Typography>
      ),

      flex: 2,
      headerClassName: "admin-unmappeduser-skill",
    },
    {
      field: "assessmentName",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Assessment
        </Typography>
      ),

      flex: 1.5,
      headerClassName: "admin-unmappeduser-skill",
    },
    {
      field: "assessmentDate",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Date
        </Typography>
      ),

      flex: 1,
      headerClassName: "admin-unmappeduser-skill",
    },
    {
      field: "status",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Status
        </Typography>
      ),

      flex: 1,

      renderCell: ({ row }) => {
        let color = "error";
        if (row.status === "completed") {
          color = "success";
        } else if (row.status === "Not Started") {
          color = "error";
        } else if (row.status === "started") {
          color = "info";
        }

        return <Chip label={row.status} color={color} />;
      },
      headerClassName: "admin-unmappeduser-skill",
    },

    {
      field: "score",
      type: "number",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Score
        </Typography>
      ),
      flex: 1,
      renderCell: ({ row }) => {
        if (row.score >= 75 && row.score <= 100 && row.score > 0) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <Box
                sx={{
                  width: "100px",
                  position: "relative",
                  alignItem: "center",
                }}
              >
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
                  value={row.score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.score}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.score >= 45 && row.score < 75) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
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
                  value={row.score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.score}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.score >= 45 && row.score < 50) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
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
                  value={rows.score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {rows.score}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.score >= 0 && row.score < 35) {
          return [
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
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
                  value={row.score}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "black",
                  }}
                >
                  {row.score}%
                </Typography>
              </Box>
            </div>,
          ];
        }
      },
      headerClassName: "admin-unmappeduser-skill",
    },
    {
      field: "Action",
      flex: 1,
      align: "left",
      headerAlign: "center",
      resizable: false,
      filterable: false,
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Actions
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Button
          // endIcon={<AssessmentIcon />}
          // size="small"
          style={{
            size: "20px",
            width: "90px",
            height: "25px",
            marginLeft: "5px",
            marginBottom: "5px",
          }}
          variant="contained"
          color="success"
          onClick={() => handleSKillReportView(row.id)}
          disabled={row.Status === "Not Started"}
        >
          <p
            style={{
              width: "10px",
              marginRight: "30px",
              fontSize: "12px",
              marginTop: "14px",
            }}
          >
            View
          </p>
        </Button>
      ),
      flex: 1,
      headerClassName: "admin-unmappeduser-skill",
    },
  ];

  return (
    <div>
      <div style={{ paddingRight: "3%", paddingLeft: "3%" }}>
        <Card
          sx={{
            color: "white",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            // height: "50px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
          <CardHeader title={
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              INDIVIDUAL REPORTS
            </Typography>
          } />
          <CardContent sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="demo-simple-select-label"
                sx={{
                  color: "white",
                  "&.Mui-focused": {
                    color: "white"
                  }
                }}
              >Assessment Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Assessment"
                onChange={(e) => handleChange(e)}
                sx={{
                  width: "220px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  },
                  "& .MuiSelect-select": {
                    color: "white"
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  },
                  "&:not(:focus) .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  },
                  "& .MuiMenuItem-root:hover": { // Add this rule
                    backgroundColor: "#6f63c4", // Light blue color
                    color: "#6f63c4" // Light blue color
                  }
                }}
              >
                <MenuItem value="Skill">Skill</MenuItem>
                <MenuItem value="Knowledge">Knowledge</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-label"
                sx={{
                  color: "white",
                  "&.Mui-focused": {
                    color: "white"
                  }
                }}>Assessment Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Assessment"
                onChange={(e) => handleAssessmentNameSelect(e)}
                sx={{
                  width: "220px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  },
                  "& .MuiSelect-select": {
                    color: "white"
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  },
                  "&:not(:focus) .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white"
                  }
                }}
              >
                {assessmentList.map((assessment) =>
                (
                  <MenuItem value={assessment.schedulingId}>{assessment.assessmentName}</MenuItem>
                ))
                }
              </Select>
            </FormControl>

          </CardContent>
        </Card>

        {pageLoading ?
          (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "1%" }}>
              <img src={Search} alt="Loading" style={{ width: "400px", height: "300px" }} />
              <p style={{ fontWeight: "700", color: "#6f63c4" }}>Select Assessment Type and Assessment </p>
            </div>
          )
          : (
            <div style={{ marginTop: "1%" }}>
              <Card sx={{ padding: "1%" }}>
                {type === "Skill" && (
                  <Box sx={{
                    minHeight: "400px", maxHeight: "400px", width: "100%", marginTop: "1%", animation: 'fadeIn 0.5s ease-in-out' // Add animation
                  }}>

                    <DataGrid
                      id="admin-module-knowlegde-assessment-report"
                      scrollbarSize={0}
                      rows={skillRows}
                      columns={skillColumns}
                      pagination
                      loading={loading}
                      pageSizeOptions={rows.length > 5 && [5, 10, 25, 50, 100]}
                      initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      sx={{
                        width: "auto",
                        maxHeight: '400px',
                        minHeight: "400px",
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
                                theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
                            },
                            "& .MuiDataGrid-filterFormLogicOperatorInput": { mr: 2 },
                            "& .MuiDataGrid-filterFormColumnInput": { mr: 2, width: 150 },
                            "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                            "& .MuiDataGrid-filterFormValueInput": { width: 200 },
                          },
                        },
                      }}
                      noRowsOverlay={
                        rows.length === 0 ? (
                          <GridOverlay>
                            <Typography variant="h5" align="center">
                              No Data To Display
                            </Typography>
                          </GridOverlay>
                        ) : null
                      }
                    />
                  </Box>
                )}
                {type === "Knowledge" && (
                  <Box sx={{
                    minHeight: "400px", maxHeight: "400px", width: "100%", marginTop: "1%", animation: 'fadeIn 0.5s ease-in-out' // Add animation
                  }}>
                    <DataGrid
                      id="admin-module-knowledge-assessment-report"
                      scrollbarSize={0}
                      rows={rows}
                      columns={columns}
                      loading={loading} // This prop will show the loading overlay
                      pageSizeOptions={rows.length > 5 && [5, 10, 25, 50, 100]}
                      initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      sx={{
                        width: "auto",
                        maxHeight: '400px',
                        minHeight: "400px",
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
                        border: "none",
                        "& .MuiDataGrid-main": {
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "none",
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
                )
                }
              </Card>
            </div>
          )}
      </div>

    </div>
  )
}

export default IndividualReports
