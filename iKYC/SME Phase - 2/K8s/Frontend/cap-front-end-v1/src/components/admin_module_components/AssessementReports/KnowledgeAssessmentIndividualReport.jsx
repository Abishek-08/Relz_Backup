import React, { useState, useEffect } from "react";
import {
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
  Card,
  CardHeader, 
  CardContent,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../../../styles/admin_module_styles/report.css";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import AdminNavbar from "../AdminNavbar";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReplyIcon from "@mui/icons-material/Reply";
import { ToastContainer, toast } from "react-toastify";
import loadingAnimation from '../../../assets/admin-module-assets/Loading.gif';
import { getUnMappedUserKnowledgeReportService } from "../../../services/admin_module_services/Report_Service";


const KnowledgeAssessmentIndividualReport = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [TotalScore, setTotalScore] = useState(0);
  const [dataloading, setDataLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const responseData = await getUnMappedUserKnowledgeReportService();
        console.log(responseData.data);

        if (Array.isArray(responseData.data)) {
          const scoreData = responseData.data;
          const tableData = scoreData.map((data) => ({
            id: data.scoreId,
            uid: data.user.userId,
            Name: data.user.userName,
            email: data.user.userEmail,
            Score: data.score,
            Result: data.status,
            ScheduledId: data.scheduleAssessment.schedulingId,
            assessmentName: data.scheduleAssessment.assessment.assessmentName,
            assessmentDate: data.scheduleAssessment.assessmentDate,
          }));
          console.log("Table Data:", tableData);
          setRows(tableData);
          let totalMark = 0;
          scoreData.forEach((data) => {
            totalMark = totalMark + data.score;
            setTotalScore(totalMark);
          });
        } else {
          console.error("Response data is not an array:", responseData.data);
        } setLoading(false);
      } catch (error) {
        toast.error("Response data is not an array:");
      }
      finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(TotalScore);

  const handleView = (uid, ScheduledId, Name, Score, Result) => {
    const id = uid;
    const data = { id, Name, ScheduledId, Score, Result };
    console.log(data);
    sessionStorage.setItem("data", JSON.stringify(data));
    navigate(`/adminlearningdetailedreport/`);
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

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
  const exportToExcel = () => {
    if (rows.length > 0) {
      const header = [
        "S.No",
        "User Name",
        "Email Id",
        "Total Score",
        "Result",
        "Assessment",
        "Assessment Date",
      ];
      const data = rows.map((row, index) => [
        index + 1,
        row.Name,
        row.email,
        row.score,
        row.Result,
        row.assessmentName,
        row.assessmentDate,
      ]);

      const ws = XLSX.utils.aoa_to_sheet([header, ...data], {
        header: {
          headerStyle: {
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
          },
        },
        cell: {
          all: {
            alignment: {
              horizontal: "justify",
              vertical: "center",
            },
          },
        },
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Detailed Report");
      XLSX.writeFile(wb, "Knowledge_User_Report.xlsx");
    } else {
      toast.error("No data available to download.");
    }
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      style={{
        backgroundColor: "#f2f3f5",
        minHeight: "100vh",
        flexDirection: "column"
      }}
    >
      <AdminNavbar />

      {dataloading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* <CircularProgress /> */}
          <img src={loadingAnimation}
            style={{ mixBlendMode: "multiply" }} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            paddingLeft: "3%",
            paddingRight: "3%",
            marginTop: "6%"

          }}
        >

          <Card
            sx={{
              color: "white",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "none"
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", }}
              >
                Individual User Knowledge Report
              </Typography>

              <Typography variant="body1" sx={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <b> Total Users Count: </b> {rows.length}
                </div>
                <div>
                  <b > Overall Average: </b>
                  {rows.length > 0
                    ? (TotalScore / rows.length).toFixed(2) + "%"
                    : "N/A"}
                </div>
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ p: 1, marginTop: "1%" }}>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Button
                onClick={exportToExcel}
                variant="contained"
                style={{}}
                endIcon={<CloudDownloadIcon />}
              >
                Download Results
              </Button>
            </div>

            <Box sx={{ minHeight: "400px", maxHeight: "400px", width: "100%", marginTop: "1%" }}>
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
          </Card>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default KnowledgeAssessmentIndividualReport;