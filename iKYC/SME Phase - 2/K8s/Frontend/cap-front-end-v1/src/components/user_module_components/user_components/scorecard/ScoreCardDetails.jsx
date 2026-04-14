import { ScoreRounded } from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import SearchIcon from "@mui/icons-material/Search";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getGenunityPerformance,
  getLearningScore,
  getSkillScore,
} from "../../../../services/user_module_service/ScorecardService";

/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  boxShadow: theme.shadows[4],
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  position: "relative",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

// const CategoryChip = styled(Chip)(({ theme }) => ({
//   marginBottom: theme.spacing(1),
//   backgroundColor: "transparent",
//   color: "#e00472",
//   border: `1px solid #25235c`,
// }));

const progressAnimation = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const ProgressBarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 20,
  backgroundColor: "#e0e0e0",
  borderRadius: 10,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "start",
  alignItems: "start",
}));

const ProgressBarFill = styled(Box)(({ theme, color, percentage }) => ({
  height: "100%",
  width: `${percentage}%`,
  backgroundColor: color,
  borderRadius: 10,
  transition: "width 1s ease-in-out",
  animation: `${progressAnimation} 1s ease-out`,
  paddingRight: theme.spacing(1),
}));

const ProgressText = styled(Typography)(({ theme, color }) => ({
  width: "100%",
  color: "black",
  fontWeight: "bold",
  fontSize: "0.875rem",
  textShadow: "1px 1px 2px white",
  textAlign: "center",
}));

const ProgressBar = ({ percentage }) => {
  let color;
  if (percentage < 50) {
    color = "#dc3545"; // Red color
  } else if (percentage >= 50 && percentage < 70) {
    color = "#ffc107"; // Yellow color
  } else {
    color = "#28a745"; // Green color
  }

  return (
    <Box>
      <ProgressBarContainer>
        <ProgressBarFill color={color} percentage={percentage}>
          <ProgressText>{percentage}%</ProgressText>
        </ProgressBarFill>
      </ProgressBarContainer>
    </Box>
  );
};

const ScoreCardDetails = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("skill");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillPercentage, setSkillPercentage] = useState(0);
  const [knowledgePercentage, setKnowledgePercentage] = useState(0);
  const user = useSelector((state) => state.profileDetails.profileDetails);

  const handleviewReport = (value) => {
    navigate(value);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const genuinity = await getGenunityPerformance(user.userId);
      let data;
      if (selectedTab === "skill") {
        data = await getSkillScore(user.userId);
        setSkillPercentage(genuinity.skill || 0);
      } else {
        data = await getLearningScore(user.userId);
        setKnowledgePercentage(genuinity.knowledge || 0);
      }
      // Sort the assessments by date in descending order
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.scheduleAssessment.assessmentDate);
        const dateB = new Date(b.scheduleAssessment.assessmentDate);
        return dateB - dateA;
      });
      setAssessments(sortedData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching assessments. Please try again later.");
      setLoading(false);
    }
  }, [user.userId, selectedTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };
  const groupAssessmentsByMonth = (assessments) => {
    const grouped = assessments.reduce((acc, assessment) => {
      const date = new Date(assessment.scheduleAssessment.assessmentDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(assessment);
      return acc;
    }, {});

    return Object.entries(grouped).sort((a, b) => {
      const [yearA, monthA] = a[0].split("-").map(Number);
      const [yearB, monthB] = b[0].split("-").map(Number);
      return yearB - yearA || monthB - monthA;
    });
  };

  const getMonthYearString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterAssessments = () => {
    let filtered = assessments;

    if (filterDate.trim() !== "") {
      const selectedDate = new Date(filterDate);
      filtered = filtered.filter((assessment) => {
        const assessmentDate = new Date(
          assessment.scheduleAssessment.assessmentDate
        );
        return selectedDate.toDateString() === assessmentDate.toDateString();
      });
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((assessment) =>
        assessment.scheduleAssessment.assessment.assessmentName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      );
    }

    return filtered;
  };

  const filteredAssessments = filterAssessments();
  const groupedAssessments = groupAssessmentsByMonth(filteredAssessments);

  return (
    <Container maxWidth="xl">
      <Box py={10}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          color="#25235c"
          fontSize={30}
          marginTop={1}
        >
          Assessment Scorecards
        </Typography>

        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={3} mb={1}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              className="custom-tabs"
            >
              <Tab
                label="Skill"
                value="skill"
                icon={<AssignmentIcon />}
                iconPosition="start"
                className="custom-tab custom-tab-label"
              />
              <Tab
                label="Knowledge"
                value="learning"
                icon={<EventIcon />}
                iconPosition="start"
                className="custom-tab custom-tab-label"
              />
            </Tabs>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="center" alignItems="center">
              {selectedTab === "skill" && skillPercentage !== 0 && (
                <Box flexGrow={1}>
                  <div className="d-flex column-gap-3">
                    <div
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "16px",
                        paddingLeft: "150px",
                      }}
                    >
                      GENUINITY
                    </div>
                    <div style={{ width: "100%" }}>
                      <ProgressBar percentage={skillPercentage} />
                    </div>
                  </div>
                </Box>
              )}
              {selectedTab === "learning" && knowledgePercentage !== 0 && (
                <Box>
                  <div className="d-flex column-gap-3">
                    <div
                      style={{
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontSize: "16px",
                        paddingLeft: "150px",
                      }}
                    >
                      GENUINITY
                    </div>
                    <div style={{ width: "130px" }}>
                      <ProgressBar percentage={knowledgePercentage} />
                    </div>
                  </div>
                </Box>
              )}
              <Box
                display="flex"
                justifyContent="end"
                alignItems="center"
                flexGrow={1}
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <TextField
                    type="date"
                    label="Filter by Date"
                    value={filterDate}
                    onChange={handleFilterDateChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: new Date().toISOString().split("T")[0] }}
                    className="user-module-learning-filter-by-day-input"
                    size="small"
                    sx={{ mr: 2 }}
                  />

                  <TextField
                    placeholder="Assessment Name"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />,
                    }}
                    sx={{ width: 200 }}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundImage:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#ffffff",
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                marginBottom={2}
              >
                Scorecard Details
              </Typography>
              <Typography variant="body1" paragraph marginBottom={0}>
                The scorecard displays your performance in completed
                assessments. It helps you track your progress and identify areas
                for improvement in both skill and knowledge assessments.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundImage:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#ffffff",
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                marginBottom={2}
              >
                Assessment Information
              </Typography>
              <Typography variant="body1" paragraph marginBottom={0}>
                This section provides detailed information about your completed
                assessments, including the assessment name, date, duration, and
                your performance. Use this information to track your progress
                and identify areas for improvement.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4}>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={200}
            >
              <div className="loader" />
            </Box>
          )}

          {error && (
            <Typography
              color="error"
              style={{
                padding: "20px",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </Typography>
          )}

          {!loading && !error && groupedAssessments.length > 0 ? (
            groupedAssessments.map(([monthYear, assessments], index) => (
              <React.Fragment key={monthYear}>
                {index > 0 && (
                  <Divider
                    sx={{
                      my: 4,
                      borderColor: "#25235c",
                      borderWidth: 2,
                      width: "100%",
                    }}
                  />
                )}

                <Box mb={4}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="#25235c"
                    fontWeight="bold"
                    mb={3}
                  >
                    {getMonthYearString(
                      assessments[0].scheduleAssessment.assessmentDate
                    )}
                  </Typography>
                  <Grid container spacing={3}>
                    {assessments.map((assessment, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard>
                          <StyledChip
                            label={
                              <span
                                className={
                                  assessment.totalScore < 50 ||
                                  assessment.status === "FAIL"
                                    ? "FAIL"
                                    : "PASS"
                                }
                              >
                                <strong>
                                  {assessment.totalScore < 50 ||
                                  assessment.status === "FAIL"
                                    ? "FAIL"
                                    : "PASS"}
                                </strong>
                              </span>
                            }
                            color={
                              assessment.totalScore < 50 ||
                              assessment.status === "FAIL"
                                ? "error"
                                : "success"
                            }
                            variant="outlined"
                          />
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {
                                assessment.scheduleAssessment.assessment
                                  .assessmentName
                              }
                            </Typography>
                            <Box display="flex" alignItems="center" mb={1}>
                              <EventIcon color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                <strong>Assessment Date:</strong>{" "}
                                {formatDate(
                                  assessment.scheduleAssessment.assessmentDate
                                )}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                              <TimerIcon color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                <strong>Duration:</strong>{" "}
                                {assessment.scheduleAssessment.duration} min
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                              <ScoreRounded color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                <strong>Performance:</strong>{" "}
                                {assessment.score || assessment.totalScore
                                  ? (
                                      ((assessment.score ||
                                        assessment.totalScore) /
                                        100) *
                                      100
                                    ).toFixed(2)
                                  : "0.00"}
                                %
                              </Typography>
                            </Box>
                          </CardContent>
                          <Box mt="auto" p={2}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() =>
                                handleviewReport(
                                  selectedTab === "skill"
                                    ? `/codereport/${assessment.attemptId}`
                                    : `/knowledgeDetailReport/${assessment.scheduleAssessment.schedulingId}/${user.userId}`
                                )
                              }
                              sx={{
                                backgroundColor: "#050c5e",
                                color: "#ffffff",
                                transition:
                                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                  backgroundColor: "#050c5e",
                                  color: "#ffffff",
                                },
                              }}
                            >
                              View Report
                            </Button>
                          </Box>
                        </StyledCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </React.Fragment>
            ))
          ) : (
            <Box display="flex" justifyContent="center" mt={5}>
              <Typography variant="h6">Need to take Assessment</Typography>
            </Box>
          )}
        </Box>

        <style>{`
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #25235c;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    </Container>
  );
};

export default ScoreCardDetails;
