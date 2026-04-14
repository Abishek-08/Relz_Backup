import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { keyframes } from "@emotion/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MetricCard from "./MetricCard";
import {
  FaDownload,
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaCheckCircle,
  FaQuestionCircle,
  FaClipboardCheck,
  FaTimesCircle,
  FaUserCheck,
  FaUserShield,
  FaTrophy,
  FaShareAlt,
  FaRegStar,
  FaStarHalfAlt,
  FaStar,
} from "react-icons/fa";
import {
  fetchAssessmentReport,
  fetchProctorDetails,
  fetchScorecardDetails,
} from "../../../services/learning_assessment_service/KnowledgeAssessmentDetailReportService";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TopicIcon from "@mui/icons-material/Topic";
import ChartDataLabels from "chartjs-plugin-datalabels";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Divider,
} from "@mui/material";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
/**
 * @author karpagam.boothanathan
 * @since 27-07-2024
 * @version 5.0
 */

/**
 * @author karpagam.boothanathan
 * @since 05-08-2024
 * @version 6.0
 */

/**
 * @author karpagam.boothanathan
 * @since 12-08-2024
 * @version 7.0
 */

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const LearningAssessmentDetailedReport = ({ schedulingId, userId }) => {
  const [subtopicMarks, setSubtopicMarks] = useState({});
  const [notAttemptedQuestions, setNotAttemptedQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [genuinityPercentage, setGenuinityPercentage] = useState(0);
  const [tabSwitch, setTabSwitch] = useState(0);
  const [copypaste, setcopyPaste] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [proctorError, setProctorError] = useState(false);
  const [setShareSuccess] = useState("");

  const [setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [assessmentDetails, setAssessmentDetails] = useState({
    assessmentName: "",
    status: "",
    username: "",
    topicName: "",
    score: "",
  });

  const getBarColor = (value) => {
    if (value === 0) return "#E0E0E0";
    if (value >= 80) return "#4CAF50";
    if (value >= 50) return "#3F51B5";
    return "#FF5252";
  };

  // barchart representation
  const barChartOptions = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: { display: false },
        barPercentage: 0.5,
      },
      y: {
        grid: { display: false },
        categoryPercentage: 0.8,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
      datalabels: {
        display: true,
        color: "white",
        align: "right",
        anchor: "center",
        formatter: (value) => `${value}%`,
        font: {
          weight: "bold",
        },
      },
    },
    maintainAspectRatio: false,
  };

  //calculate mark based on subtopic
  const calculateMarksBySubtopic = (data) => {
    const subtopicMarks = {};

    data.forEach((item) => {
      const { subtopicName, evaluationMark, questionMark, selectedAnswers } =
        item;

      if (!subtopicMarks[subtopicName]) {
        subtopicMarks[subtopicName] = {
          totalMarks: 0,
          obtainedMarks: 0,
          questionsNotAttempted: 0,
        };
      }

      // Add the marks for this question to total marks for the subtopic
      subtopicMarks[subtopicName].totalMarks += questionMark;

      // Add the obtained marks for this question
      subtopicMarks[subtopicName].obtainedMarks += evaluationMark;

      // Count questions not attempted
      if (!selectedAnswers || selectedAnswers.trim() === "") {
        subtopicMarks[subtopicName].questionsNotAttempted += 1;
      }
    });

    // Calculate percentages
    Object.keys(subtopicMarks).forEach((key) => {
      subtopicMarks[key].percentage = (
        (subtopicMarks[key].obtainedMarks / subtopicMarks[key].totalMarks) *
        100
      ).toFixed(2);
    });

    return subtopicMarks;
  };

  //calculate not attempted questions
  const calculateNotAttemptedQuestions = (data) => {
    return data.filter(
      (item) => !item.selectedAnswers || item.selectedAnswers.trim() === ""
    ).length;
  };

  //bar chart data
  const barChartData = {
    labels: Object.keys(subtopicMarks),
    datasets: [
      {
        label: "Performance",
        data: Object.values(subtopicMarks).map((mark) => mark.percentage),
        backgroundColor: (context) => getBarColor(context.raw),
        borderRadius: 3,
        borderSkipped: false,
      },
    ],
  };
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  //api calling from service layer for fetch asessment report,proctor details and scorecard details
  useEffect(() => {
    // Fetch data and generate QR code URL
    fetchAssessmentReport(schedulingId, userId)
      .then((data) => {
        setTotalQuestions(data.length);
        const marksBySubtopic = calculateMarksBySubtopic(data);
        setSubtopicMarks(marksBySubtopic);

        const notAttempted = calculateNotAttemptedQuestions(data);
        setNotAttemptedQuestions(notAttempted);
      })
      .catch((e) => console.error(e));

    fetchScorecardDetails(schedulingId, userId)
      .then((data) => {
        const {
          scheduleAssessment: {
            assessment: { assessmentName },
          },
          status,
          score,
          user: { userName },
          topicId: { topicName },
        } = data;
        setAssessmentDetails({
          assessmentName,
          status,
          score,
          username: userName,
          topicName,
        });
      })
      .catch((error) => {
        console.error("Error fetching assessment details:", error);
      });

    fetchProctorDetails(schedulingId, userId)
      .then((data) => {
        const { genuinity, tabSwitch, copyPaste } = data;
        setGenuinityPercentage(genuinity);
        setWarningCount(tabSwitch + copyPaste);
        setcopyPaste(copyPaste);
        setTabSwitch(tabSwitch);
        setProctorError(false);
      })
      .catch((error) => {
        console.error("Error fetching proctor details:", error);
        setProctorError(true);
      });

    // Clean up on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [schedulingId, userId]);

  // Calculate values
  const scorePercentage = assessmentDetails.score;
  const questionsAttempted = totalQuestions - notAttemptedQuestions;

  //for proctor error message displaying
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
        No proctor enabled for this assessment
      </p>
    </div>
  );

  //to display the trophy icon
  const Trophy = ({ score }) => (
    <div
      style={{
        position: "absolute",
        top: "2%",
        left: "-20px",
        transform: "translateY(-50%)",
        backgroundColor: score >= 80 ? "#FFD700" : "#C0C0C0", // Gold for >=80, Silver for <80
        borderRadius: "50%",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50px",
        height: "50px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <FaTrophy style={{ fontSize: "24px", color: "#FFF" }} />
    </div>
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const toggleElementVisibility = (selectors, display) => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.style.display = display;
    });
  };

  //code to download the report as image by excluding some components
  const downloadReport = () => {
    handleCloseModal();

    // Define selectors and hide elements
    const selectorsToHide = [
      "#download-button",
      "#content-below",
      "#content-below1",
      "#content-below2",
      "#share-button",
      "#copy-button",
    ];
    toggleElementVisibility(selectorsToHide, "none");

    html2canvas(document.querySelector("#report-container"), {
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      width: document.querySelector("#report-container").scrollWidth,
      height: document.querySelector("#report-container").scrollHeight,
      scale: window.devicePixelRatio,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg"); // JPEG format
        link.download = `${assessmentDetails.username}_knowledge_assessment_report.jpeg`;
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing screenshot:", error);
      })
      .finally(() => {
        // Ensure elements are shown again
        toggleElementVisibility(selectorsToHide, "block");
      });
  };

  //color representation for graph
  const getLineColor = (value) => {
    if (value >= 80) return "#4CAF50";
    if (value >= 50) return "#3F51B5";
    return "#FF5252";
  };

  //to display the performance legend and graph
  const Legend = () => {
    const subtopicData = Object.entries(subtopicMarks)
      .map(([name, data], index) => ({
        name: name,
        score: parseFloat(data.percentage),
        index: index,
      }))
      .sort((a, b) => a.index - b.index); // Sort by original order

    const avgScore =
      subtopicData.reduce((sum, item) => sum + item.score, 0) /
      subtopicData.length;
    const lineColor = getLineColor(avgScore);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "16px",
          backgroundColor: "#EBEDEB",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "360px",
        }}
      >
        <h4
          style={{
            margin: "0 0 0px 0",
            fontSize: "16px",
            color: "#060270",
            fontWeight: "bold",
          }}
        >
          Performance Legend
        </h4>
        {[
          { color: "white", label: "Score  = 0%" },
          { color: "#FF5252", label: "Score <= 50%" },
          { color: "#3F51B5", label: "Score < 80 & > 50" },
          { color: "#4CAF50", label: "Score ≥ 80%" },
        ].map(({ color, label }, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                marginRight: "8px",
                borderRadius: "4px",
                backgroundColor: color,
              }}
            ></div>
            <span style={{ fontSize: "14px" }}>{label}</span>
          </div>
        ))}
        <Divider sx={{ my: 2 }} />
        <div style={{ width: "100%", height: "160px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={subtopicData}
              margin={{ top: 5, right: 0, left: -26, bottom: -5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <RechartsTooltip
                formatter={(value, name, props) => [
                  `${value.toFixed(1)}%`,
                  props.payload.name,
                ]}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 4, fill: lineColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  //to display the message in assessment details info based on the score
  const AnimatedMessage = ({ score }) => {
    const messageStyle = {
      position: "absolute",
      top: "-37px",
      left: "50%",
      width: "290px",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      borderRadius: "20px",
      fontWeight: "bold",
      animation: `${bounceAnimation} 2s infinite`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      textAlign: "center",
      zIndex: 10,
    };

    if (score >= 75 && genuinityPercentage >= 90) {
      return (
        <div
          style={{
            ...messageStyle,
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Keep Rocking Superstar 🌟
        </div>
      );
    } else if (score >= 50 && score < 75 && genuinityPercentage >= 90) {
      return (
        <div
          style={{
            ...messageStyle,
            backgroundColor: "#FFA500",
            color: "white",
          }}
        >
          There's room for improvement !<br />
        </div>
      );
    } else if (score < 50 && genuinityPercentage >= 90) {
      return (
        <div
          style={{
            ...messageStyle,
            backgroundColor: "#f65c3b",
            color: "white",
          }}
        >
          Every step forward is progress !<br />
        </div>
      );
    }
  };

  //link copy to clipboard
  const copyToClipboard = () => {
    const reportLink = `${window.location.origin}/knowledgeDetailReport/${schedulingId}/${userId}`;
    navigator.clipboard
      .writeText(reportLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Could not copy text.");
        console.error("Could not copy text:", err);
      });
  };

  //to share the report link
  const shareReport = () => {
    const reportLink = `${window.location.origin}/knowledgeDetailReport/${schedulingId}/${userId}`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Assessment Report",
          text: "Check out my assessment report!",
          url: reportLink,
        })
        .then(() => {
          setShareSuccess("Report shared!");
          setTimeout(() => setShareSuccess(""), 3000);
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      copyToClipboard();
      setShareSuccess("Link copied for sharing!");
      setTimeout(() => setShareSuccess(""), 3000);
    }
  };

  const StarRating = ({ score }) => {
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "120px" }}
      >
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            style={{ color: "#FABC3C", fontSize: "20px" }}
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt style={{ color: "#FABC3C", fontSize: "20px" }} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            style={{ color: "#FABC3C", fontSize: "20px" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        maxWidth: "1250px",
        margin: "0 auto",
        marginTop: "70px",
        position: "relative",
        marginRight: "14%",
      }}
      id="report-container"
    >
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "-16%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          id="download-button"
          onClick={handleOpenModal}
          style={{
            backgroundColor: "#060270",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "8px",
          }}
        >
          <FaDownload style={{ fontSize: "30px" }} />
        </button>
        <span
          id="content-below"
          style={{ fontSize: "12px", color: "#333", fontWeight: "bold" }}
        >
          Download Report
        </span>

        <button
          id="share-button"
          onClick={shareReport}
          style={{
            backgroundColor: "#060270",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "12px",
            cursor: "pointer",
            marginTop: "20px",

            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <FaShareAlt style={{ fontSize: "24px" }} />
        </button>
        <span
          id="content-below2"
          style={{ fontSize: "12px", color: "#333", fontWeight: "bold" }}
        >
          Share
        </span>
      </div>

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
          <Button onClick={downloadReport} color="primary" autoFocus>
            Download
          </Button>
        </DialogActions>
      </Dialog>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#060270",
          textAlign: "center",
          marginLeft: "20%",
        }}
      >
        Knowledge Assessment Report
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
          }}
        >
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              width: "130%",
              position: "relative",
            }}
          >
            <AnimatedMessage score={scorePercentage} />
            <Trophy score={scorePercentage} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "70px",
              }}
            >
              <div
                style={{
                  width: "130px",
                  height: "121px",
                  marginLeft: "5%",
                }}
              >
                <CircularProgressbar
                  value={scorePercentage}
                  text={`${scorePercentage}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: getBarColor(scorePercentage),
                    textColor: "#333",
                  })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "semibold",
                    marginBottom: "16px",
                  }}
                >
                  <b style={{ color: "#060270", marginRight: "-50%" }}>
                    Assessment Details
                  </b>
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaUser
                      style={{
                        marginRight: "8px",
                        color: "#333",
                        fontSize: "20px",
                      }}
                    />
                    <p style={{ margin: 0 }}>
                      <span style={{ fontWeight: "medium" }}>
                        <b> Username:</b>
                      </span>{" "}
                      {assessmentDetails.username}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaFileAlt
                      style={{
                        marginRight: "8px",
                        color: "#333",
                        fontSize: "20px",
                      }}
                    />
                    <p style={{ margin: 0 }}>
                      <span style={{ fontWeight: "medium" }}>
                        <b>Status: </b>
                      </span>{" "}
                      {assessmentDetails.status.includes("PASS") ? (
                        <span
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          {assessmentDetails.status}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          {assessmentDetails.status}
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaCheckCircle
                      style={{
                        marginRight: "8px",
                        color: "#333",
                        fontSize: "20px",
                      }}
                    />
                    <p style={{ margin: 0 }}>
                      <span style={{ fontWeight: "medium" }}>
                        <b>Score %: </b>
                      </span>{" "}
                      {assessmentDetails.score}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              width: "130%",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "semibold",
                marginBottom: "16px",
                color: "#060270",
              }}
            >
              <b>Additional Metrics</b>
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    marginBottom: "8px",
                    color: "#060270",
                    fontWeight: "bold",
                  }}
                >
                  Question Details
                </h4>
                <MetricCard
                  icon={FaQuestionCircle}
                  label="Total Questions"
                  value={totalQuestions}
                  color="#3F51B5"
                />
                <MetricCard
                  icon={FaClipboardCheck}
                  label="Questions Attempted"
                  value={questionsAttempted}
                  color="#4CAF50"
                />
                <MetricCard
                  icon={FaTimesCircle}
                  label=" Not Attempted"
                  value={notAttemptedQuestions}
                  color="#f50057"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    marginBottom: "8px",
                    color: "#060270",
                    fontWeight: "bold",
                  }}
                >
                  Proctoring Details
                </h4>
                {proctorError ? (
                  <ProctorErrorMessage />
                ) : (
                  <>
                    <MetricCard
                      icon={FaUserCheck}
                      label="Genuinity Percentage"
                      value={`${genuinityPercentage}%`}
                      color="#009688"
                    />
                    <MetricCard
                      icon={FaUserShield}
                      label="Proctoring Types & Warnings"
                      secondaryValue={`Total Warning Count: ${warningCount}`}
                      value={
                        <>
                          <li>Copy Paste - {copypaste}</li>
                          <li>Tab Switching - {tabSwitch}</li>
                        </>
                      }
                      color="#FF5722"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            gridColumn: "span 2",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            marginLeft: "15%",
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "semibold",
                marginBottom: "8px",
                marginLeft: "0.4%",
              }}
            >
              <b>
                <AssessmentIcon /> Assessment Name:
              </b>{" "}
              {assessmentDetails.assessmentName}
            </h2>

            <p style={{ color: "#060270" }}>
              <b>
                <TopicIcon /> Topic Name:
              </b>{" "}
              {assessmentDetails.topicName}
            </p>
          </div>
          <div
            style={{
              padding: "16px",
              height: "400px",
              display: "flex",
              gap: "24px",
            }}
          >
            <Legend />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <FaTachometerAlt
                  style={{
                    fontSize: "24px",
                    color: "#333",
                    marginRight: "8px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#060270",
                  }}
                >
                  Sub Topic Wise Performance
                </h3>
                <StarRating score={scorePercentage} />
              </div>
              <Bar
                data={barChartData}
                options={barChartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LearningAssessmentDetailedReport;
