import React, { useState, useEffect } from "react";
import {
  Box,
  LinearProgress,
  Button,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../../../styles/admin_module_styles/report.css";
import { findUsersByBatch } from "../../../services/admin_module_services/BatchService";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Chip from "@mui/material/Chip";
import Adminnavbar from "../../../views/admin_module_views/Adminnavbar";
import * as XLSX from "xlsx";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReplyIcon from "@mui/icons-material/Reply";
import TreeViewStructure from "./TreeViewStructure";
import { getSkillBatchUserReport } from "../../../services/admin_module_services/Report_Service";

/**
 * @author ranjitha.rajaram
 * @version 5.0
 * @since 26/07/2024
 * @returns
 */
const SkillBatchwiseUserReport = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [assessmentDetails, setAssessmentDetails] = useState({
    assessmentName: "",
    assessmentDate: "",
    startTime: "",
    duration: "",
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const convertTimeZone = (data) => {
    const tempTime = data;
    let Ctime = tempTime
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [Ctime];

    if (Ctime.length > 1) {
      Ctime = Ctime.slice(1);
      Ctime[5] = +Ctime[0] < 12 ? "AM" : "PM";
      Ctime[0] = +Ctime[0] % 12 || 12;
    }
    setStartTime(Ctime.join(""));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userBatchIds = parseInt(sessionStorage.getItem("batchId"));
        const assessmentId = parseInt(sessionStorage.getItem("assessmentId"));

        const response = await findUsersByBatch(userBatchIds);
        const usersResponse = response.data;
        console.log("usersResponse:", usersResponse);
        const users = usersResponse.user.map((user) => ({
          id: user.userId,
          name: user.userName,
          userEmail: user.userEmail,
        }));
        console.log(users);
        const reportResponse = await getSkillBatchUserReport(
          userBatchIds,
          assessmentId
        );
        const report = reportResponse.data;

        const mergedData = users.map((user) => {
          const reportItem =
            report.find((item) => item.userId === user.id) || {};
          console.log(reportItem);
          return {
            id: user.id,
            name: user.name,
            userEmail: user.userEmail,
            assessmentName: reportItem.assessmentName || "",
            status: reportItem.status || "Not Attempt",
            totalScore: reportItem.totalScore || 0,
            attemptId: reportItem.attemptId || "",
          };
        });
        setRows(mergedData);
        if (report.length > 0) {
          setAssessmentDetails({
            assessmentName: report[0].assessmentName,
            assessmentDate: report[0].assessmentDate,
            startTime: report[0].startTime,
            duration: report[0].duration,
          });
          convertTimeZone(report[0].startTime);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetailReportClick = (attemptId) => {
    navigate(`/codereport/${attemptId}`);
  };

  const columns = [
    {
      field: "name",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      headerName: (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", textAlign: "center" }}>
          User Name
        </Typography>
      ),
      flex: 1,
    },
    {
      field: "userEmail",
      align: "center",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", textAlign: "center" }}>
          Email Id
        </Typography>
      ),
      flex: 1.5,
    },
    {
      field: "totalScore",
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      headerName: (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", textAlign: "center" }}>
          Total Score
        </Typography>
      ),
      flex: 1,
      type: "number",

      renderCell: ({ row }) => {
        if (
          row.totalScore >= 75 &&
          row.totalScore <= 100 &&
          row.totalScore > 0
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
                  value={row.totalScore}
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
                  {row.totalScore}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.totalScore >= 45 && row.totalScore < 75) {
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
                  value={row.totalScore}
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
                  {row.totalScore}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.totalScore >= 45 && row.totalScore < 50) {
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
                  value={rows.totalScore}
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
                  {rows.totalScore}%
                </Typography>
              </Box>
            </div>,
          ];
        } else if (row.totalScore >= 0 && row.totalScore < 35) {
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
                  value={row.totalScore}
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
                  {row.totalScore}%
                </Typography>
              </Box>
            </div>,
          ];
        }
      },
    },
    {
      field: "status",
      align: "center",
      headerClassName: "super-app-theme--header",
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
        } else if (row.status === "In Progress") {
          color = "warning";
        }

        return <Chip label={row.status} color={color} />;
      },
    },
    {
      field: "Action",
      filterable: false,
      align: "center",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Action
        </Typography>
      ),
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          endIcon={<AssessmentIcon />}
          size="small"
          variant="outlined"
          color="success"
          onClick={() => handleDetailReportClick(row.attemptId)}
          disabled={row.status === "Not Attempt"}>
          Detail Report
        </Button>
      ),
    },
  ];

  const exportToExcel = () => {
    const header = ["S.No", "User Name", "Email Id", "Total Score", "Status"];
    const data = rows.map((row, index) => [
      index + 1,
      row.name,
      row.userEmail,
      row.totalScore,
      row.status,
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
    XLSX.writeFile(wb, "Skill_Btach_Report.xlsx");
  };

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        field: "totalScore",
        operator: ">",
        value: "10",
      },
    ],
  });

  return (
    <div className="container-fluid d-flex m-0 p-0" id="admin_module_width">
      <Adminnavbar />

      <div id="admin_skil_batchwise_report">
        <div
          style={{
            width: "auto",            
            paddingTop: "6%",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}>
          <Card
            id="admin_skil_batchwise_report_01"
            sx={{
              color: "white",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              width: "auto",
              marginLeft: "3px",
            }}>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  id="admin_skil_batchwise_report_02"
                  sx={{ fontWeight: "800", textAlign: "center" }}>
                  {assessmentDetails.assessmentName}
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body1">
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <div>
                    <b>Assessment Date:</b> {assessmentDetails.assessmentDate}
                  </div>
                  <div>
                    <b id="card_header_skill_report">Start Time:</b> {startTime}
                  </div>
                  <div>
                    <b id="card_header_skill_report">Duration: </b>
                    {assessmentDetails.duration} Minutes
                  </div>
                </div>
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "10px",
            alignItems: "center",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}>
          <Button
            onClick={exportToExcel}
            variant="contained"
            style={{ padding: "10px" }}
            endIcon={<CloudDownloadIcon />}>
            Download Results
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: "10px", padding: "10px" }}
            endIcon={<ReplyIcon />}
            onClick={handleBack}>
            Back
          </Button>
        </div>
        <div
          style={{
            paddingRight: "20px",
            paddingLeft: "20px",
            backgroundColor: "none",            
          }}>
          <Box sx={{ height: "auto", width: "100%" }}>
            <DataGrid
              id="admin-module-knowlegde-assessment-report"
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
                height: "auto",
                backgroundColor:"white",
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
                    "& .MuiDataGrid-filterFormColumnInput": { mr: 2, width: 150 },
                    "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
                    "& .MuiDataGrid-filterFormValueInput": { width: 200 },
                  },
                },
              }}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SkillBatchwiseUserReport;
