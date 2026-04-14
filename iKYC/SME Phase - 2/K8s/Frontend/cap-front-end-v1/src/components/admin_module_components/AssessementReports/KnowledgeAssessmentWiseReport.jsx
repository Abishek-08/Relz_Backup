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
import { findUsersByBatch } from "../../../services/admin_module_services/BatchService";
import { getKnowledgeBatchAssessmentWiseUserReport } from "../../../services/admin_module_services/Report_Service";
const KnowledgeAssessmentWiseReport = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
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

  const convertTimeZone = (data) => {
    const tempTime = data;
    let Ctime = tempTime
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [Ctime];

    if (Ctime.length > 1) {
      // If time format correct
      Ctime = Ctime.slice(1); // Remove full string match value
      Ctime[5] = +Ctime[0] < 12 ? "AM" : "PM"; // Set AM/PM
      Ctime[0] = +Ctime[0] % 12 || 12; // Adjust hours
    }
    setStartTime(Ctime.join("")); // setPreviousTime(Ctime.join("")); // return adjusted time or original string
  };

  useEffect(() => {
    const fetchData = async () => {
      const assessmentId = sessionStorage.getItem("assessmentId");
      const batchId = sessionStorage.getItem("batchId");

      const batchUsers = await findUsersByBatch(batchId);
      console.log(batchUsers.data.user);
      const batchUsersOnly = batchUsers.data;
      const usersBatch = batchUsersOnly.user.map((user) => ({
        id: user.userId,
        Name: user.userName,
        Email: user.userEmail,
      }));
      console.log(batchUsersOnly);

      setLoading(true);

      const reportResponse = await getKnowledgeBatchAssessmentWiseUserReport(
        batchId,
        assessmentId
      );
      const report = reportResponse.data;

      const mergeData = usersBatch.map((user) => {
        const reports = report.find((item) => item.userId === user.id) || {};
        console.log(reports);
        return {
          id: user.id,
          ScheduledId: reports.schedulingId,
          Name: user.Name,
          Email: user.Email,
          Status: reports.status || "Not Started",
          Result: reports.result || "Not Attempt",
          Score: reports.score || 0,
        };
      });

      setRows(mergeData);
      setLoading(false);
      if (report.length > 0) {
        setAssessmentDetails({
          assessmentName: report[0].assessmentName,
          assessmentDate: report[0].assessmentDate,
          startTime: report[0].startTime,
          duration: report[0].duration,
        });
        convertTimeZone(report[0].startTime);
      }
    };

    fetchData();
  }, []);
  const handleView = (id, ScheduledId, Name, Score, Result) => {
    const data = { id, Name, ScheduledId, Score, Result };

    sessionStorage.setItem("data", JSON.stringify(data));

    // console.log(id);
    // console.log(ScheduledId);
    // sessionStorage.setItem("userId", id);
    // sessionStorage.setItem("scheduledId", ScheduledId);
    // sessionStorage.setItem("Name", Name);
    navigate(`/adminlearningdetailedreport`);
  };

  console.log(assessmentDetails);
  console.log(rows);
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
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Name
        </Typography>
      ),
      flex: 1,
    },
    {
      field: "Email",
      align: "center",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Email
        </Typography>
      ),

      flex: 2,
    },
    {
      field: "Status",
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
        if (row.Status === "completed") {
          color = "success";
        } else if (row.Status === "Not Started") {
          color = "warning";
        } else if (row.Status === "started") {
          color = "info";
        }

        return <Chip label={row.Status} color={color} />;
      },
    },

    {
      field: "Score",
      type: "number",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Score
        </Typography>
      ),
      flex: 1,
      align: "left",
    },
    {
      field: "Result",
      headerClassName: "super-app-theme--header",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Result
        </Typography>
      ),
      flex: 1,
      renderCell: ({ row }) => {
        if (row.Result === "PASS") {
          return [
            <div
              style={{
                display: "flex",

                marginTop: "12px",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "green" }}>
                {row.Result}
              </Typography>
            </div>,
          ];
        } else if (row.Result === "FAIL") {
          return [
            <div
              style={{
                display: "flex",

                marginTop: "12px",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "red" }}>
                {row.Result}
              </Typography>
            </div>,
          ];
        } else if (row.Result === "Not Attempt") {
          return [
            <div
              style={{
                display: "flex",

                marginTop: "12px",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "orange" }}>
                {row.Result}
              </Typography>
            </div>,
          ];
        }
      },
    },
    {
      field: "Action",
      align: "center",
      headerAlign: "center",
      filterable: false,
      flex: 1,
      headerClassName: "super-app-theme--header",
      headerName: (
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Actions
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Button
          //  endIcon={<AssessmentIcon />}
          size="small"
          variant="outlined"
          color="success"
          onClick={() =>
            handleView(row.id, row.ScheduledId, row.Name, row.Score, row.Result)
          }
          disabled={row.Status === "Not Started"}
        >
          Detail Report
        </Button>
      ),
      flex: 1,
    },
  ];
  const exportToExcel = () => {
    if (rows.length > 0) {
      const header = ["S.No", "User Name", "Email Id", "Total Score", "Status"];
      const data = rows.map((row, index) => [
        index + 1,
        row.Name,
        row.Email,
        row.Score,
        row.Status,
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
      XLSX.writeFile(wb, "Knowledge_Batch_Report.xlsx");
    } else {
      alert("No data available to download.");
    }
  };

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        field: "Score",
        operator: ">",
        value: "10",
      },
    ],
  });

  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="container-fluid d-flex m-0 p-0">
      <AdminNavbar />

      <div
        style={{
          height: "auto",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100%",
          minWidth:"100%",
          backgroundColor: "#f5f5ff",
        }}
      >
        <div
          style={{
            
            width: "auto",
            paddingTop: "6%",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}
        >
          <Card
            sx={{
              color: "white",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              width: "auto",
              // marginRight: "30px",
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "800", textAlign: "center" }}
                >
                  {assessmentDetails.assessmentName}
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body1">
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div>
                    <b>Assessment Date:</b> {assessmentDetails.assessmentDate}
                  </div>
                  <div>
                    <b>Start Time:</b> {startTime}
                  </div>
                  <div>
                    <b>Duration: </b>
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
          }}
        >
          <Button
            onClick={exportToExcel}
            variant="contained"
            style={{ padding: "10px" }}
            endIcon={<CloudDownloadIcon />}
          >
            Download Results
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: "10px", padding: "10px" }}
            endIcon={<ReplyIcon />}
            // href="/adminbatchreportview"
            onClick={goBack}
          >
            Back
          </Button>
        </div>
        <div
          style={{
            paddingRight: "20px",
            paddingLeft: "20px",
            backgroundColor: "none",
          }}
        >
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
        </div>
      </div>
    </div>
    // </div>
  );
};

export default KnowledgeAssessmentWiseReport;
