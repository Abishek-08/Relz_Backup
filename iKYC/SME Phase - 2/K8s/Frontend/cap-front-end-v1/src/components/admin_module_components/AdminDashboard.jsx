import {
  AutoGraph as AutoGraphIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { getAllBatch } from "../../services/admin_module_services/BatchService";
import { getLeaderboardDetails } from "../../services/admin_module_services/BatchReportService";
import AdminNavbar from "./AdminNavbar";
import {
  getBatchReport,
  getKnowledgeAssessmentReportGraphData,
  getKnowledgeAssessmentScheduledCount,
  getKnowledgeBatchReport,
  getOverAllBatchReport,
  getSkillAssessmentReportGraphData,
  getSkillAssessmentScheduledCount,
  getSkillBatchReport,
} from "../../services/admin_module_services/Report_Service";
const AdminDashboard = () => {
  const [, setBatchData] = useState([]);
  const [, setChartData] = useState([]);
  const [, setSkillAssessmentReportData] = useState([]);
  const [, setKnowledgeAssessmentReportData] = useState([]);
  const [skillCount, setSkillCount] = useState(0);
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [knowledgeLevelZeroCount, setKnowledgeLevelZeroCount] = useState(0);
  const [knowledgeQuickCount, setKnowledgeQuickCount] = useState(0);
  const [knowledgeModerateCount, setKnowledgeModerateCount] = useState(0);
  const [knowledgeLevelThreeCount, setKnowledgeLevelThreeCount] = useState(0);
  const [skillTab, setSkillTab] = useState("scheduled");
  const [learningTab, setLearningTab] = useState("scheduled");
  const [openModal, setOpenModal] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedAssessmentType, setSelectedAssessmentType] = useState("skill");

  const [, setSelectedAssessmentId] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [assessments, setAssessments] = useState({
    skill: [],
    knowledge: [],
  });
  const [, setBatchName] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getAllBatch();
        setBatches(response.data || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (selectedBatchId) {
        try {
          const skillPromise = getBatchReport(selectedBatchId, "skill");
          const knowledgePromise = getBatchReport(selectedBatchId, "knowledge");

          const [skillData, knowledgeData] = await Promise.all([
            skillPromise,
            knowledgePromise,
          ]);

          setAssessments({
            skill: skillData.data || [],
            knowledge: knowledgeData.data || [],
          });

          const selectedBatch = batches.find(
            (batch) => batch.batchId === selectedBatchId
          );
          if (selectedBatch) {
            setBatchName(selectedBatch.batchName);
          }
        } catch (error) {
          console.error("Error fetching assessments:", error);
        }
      }
    };
    fetchAssessments();
  }, [selectedBatchId, batches]);

  useEffect(() => {
    if (selectedAssessmentType) {
      const data =
        (selectedAssessmentType === "skill"
          ? assessments.skill
          : assessments.knowledge) || [];
      const xAxisData = data.map((assessment) => assessment.assessmentName);
      const seriesData = [
        {
          data: data.map((assessment) => ({
            x: assessment.assessmentName,
            y: assessment.averageMarks,
          })),
          label: selectedAssessmentType,
          color: selectedAssessmentType === "skill" ? "#3f51b5" : "#f50057",
        },
      ];

      setCurrentData({
        xAxis: [{ data: xAxisData, scaleType: "band" }],
        series: seriesData,
      });
    }
  }, [selectedAssessmentType, assessments]);

  // Helper function to safely access array properties
  // const safeMap = (data, fn) => (Array.isArray(data) ? data.map(fn) : []);
  // console.log("Selected assessment ID:", selectedAssessmentId);
  // console.log("Assessments:", assessments);
  // console.log("Current data:", currentData);

  const handleBatchChange = (event) => {
    setSelectedBatchId(event.target.value);
    setSelectedAssessmentId(""); // Reset selected assessment when batch changes
  };

  const handleAssessmentTypeChange = (event) => {
    setSelectedAssessmentType(event.target.value);
    setSelectedAssessmentId(""); // Reset selected assessment when assessment type changes
  };

  const handleSkillTabChange = (event, newValue) => {
    setSkillTab(newValue);
  };

  const handleLearningTabChange = (event, newValue) => {
    setLearningTab(newValue);
  };

  const handleOpenModal = () => {
    setPieChartData([
      { label: "Level 0", value: knowledgeLevelZeroCount },
      { label: "Level 1", value: knowledgeQuickCount },
      { label: "Level 2", value: knowledgeModerateCount },
      { label: "Level 3", value: knowledgeLevelThreeCount },
    ]);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    fetchData();
    getSkillAssessmentReportData();
    getKnowledgeAssessmentReportData();
    fetchScheduledCounts();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllBatch();
      const batches = response.data;
      const batchIds = new Set(batches.map((batch) => batch.batchId));
      const chartData = Array.from(batchIds).map((batchId) => {
        const batch = batches.find((b) => b.batchId === batchId);
        return {
          id: batch.batchId,
          value: batch.presentCount,
          label: batch.batchName,
        };
      });
      setBatchData(batches);
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const getSkillAssessmentReportData = async () => {
    const response = await getOverAllBatchReport("skill");
    setSkillAssessmentReportData(response.data);
  };

  const getKnowledgeAssessmentReportData = async () => {
    const response = await getOverAllBatchReport("knowledge");
    setKnowledgeAssessmentReportData(response.data);
  };

  const fetchScheduledCounts = async () => {
    try {
      const [skillResponse, knowledgeResponse] = await Promise.all([
        getSkillAssessmentScheduledCount(),
        getKnowledgeAssessmentScheduledCount(),
      ]);
      const skillCounts = skillResponse.data || 0;
      const knowledgeCounts = knowledgeResponse.data || {
        learningAssessmentCount: 0,
        levelZeroCount: 0,
        quickCount: 0,
        moderateCount: 0,
        levelThreeCount: 0,
      };
      setSkillCount(skillCounts);
      setKnowledgeCount(knowledgeCounts.learningAssessmentCount);
      setKnowledgeLevelZeroCount(knowledgeCounts.levelZeroCount);
      setKnowledgeQuickCount(knowledgeCounts.quickCount);
      setKnowledgeModerateCount(knowledgeCounts.moderateCount);
      setKnowledgeLevelThreeCount(knowledgeCounts.levelThreeCount);
    } catch (error) {
      setSkillCount(0);
      setKnowledgeCount(0);
      setKnowledgeLevelZeroCount(0);
      setKnowledgeQuickCount(0);
      setKnowledgeModerateCount(0);
      setKnowledgeLevelThreeCount(0);
    }
  };

  const AssessmentCard = ({
    title,
    icon: Icon,
    count,
    scheduledCount,
    onScheduledClick,
    onMoreClick,
    tabValue,
    handleTabChange,
  }) => (
    <Card
      elevation={1}
      sx={{
        height: "100%", // Changed from 80% to 100%
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
      }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
            <Icon />
          </Avatar>
        }
        title={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}>
              {title}
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                minHeight: "unset",
                ".MuiTabs-indicator": {
                  backgroundColor: "white",
                  height: 3,
                },
                ".MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-selected": {
                    color: "white",
                  },
                  minHeight: "unset",
                  padding: "6px 12px",
                },
                ".MuiTab-root:not(.Mui-selected)": {
                  opacity: 0.7,
                },
              }}>
              <Tab
                label="Scheduled"
                value="scheduled"
                onClick={onScheduledClick}
              />
              {title === "Knowledge Assessment" && (
                <Tab label="More" value="more" onClick={onMoreClick} />
              )}
            </Tabs>
          </Box>
        }
        sx={{ pb: 0 }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            {tabValue === "scheduled" ? scheduledCount : count}
          </Typography>
          <ScheduleIcon sx={{ color: "#2196f3", fontSize: 30, ml: 2 }} />
        </Box>
      </CardContent>
    </Card>
  );

  //leaderboard
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentWeekLeaderboard, setCurrentWeekLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await getLeaderboardDetails();
        const data = response.data;
        const formattedData = data.map((item) => ({
          username: item.user.userName,
          assessmentName: item.scheduleAssessment.assessment.assessmentName,
          assessmentDate: item.scheduleAssessment.assessmentDate,
          score: item.totalScore,
        }));
        setLeaderboardData(formattedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    const currentWeekData = getCurrentWeekLeaderboard(leaderboardData);
    setCurrentWeekLeaderboard(currentWeekData);
  }, [leaderboardData]);

  const getCurrentWeekLeaderboard = (data, assessmentType) => {
    return data
      .filter((item) => item.assessmentType === assessmentType)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const calculateChartWidth = (dataLength) => {
    const minWidth = 300; // Minimum width
    const barWidth = 30; // Width per bar
    const calculatedWidth = dataLength * barWidth;
    return Math.max(minWidth, calculatedWidth);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
      <AdminNavbar />
      {/* <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 1,
          mt: 4, // Adjust this value based on your navbar height
        }}> */}
      <Grid item xs={12} md={12} style={{ marginTop: "80px" }}>
        <Paper
          elevation={2}
          sx={{
            p: 0,
            bgcolor: "#fff",
            height: "100%",
            marginLeft: "3.5%",
            marginRight: "3.5%",
          }}>
          <Alert
            severity="info"
            icon={false}
            sx={{ bgcolor: "transparent", color: "text.primary" }}>
            <AlertTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Welcome to CAP Admin Dashboard
            </AlertTitle>
            <Typography>
              This dashboard provides an overview of the most important events
              inside the team.
            </Typography>
          </Alert>
        </Paper>
      </Grid>
      <Container maxWidth="xl">
        <Container maxWidth="xl" sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AssessmentCard
                title="Skill Assessment"
                icon={AutoGraphIcon}
                scheduledCount={skillCount}
                onScheduledClick={() => { }}
                tabValue={skillTab}
                handleTabChange={handleSkillTabChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AssessmentCard
                title="Knowledge Assessment"
                icon={AutoGraphIcon}
                count={knowledgeCount}
                scheduledCount={knowledgeCount}
                onScheduledClick={() => { }}
                onMoreClick={handleOpenModal}
                tabValue={learningTab}
                handleTabChange={handleLearningTabChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: "85%", bgcolor: "#ffff" }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#2196f3" }}>
                      <AutoGraphIcon sx={{ color: "#ffffff" }} />
                    </Avatar>
                  }
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "18px",
                          color: "#0d47a1",
                          fontWeight: "bold",
                        }}>
                        Assessment Analysis
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2, // Space between the form controls
                        }}>
                        <FormControl sx={{ width: "150px" }}>
                          <InputLabel id="batch-select-label">
                            Select Batch
                          </InputLabel>
                          <Select
                            labelId="batch-select-label"
                            size="small"
                            value={selectedBatchId}
                            onChange={handleBatchChange}
                            displayEmpty>
                            {batches.map((batch) => (
                              <MenuItem
                                key={batch.batchId}
                                value={batch.batchId}>
                                {batch.batchName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ width: "150px" }}>
                          <InputLabel id="assessment-type-select-label">
                            Assessment Type
                          </InputLabel>
                          <Select
                            labelId="assessment-type-select-label"
                            value={selectedAssessmentType}
                            size="small"
                            onChange={handleAssessmentTypeChange}>
                            <MenuItem value="skill">Skill</MenuItem>
                            <MenuItem value="knowledge">Knowledge</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  }
                />

                <CardContent
                  sx={{
                    height: "calc(100% - 76px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: 2,
                  }}>
                  <Box
                    sx={{
                      width: "100%",
                      overflowX: "auto",
                      marginBottom: 2,
                    }}>
                    {selectedAssessmentType &&
                      Array.isArray(currentData.series) &&
                      currentData.series.length > 0 ? (
                      <BarChart
                        height={200}
                        width={calculateChartWidth(
                          currentData.series[0].data.length
                        )}
                        series={currentData.series.map((serie) => ({
                          data: serie.data.map((data) => data.y),
                          label: serie.label,
                          color: serie.color || "#4caf50",
                        }))}
                        xAxis={[
                          {
                            data: currentData.xAxis[0].data,
                            scaleType: "band",
                            tickLabelStyle: {
                              angle: 45,
                              textAnchor: "start",
                              fontSize: 8,
                            },
                          },
                        ]}
                        yAxis={[{ label: "Score" }]}
                        margin={{ bottom: 50, left: 40, right: 10, top: 10 }}
                        tooltip={({ value }) => `${value.x}: ${value.y}`}
                      />
                    ) : (
                      <Typography>No data available</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                elevation={3}
                sx={{
                  height: "85%",
                  bgcolor: "#ffff",
                  display: "flex",
                  flexDirection: "column",
                }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#2e8b57" }}>
                      <AutoGraphIcon sx={{ color: "#ffffff" }} />
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "18px",
                        color: "#2e8b57",
                        fontWeight: "bold",
                      }}>
                      Current Week Leaderboard (Top 5)
                    </Typography>
                  }
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    overflow: "hidden", // Prevent overflow within the content area
                    // padding: 2,
                  }}>
                  <Box
                    sx={{
                      width: calculateChartWidth(
                        getCurrentWeekLeaderboard(leaderboardData).length
                      ),
                      // marginRight: "240px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "flex-start",
                      overflowX: "auto",
                    }}>
                    <BarChart
                      height={200}
                      width={calculateChartWidth(currentWeekLeaderboard.length)}
                      series={[
                        {
                          name: "Score",
                          data: currentWeekLeaderboard.map(
                            (item) => item.score
                          ),
                          color: "#2e8b57",
                        },
                      ]}
                      xAxis={[
                        {
                          data: currentWeekLeaderboard.map(
                            (item) =>
                              `${item.username}\n${new Date(item.assessmentDate).toLocaleDateString()}`
                          ),
                          scaleType: "band",
                          tickLabelStyle: {
                            angle: 45, // Adjust the angle if needed
                            textAnchor: "start",
                            fontSize: 10,
                          },
                        },
                      ]}
                      yAxis={[{ label: "Score" }]}
                      margin={{ bottom: 80, left: 40, right: 10, top: 5 }} // Increased bottom margin for better label visibility
                      tooltip={({ datum }) => {
                        const item = currentWeekLeaderboard.find(
                          (item) => item.score === datum.value
                        );
                        return (
                          <div>
                            <strong>{item.username}</strong>
                            <br />
                            Assessment: {item.assessmentName}
                            <br />
                            Score: {item.score}
                          </div>
                        );
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400, md: 500 },
              maxWidth: 600,
              bgcolor: "background.paper",
              border: "2px solid #fff",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              mb={2}>
              <Typography id="modal-title" variant="h6">
                Knowledge Assessment Breakdown
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                sx={{ color: "text.primary" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={250}
                width={350}
              />
            </Box>
          </Box>
        </Modal>
      </Container>
      {/* </Box> */}
    </Box>
  );
};

export default AdminDashboard;
