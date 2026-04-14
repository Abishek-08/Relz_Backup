import React, { useEffect, useState } from 'react';
import {
  AccessTime,
  ArrowForward,
  Assignment,
  CalendarToday,
  DescriptionSharp,
  Info,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useFullScreen from "../Proctoring/useFullScreen";
import SkillAssessmentNavbar from "../../skill_assessment_components/assessment_view_components/SkillAssessmentNavbar";
/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#25235c',
    },
    secondary: {
      main: '#e65100',
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

const SkillAssessmentInstruction = () => {
 

  const navigate = useNavigate();
  const [assessments, setAssessments] = useState({});
  const [loading, setLoading] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState(0); 
  //Proctoring
  const { isFullscreen, enterFullscreen } = useFullScreen();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await JSON.parse(localStorage.getItem("assessmentData"));
        setAssessments(data);
        setLoading(false);

        const assessmentStartTime = new Date(
          `${data.assessmentDate} ${data.startTime}`
        );
        const currentTime = new Date();
        const timeUntilStart = assessmentStartTime - currentTime;

        setTimeUntilStart(timeUntilStart);

        setTimeout(() => setIsButtonEnabled(true), timeUntilStart);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilStart((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartAssessment = () => {
    if (!isFullscreen || isFullscreen) {
      enterFullscreen();
      localStorage.setItem("isSkillAssessment", true);
      navigate("/codingassessmentloading");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  } 
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Grid item xs={12} className="top-panel">
          <div className="fixed-navbar">
            <SkillAssessmentNavbar instruction={true} />
          </div>
        </Grid>
        <Container maxWidth="lg" sx={{ pt: 3, pb: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                textAlign: "center",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <School sx={{ fontSize: 40, mr: 2 }} />
              Skill Assessment Instructions
            </Typography>

            {!isButtonEnabled && (
              <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
                <AccessTime sx={{ marginRight: 1, fontSize: "1.5rem" }} />
                <Typography variant="h6" fontWeight="bold">
                  Assessment Starts in: {formatTime(timeUntilStart)}
                </Typography>
              </Paper>
            )}

            <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                  <Info sx={{ color: "primary.main", mr: 1, fontSize: "1.5rem" }} />
                  <Typography variant="h5" color="primary.main">
                    Assessment Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <Assignment sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        Assessment Name:{" "}
                        <strong>{assessments.assessmentName}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        Duration: <strong>{assessments.duration} Minutes</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        Date: <strong>{assessments.assessmentDate}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        Start Time: <strong>{assessments.startTime}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                  <DescriptionSharp sx={{ color: "primary.main", mr: 1, fontSize: "1.5rem" }} />
                  <Typography variant="h5" color="primary.main">
                    Assessment Guidelines
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ mb: 3 }}
                  dangerouslySetInnerHTML={{
                    __html: assessments.assessmentInstruction,
                  }}
                />
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={3} bgcolor="grey.100">
                <Button
                  variant="contained"
                  onClick={handleStartAssessment}
                  disabled={!isButtonEnabled}
                  sx={{
                    fontSize: "1rem",
                    py: 1,
                    px: 3,
                  }}
                  endIcon={<ArrowForward />}
                >
                  Start Assessment
                </Button>
              </Box>
            </Card>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SkillAssessmentInstruction;
