import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilledOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AssessmentIcon from "@mui/icons-material/AssessmentOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import EditNoteIcon from "@mui/icons-material/EditNoteOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import TabIcon from "@mui/icons-material/TabOutlined";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import html2canvas from "html2canvas";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaDownload, FaUserShield } from "react-icons/fa";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { getAssessmentResult } from "../../../redux/actions/skill_assessment_actions/assessment_report_actions/AssessmentReportActions";
import { fetchProctorDetails } from "../../../services/learning_assessment_service/KnowledgeAssessmentDetailReportService";
import "../../../styles/skill_assessment_styles/assessment_report_styles/CodeTestReport.css";
import { TimeFormatter } from "../../../utils/skill_assessment_utils/assessment_view_utils/DateTimeConversion";
import OverallTestCaseReport from "./OverallTestCaseReport";
import UserCodeResponse from "./UserCodeResponse";

/**
 *@author Srinivasan.S 12113
 * @since 18-07-2023
 */

/**
 * @author Prem M
 * @since 10-09-2024
*/


//This is the theme function for this page
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(2, 2, 95)",
    },
    secondary: {
      main: "rgb(2, 2, 95)",
    },
    background: {
      default: "#ecf0f1",
    },
    text: {
      primary: "#2c3e50",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Arial', sans-serif",
    h4: {
      fontSize: 24,
      fontWeight: 600,
      marginBottom: "15px",
      color: "rgb(2, 2, 95)",
    },
    body1: {
      fontSize: 14,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 18px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8f9fa",
        },
      },
    },
  },
});

// This is a box to display user details and score card
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: "98%",
  display: "flex",
  flexDirection: "column",
}));

// This is a box to display the question and proctoring details
const QuestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "35vh",
  overflowY: "auto",
}));

//This is the function for download button
const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: 20,
  boxShadow: "0 3px 5px 2px rgba(44, 62, 80, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
  },
}));

// This is the function for table
const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  ...(isSelected && {
    backgroundColor: theme.palette.action.selected,
  }),
}));

function OverallScore({ result, data, user, assessments, schedule }) {
  const dispatch = useDispatch();
  const [genuine, setGenuine] = useState({}); // this usestate maintains the genuinity details
  const [proctor, setProctor] = useState(false); // this usestate maintains the proctor details
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0); // this usestate maintains the ondemand question navigation
  const [openModal, setOpenModal] = useState(false); //This modal is for download confirmation

  const userId = user.userId;
  const schedulingId = schedule.schedulingId;
  const percentage = data.totalScore;
  const warningCount = genuine.copyPaste + genuine.tabSwitch;
  const genuinityPercentage = genuine.genuinity;
  let pathColor;
  let testStatus;

  // this conditions is for display the color of the score progress bar based on the score and genuinity
  switch (true) {
    case percentage < 45:
      if (
        proctor === false &&
        genuinityPercentage < 99 &&
        genuinityPercentage >= 60
      ) {
        pathColor = "rgb(220, 123, 6)";
        testStatus = "Fail";
      } else if (proctor === false && genuinityPercentage < 60) {
        pathColor = "#cc001f";
        testStatus = "Fail";
      } else {
        pathColor = "#cc001f";
        testStatus = "Fail";
      }
      break;

    case percentage >= 45 && percentage < 60:
      if (
        proctor === false &&
        genuinityPercentage < 99 &&
        genuinityPercentage >= 60
      ) {
        pathColor = "rgb(220, 123, 6)";
        testStatus = "Pass";
      } else if (proctor === false && genuinityPercentage < 60) {
        pathColor = "#cc001f";
        testStatus = "Pass";
      } else {
        pathColor = "#009900";
        testStatus = "Pass";
      }
      break;
    case percentage >= 60 && percentage < 80:
      if (
        proctor === false &&
        genuinityPercentage < 99 &&
        genuinityPercentage >= 60
      ) {
        pathColor = "rgb(220, 123, 6)";
        testStatus = "Pass";
      } else if (proctor === false && genuinityPercentage < 60) {
        pathColor = "#cc001f";
        testStatus = "Pass";
      } else {
        pathColor = "#009900";
        testStatus = "Pass";
      }
      break;
    case percentage >= 80:
      if (
        proctor === false &&
        genuinityPercentage < 99 &&
        genuinityPercentage >= 60
      ) {
        pathColor = "rgb(220, 123, 6)";
        testStatus = "Pass";
      } else if (proctor === false && genuinityPercentage < 60) {
        pathColor = "#cc001f";
        testStatus = "Pass";
      } else {
        pathColor = "#009900";
        testStatus = "Pass";
      }
      break;

    default:
      pathColor = "#009900";
      testStatus = "Pass";
      break;
  }

  /**
   *this method is used to get the proctoring details.
   * It will display the details if proctor is enabled.
   * If proctor is not enabled for the assessment means, it will display "Proctoring not enabled"
   */

  // this useeffect is used for dispatch the assessment result in store
  useEffect(() => {
    if (result.length > 0) {
      dispatch(getAssessmentResult(result[0]));
    }
    const handleGenuinity = () => {
      fetchProctorDetails(schedulingId, userId)
        .then((response) => {
          setGenuine(response);
          setProctor(false);
        })
        .catch((error) => {
          setProctor(true);
          console.log("Error fetching genuinity score");
        });
    };
    handleGenuinity();
  }, [result, dispatch, schedulingId, userId]);

  // This const is used to display the responses belongs to the particular question clicked.
  const handleQuestionClick = (index) => {
    setSelectedQuestionIndex(index);
    dispatch(getAssessmentResult(result[index]));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // This function is for download the report as pdf. Here, I use html2pdf() for download the result in pdf format.
  const handleDownloadReport = async () => {
    handleCloseModal();

    const contentToPrint = document.createElement("div");
    contentToPrint.style.position = "absolute";
    contentToPrint.style.top = "-9999px";
    contentToPrint.style.left = "-9999px";
    contentToPrint.style.width = "1200px";
    contentToPrint.style.padding = "20px";
    contentToPrint.style.fontSize = "14px";
    contentToPrint.style.lineHeight = "1.5";
    contentToPrint.style.color = "#000";
    contentToPrint.style.backgroundColor = "#fff";

    // Adjust the circular progress bar size and center it
    const adjustedCircularProgressbar = `
      <div style="width: 170px; height: 170px; margin: 0 auto;">
        ${document.querySelector('.CircularProgressbar').outerHTML}
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <b>Total Score</b>
      </div>
    `;

    contentToPrint.innerHTML = `
      <div style="text-align:center; margin-bottom: 20px;">
        <h3 style="color: rgb(2, 2, 95);"><b>Skill Assessment Report</b></h3>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div id="code-user" style="flex: 1; margin-right: 25px;">
          ${document.getElementById("code-user")?.innerHTML || ""}
        </div>
        <div id="code-score" style="flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;margin-right:10%">
        ${adjustedCircularProgressbar}
        </div>
        <div id="code-genuinity" style="flex: 1;">
          ${document.getElementById("code-genuinity")?.innerHTML || ""}
        </div>
      </div>
      <div id="code-question" style="margin-top: 20px;">
        ${document.getElementById("code-question")?.innerHTML || ""}
      </div>
    `;

    document.body.appendChild(contentToPrint);

    const scale = 2;
    html2canvas(contentToPrint, { scale: scale })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${user.userName}_skillassessment_report.jpeg`;
        link.click();
        document.body.removeChild(contentToPrint);
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };


  //This const is for if proctor is not enabled for the assessment means, it will display "Proctoring not enabled:
  const ProctorErrorMessage = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#f0f8ff",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <FaUserShield
        style={{ fontSize: "48px", color: "#060270", marginBottom: "16px" }}
      />
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
        Proctoring not enabled
      </p>
    </div>
  );

  // This const used as a label and its details for use details
  const InfoRow = ({ icon, label, value, valueStyle = {} }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Avatar sx={{ bgcolor: "primary.light" }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ ...valueStyle }}>
          <b>{value}</b>
        </Typography>
      </Box>
    </Box>
  );

  // This const used as a label and its details for proctoring details
  const InfoRow1 = ({ icon, label, value, valueStyle = {} }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        paddingTop: "2px",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Avatar sx={{ bgcolor: "primary.light" }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ ...valueStyle }}>
          <b>{value}</b>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 1,
          bgcolor: "background.default",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <StyledPaper sx={{ height: "97%" }}>
              <Typography id="code-info" variant="h4">
                Assessment Info
              </Typography>
              <StyledButton
                id="code-download"
                fullWidth
                startIcon={<FaDownload />}
                sx={{ mb: 3 }}
                onClick={handleOpenModal}
              >
                Download Report
              </StyledButton>
              <Dialog
                style={{ borderRadius: "20px" }}
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Download Confirmation"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to download the report?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownloadReport}
                    color="primary"
                    autoFocus
                  >
                    Download
                  </Button>
                </DialogActions>
              </Dialog>
              <Box
                id="code-score"
                sx={{
                  position: "relative",
                  width: 120,
                  height: 150,
                  margin: "0 auto",
                  mb: 1,
                }}
              >
                <CircularProgressbar
                  value={data.totalScore}
                  text={`${data.totalScore}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: pathColor,
                    textColor: "#2c3e50",
                    trailColor: "rgb(189, 181, 181)",
                  })}
                />
                <Typography
                  variant="h6"
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                  }}
                >
                  Total Score
                </Typography>
              </Box>
              <Divider id="code-div" sx={{ my: 2 }} />
              <div id="code-user">
                <InfoRow
                  icon={<AccountCircleIcon />}
                  label="Name"
                  value={user.userName || "N/A"}
                />
                <InfoRow
                  icon={<EmailIcon />}
                  label="Email"
                  value={user.userEmail || "N/A"}
                />
                <InfoRow
                  icon={<AssessmentIcon />}
                  label="Assessment"
                  value={assessments.assessmentName || "N/A"}
                />
                <InfoRow
                  icon={<AccessTimeIcon />}
                  label="Starting"
                  value={TimeFormatter(parseInt(data.startTime)) || "N/A"}
                />
                <InfoRow
                  icon={<AccessTimeFilledIcon />}
                  label="Completed"
                  value={TimeFormatter(parseInt(data.completedTime)) || "N/A"}
                />
                <InfoRow
                  icon={<EditNoteIcon />}
                  label="Status"
                  value={testStatus || "N/A"}
                  valueStyle={{ color: pathColor, fontWeight: "bold" }}
                />
              </div>
            </StyledPaper>
          </Grid>

          <Grid
            item
            xs={12}
            md={9}
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Grid container spacing={2} sx={{ flex: 1 }} height={"30vh"}>
              <Grid item xs={12} md={7}>
                <QuestionPaper id="code-question">
                  <Typography variant="h4">Questions</Typography>
                  <Box
                    sx={{
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">S.No</TableCell>
                          <TableCell>Question Title</TableCell>
                          <TableCell align="center">
                            Answered Language
                          </TableCell>
                          <TableCell align="center">Category</TableCell>
                          <TableCell align="center">Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.map((item, index) => (
                          <StyledTableRow
                            key={index}
                            onClick={() => handleQuestionClick(index)}
                            isSelected={selectedQuestionIndex === index}
                          >
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell>
                              <Tooltip
                                title="Click for more details"
                                placement="top"
                              >
                                <Box
                                  sx={{
                                    cursor: "pointer",
                                    textDecoration:
                                      selectedQuestionIndex === index
                                        ? "underline"
                                        : "none",
                                    color:
                                      selectedQuestionIndex === index
                                        ? "primary.main"
                                        : "inherit",
                                    fontWeight:
                                      selectedQuestionIndex === index
                                        ? "bold"
                                        : "normal",

                                    overflowY: "auto",
                                    scrollbarWidth: "none",
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  }}
                                >
                                  {item.codingQuestion?.questionTitle || "N/A"}
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              {item.language.languageName}
                            </TableCell>
                            <TableCell align="center">
                              {item.codingQuestion.category.categoryName}
                            </TableCell>
                            <TableCell align="center">
                              <b>{item.score}</b>/100
                            </TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </QuestionPaper>
              </Grid>
              <Grid item xs={12} md={5} id="code-genuinity">
                <QuestionPaper
                  sx={{
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <Typography variant="h4">Proctoring Details</Typography>
                  {proctor ? (
                    <ProctorErrorMessage />
                  ) : (
                    <>
                      <InfoRow1
                        icon={<VerifiedIcon />}
                        label="Genuinity"
                        value={`${genuine.genuinity || "0"}%`}
                      />
                      <InfoRow1
                        icon={<WarningIcon />}
                        label="Total Warnings"
                        value={warningCount || "0"}
                      />
                      <InfoRow1
                        icon={<TabIcon />}
                        label="Tab Switch"
                        value={genuine.tabSwitch || "0"}
                      />
                      <InfoRow1
                        icon={<ContentCopyIcon />}
                        label="Copy Paste"
                        value={genuine.copyPaste || "0"}
                      />
                    </>
                  )}

                  {proctor === false && genuinityPercentage === 100 ? (
                    <>
                      <div id="code-suspious">
                        <FiUserCheck />
                      </div>
                      <div id="code-no-plagiariasm">
                        <b>No suspicious activity found</b>
                      </div>
                    </>
                  ) : proctor === false &&
                    genuinityPercentage < 99 &&
                    genuinityPercentage >= 60 ? (
                    <>
                      <div id="code-suspious">
                        <FiUserCheck />
                      </div>
                      <div id="code-some-plagiariasm">
                        <b>Suspicious activities found</b>
                      </div>
                    </>
                  ) : proctor === false && genuinityPercentage < 60 ? (
                    <>
                      <div id="code-suspious">
                        <FiUserX />
                      </div>
                      <div id="code-more-plagiariasm">
                        <b>Suspicious activities found</b>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </QuestionPaper>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: -0.5, flex: 1 }}>
              <Grid item xs={12} md={7}>
                <StyledPaper sx={{ height: "100%" }}>
                  <Typography variant="h4">Code Response</Typography>
                  <UserCodeResponse result={result} />
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={5}>
                <StyledPaper sx={{ height: "100%" }}>
                  <Typography variant="h4">Test Case output</Typography>
                  <OverallTestCaseReport />
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default OverallScore;
