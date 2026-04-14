import {
  AutoGraph as AutoGraphIcon,
  LibraryBooks as LibraryBooksIcon,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { fetchOverallscores } from "../../../services/user_module_service/ProfileService";
import {
  fetchLearningAssessments,
  fetchSkillAssessments,
} from "../../../services/user_module_service/ScheduleAssessmentsService";
import {
  getGenunityPerformance,
  getLearningScore,
  getSkillScore,
} from "../../../services/user_module_service/ScorecardService";
import AssessmentInfoComponent from "./AssessmentInfoComponent";
/**
 * @author kiruba
 * @since 12-06-2024
 * @version 1.0
 */
/**
 * @author sathiyan
 * @since 14-07-2024
 * @version 2.0
 */
/**
 * @author varshinee.manisekar
 * @since 26-07-2024
 * @version 3.0
 */
const UserDashboard = () => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const [completedSkillAssessment, setCompletedSkillAssessment] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [overallGenunity, setOverallGenunity] = useState(0);
  const [completedKnowledgeAssessment, setCompletedKnowledgeAssessment] =
    useState([]);
  const [knowledgeAssessmentsData, setKnowledgeAssessmentsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [skillAssessmentsData, setSkillAssessmentsData] = useState([]);
  const [profileData, setProfileData] = useState({
    userName: "",
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userMobile: "",
    userDOB: "",
    userGender: "",
  });
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };
  const [skillTab, setSkillTab] = useState("completed");
  const [learningTab, setLearningTab] = useState("completed");

  const [overallScoreData, setOverallScoreData] = useState({
    knowledge: 0,
    skills: 0,
  });

  const [barChartData, setBarChartData] = useState({
    months: [],
    skillData: [],
    learningData: [],
  });

  const emptyColor = "#e0e0e0";
  const skillColor = "#f50057";
  const knowledgeColor = "#3f51b5";

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const fetchOverallScore = (data) => {

    if (
      isNaN(data.knowledgeOverallAverage) ||
      isNaN(data.skillOverallAverage)
    ) {
      throw new Error("Invalid score data");
    }

    setOverallScoreData({
      knowledge: data.knowledgeOverallAverage,
      skills: data.skillOverallAverage,
    });
    const months = data.monthSkillAverage.map((item) => item.month);
    const skillData = data.monthSkillAverage.map((item) => item.average);
    const learningData = data.monthLearningAverage.map((item) => item.average);
    setBarChartData({
      months,
      skillData,
      learningData,
    });
    // Set the initial selected month to an empty string
    setSelectedMonth("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          genuinity,
          skillData,
          knowledgeData,
          responseLearning,
          responseSkill,
          overallScores,
        ] = await Promise.all([
          getGenunityPerformance(user.userId),
          getSkillScore(user.userId),
          getLearningScore(user.userId),
          fetchLearningAssessments(user.userEmail),
          fetchSkillAssessments(user.userEmail),
          fetchOverallscores(user.userId),
        ]);

        setOverallGenunity(genuinity.overallAverage || 0);
        setCompletedSkillAssessment(skillData);
        setCompletedKnowledgeAssessment(knowledgeData);
        setKnowledgeAssessmentsData(responseLearning.data);
        setSkillAssessmentsData(responseSkill.data);
        fetchOverallScore(overallScores.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user.userId && user.userEmail) {
      fetchData();
    }
  }, [user.userEmail, user.userId]);

  const handleSkillTabChange = (event, newValue) => {
    setSkillTab(newValue);
  };

  const handleLearningTabChange = (event, newValue) => {
    setLearningTab(newValue);
  };

  const getPieChartData = () => {
    const { knowledge, skills } = overallScoreData;

    if (
      knowledge === undefined ||
      skills === undefined ||
      (knowledge === 0 && skills === 0)
    ) {
      return [
        {
          id: 1,
          value: 1,
          label: "No Data",
          color: emptyColor,
        },
      ];
    }

    return [
      {
        id: 1,
        value: isNaN(knowledge) ? 0 : knowledge,
        label: "Knowledge",
        color: knowledgeColor,
      },
      {
        id: 2,
        value: isNaN(skills) ? 0 : skills,
        label: "Skills",
        color: skillColor,
      },
    ].filter((item) => item.value > 0);
  };
  const ChartComponent = ({ chartType }) => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart
            width={300}
            height={200}
            series={getBarChartSeries()}
            xAxis={[
              {
                data:
                  selectedMonth === ""
                    ? barChartData.months.slice(-3)
                    : [selectedMonth],
                scaleType: "band",
              },
            ]}
            sx={{
              ".MuiChartsAxis-tickLabel": { fontSize: "0.75rem" },
            }}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            legend={{ hidden: true }}
          />
        );
      case "line":
        return (
          <LineChart
            width={300}
            height={200}
            series={getBarChartSeries()}
            xAxis={[
              {
                data:
                  selectedMonth === ""
                    ? barChartData.months.slice(-3)
                    : [selectedMonth],
                scaleType: "point",
              },
            ]}
            sx={{
              ".MuiChartsAxis-tickLabel": { fontSize: "0.75rem" },
            }}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            legend={{ hidden: true }}
          />
        );

      case "horizontalLine":
        return (
          <BarChart
            width={300}
            height={200}
            series={getBarChartSeries().map((series) => ({
              ...series,
              stack: "total",
              layout: "horizontal", // Change 'orientation' to 'layout'
            }))}
            yAxis={[
              {
                data:
                  selectedMonth === ""
                    ? barChartData.months.slice(-3)
                    : [selectedMonth],
                scaleType: "band",
              },
            ]}
            xAxis={[{ scaleType: "linear" }]} // Add this line
            layout="horizontal"
            sx={{
              ".MuiChartsAxis-tickLabel": { fontSize: "0.75rem" },
            }}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            legend={{ hidden: true }}
          />
        );
      default:
        return null;
    }
  };

  const getBarChartSeries = () => {
    let monthIndices;
    if (selectedMonth === "") {
      // If no month is selected, use the last three months
      monthIndices = barChartData.months
        .slice(-3)
        .map((month) => barChartData.months.indexOf(month));
    } else {
      // If a month is selected, use only that month
      monthIndices = [barChartData.months.indexOf(selectedMonth)];
    }

    if (monthIndices.some((index) => index === -1)) {
      return [
        {
          data: [0],
          label: "Empty",
          color: emptyColor,
        },
      ];
    }

    const skillValues = monthIndices.map(
      (index) => barChartData.skillData[index] || 0
    );
    const learningValues = monthIndices.map(
      (index) => barChartData.learningData[index] || 0
    );

    if (
      skillValues.every((value) => value === 0) &&
      learningValues.every((value) => value === 0)
    ) {
      return [
        {
          data: [0],
          label: "Empty",
          color: emptyColor,
        },
      ];
    }

    return [
      {
        data: skillValues,
        label: "Skills",
        color: skillColor,
      },
      {
        data: learningValues,
        label: "Knowledge",
        color: knowledgeColor,
      },
    ].filter((series) => series.data.some((value) => value > 0));
  };
  const getCircularProgressColor = () => {
    if (overallGenunity < 50) return "#f44336";
    if (overallGenunity < 70) return "#ffeb3b";
    return "#4caf50";
  };

  return (
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: "#f5f5f5", py: 3 }}>
      <Grid container spacing={2} sx={{ px: 3 }}>
        <Grid item xs={12} mt={6.5}>
          <Paper
            elevation={3}
            sx={{
              bgcolor: "#fff",
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Alert
              severity="info"
              icon={false}
              sx={{
                bgcolor: "transparent",
                color: "text.primary",
                width: "100%",
              }}
            >
              <AlertTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Welcome, {profileData.userName}!
              </AlertTitle>
              Here's your dashboard overview.
            </Alert>
            {overallGenunity !== 0 && (
              <Tooltip
                title="Genuity"
                arrow
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <b>Genunity</b>
                <Box
                  sx={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px",
                  }}
                >
                  <CircularProgressbar
                    value={overallGenunity}
                    styles={{
                      path: {
                        stroke: getCircularProgressColor(),
                        strokeLinecap: "round",
                      },
                      trail: {
                        stroke: "#e0e0e0",
                      },
                      text: {
                        fill: "#333",
                        fontSize: "16px",
                      },
                    }}
                    size={80}
                    thickness={4}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      color: "text.primary",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {overallGenunity}%
                  </Box>
                </Box>
              </Tooltip>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <AssessmentInfoComponent
            title="Skill Assessment"
            icon={TerminalIcon}
            completedCount={completedSkillAssessment.length}
            scheduledCount={skillAssessmentsData.length}
            tabValue={skillTab}
            handleTabChange={handleSkillTabChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AssessmentInfoComponent
            title="Knowledge Assessment"
            icon={LibraryBooksIcon}
            completedCount={completedKnowledgeAssessment.length}
            scheduledCount={knowledgeAssessmentsData.length}
            tabValue={learningTab}
            handleTabChange={handleLearningTabChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "#f50057" }}>
                  <AutoGraphIcon />
                </Avatar>
              }
              title={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Monthly Performance</Typography>
                  {barChartData.skillData.length > 0 &&
                    barChartData.learningData.length > 0 && (
                      <Box display="flex" alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                          <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Select month" }}
                          >
                            <MenuItem value="">Last 3 Months</MenuItem>
                            {barChartData.months.map((month) => (
                              <MenuItem key={month} value={month}>
                                {month}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={selectedChartType}
                            onChange={handleChartTypeChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Select chart type" }}
                          >
                            <MenuItem value="bar">Bar Chart</MenuItem>
                            <MenuItem value="horizontalLine">
                              Horizontal Line Chart
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                </Box>
              }
            />

            <CardContent
              sx={{
                height: 250,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "75%", height: "100%", ml: 2 }}>
                <ChartComponent chartType={selectedChartType} />
              </Box>

              <Box
                sx={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Box width={16} height={16} bgcolor={skillColor} mr={1} />
                  <Typography variant="body2">Skills</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box width={16} height={16} bgcolor={knowledgeColor} mr={1} />
                  <Typography variant="body2">Knowledge</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box
                    width={16}
                    height={16}
                    bgcolor={emptyColor}
                    mr={1}
                    mt={1}
                  />
                  <Typography variant="body2" mt={1}>
                    No Data
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "#4caf50" }}>
                  <AutoGraphIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6">Overall Performance (Pie)</Typography>
              }
            />
            <CardContent
              sx={{
                height: 250,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "70%", height: "100%" }}>
                <PieChart
                  series={[
                    {
                      data: getPieChartData(),
                      innerRadius: 30,
                      outerRadius: 80,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      startAngle: -90,
                      endAngle: 270,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, outerRadius: 70, opacity: 0.5 },
                      highlighted: {
                        innerRadius: 30,
                        outerRadius: 90,
                        opacity: 1,
                      },
                    },
                  ]}
                  width={200}
                  height={200}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Tooltip
                    trigger="hover"
                    followCursor={true}
                    animation="fade"
                    sx={{
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        color: "black",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        padding: "10px",
                        borderRadius: "5px",
                      },
                    }}
                  >
                    {({ datum }) => (
                      <Typography>
                        {datum.label}: {datum.value}
                      </Typography>
                    )}
                  </Tooltip>
                </PieChart>
              </Box>
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Box width={16} height={16} bgcolor={skillColor} mr={1} />
                  <Typography variant="body2">Skills</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box width={16} height={16} bgcolor={knowledgeColor} mr={1} />
                  <Typography variant="body2">Knowledge</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box
                    width={16}
                    height={16}
                    bgcolor={emptyColor}
                    mr={1}
                    mt={1}
                  />
                  <Typography variant="body2" mt={1}>
                    No Data
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
