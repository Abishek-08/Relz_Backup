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
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AlarmOn, EventRepeat } from "@mui/icons-material";
import {
  fetchLearningAssessments,
  fetchSkillAssessments,
  verifySecretKey,
} from "../../../../services/user_module_service/ScheduleAssessmentsService";
import "../../../../styles/user_module_styles/assessment_styles/ScheduledLearningAssessmentStyles.css";
import "../../../../styles/user_module_styles/user_dashboard_styles/AssessmentNotFoundStyle.css";
import SecretKeyModal from "./SecretKeyModal";
/**
 * @author varshinee.manisekar
 * @since 14-07-2024
 * @version 1.0
 */
/**
 * @author sundar
 * @since 21-07-2024
 * @version 2.0
 */
/**
 * @author varshinee.manisekar
 * @since 27-07-2024
 * @version 3.0
 */

// A styled Card component with transition effects and hover transformations
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
}));

// A styled Chip component with custom margin based on theme spacing
const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ScheduledAssessments = () => {
  const [assessmentsData, setAssessmentsData] = useState([]); // State to manage the array of assessments data
  const [buttonState, setButtonState] = useState({}); // State to manage the various properties or statuses of buttons
  const [showModal, setShowModal] = useState(false);  // State to control the visibility of a modal
  const [selectedAssessment, setSelectedAssessment] = useState(null); // State to manage the currently selected assessment
  const [selectedAssessmentsData, setSelectedAssessmentsData] = useState(); // State to manage data for the selected assessments
  const [filterOption, setFilterOption] = useState("all");  // State to manage the current filter option, defaulting to "all"
  const [filterDate, setFilterDate] = useState(""); // State to manage the selected date for filtering
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the current search query
  const [assessmentType, setAssessmentType] = useState("skill"); // State to manage the selected type of assessment, defaulting to "skill"
  const user = useSelector((state) => state.profileDetails.profileDetails); // Retrieves the user profile details from the Redux store
  const navigate = useNavigate(); // State for navigating to other route

  // Fetches assessments data based on the assessment type and updates state, with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await (assessmentType === "learning"
          ? fetchLearningAssessments(user.userEmail)
          : fetchSkillAssessments(user.userEmail));
        setAssessmentsData(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast.error("Failed to fetch assessments. Please try again later.");
      }
    };

    fetchData();
  }, [user.userEmail, assessmentType]);

  // Updates button states based on assessment times and checks every second for changes
  useEffect(() => {
    const updateButtonStates = () => {
      const now = new Date();
      const updatedButtonState = assessmentsData.reduce((acc, assessment) => {
        const { assessmentDate, startTime } = assessment;
        const [time] = startTime.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        const [month, day, year] = assessmentDate.split("/").map(Number);
        const assessmentDateTime = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes
        );
        const tenMinutesBeforeStartTime = new Date(
          assessmentDateTime.getTime() - 10 * 60000
        );    // Calculates the time 10 minutes before the assessment start time
        const fifteenMinutesAfterStartTime = new Date(
          assessmentDateTime.getTime() + 15 * 60000
        );    // Calculates the time 15 minutes after the assessment start time
        acc[assessment.scheduledAssessmentId] = {
          isEnabled:
            now >= tenMinutesBeforeStartTime &&
            now <= fifteenMinutesAfterStartTime,
        };    // Sets button state to enabled if the current time is between 10 minutes before and 15 minutes after the assessment start time
        return acc;
      }, {});

      setButtonState(updatedButtonState);
    };
    updateButtonStates(); // Run immediately on mount or when assessmentsData changes
    const interval = setInterval(updateButtonStates, 1000); // Check every second
    return () => clearInterval(interval);
  }, [assessmentsData]);

  // Updates the filter option and resets the filter date if the option is not "byDate"
  const handleFilterOptionChange = (event) => {
    const option = event.target.value;
    setFilterOption(option);
    if (option !== "byDate") {
      setFilterDate("");
    }
  };

  // Updates the search query state with the value from the search input field
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Updates the filter date state with the value from the date input field
  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filterAssessments = () => {
      // Initialize `filtered` with the full list of assessments
    let filtered = assessmentsData;
// Apply filter based on the selected filter option
    if (filterOption === "today" || filterOption === "tomorrow") {
      const currentDate = new Date();     // Get the current date

      // Filter assessments based on the chosen date filter
      filtered = filtered.filter((assessment) => {
        const [month, day, year] = assessment.assessmentDate
          .split("/")
          .map(Number);
        const assessmentDateObj = new Date(year, month - 1, day);
// Check if the assessment date matches the filter criteria
        if (filterOption === "today") {
           // Check if the assessment date is today
          return (
            currentDate.toDateString() === assessmentDateObj.toDateString()
          );
        } else if (filterOption === "tomorrow") {
          // Calculate tomorrow's date
          const tomorrowDate = new Date(currentDate);
          tomorrowDate.setDate(currentDate.getDate() + 1);
          // Check if the assessment date is tomorrow
          return (
            tomorrowDate.toDateString() === assessmentDateObj.toDateString()
          );
        }
        return true;
      });
    } else if (filterOption === "byDate" && filterDate.trim() !== "") {
       // Convert the selected filter date to a Date object
      const selectedDate = new Date(filterDate);
      // Filter assessments by the selected date
      filtered = filtered.filter((assessment) => {
        const [month, day, year] = assessment.assessmentDate
          .split("/")
          .map(Number);
        const assessmentDateObj = new Date(year, month - 1, day);
         // Check if the assessment date matches the selected date
        return selectedDate.toDateString() === assessmentDateObj.toDateString();
      });
    }

        // Apply search query filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((assessment) =>
       // Check if the assessment name includes the search query
        assessment.assessmentName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      );
    }
// Return the filtered assessments
    return filtered;
  };

  const filteredAssessments = filterAssessments();

  // Handles the action when taking an assessment: sets selected assessment data, prepares assessment details, and shows the modal
  const handleTakeAssessment = (assessment) => {
    setSelectedAssessmentsData(assessment);
    setSelectedAssessment({
      secretKey: "",
      user: { userId: user.userId },
      scheduleAssessment: { schedulingId: assessment.scheduledAssessmentId },
    });
    setShowModal(true);
  };

  // Closes the modal and clears the selected assessment state
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssessment(null);
  };

  const handleSubmitModal = async (key) => {
    setShowModal(false);

    try {
      // Send a request to verify the provided secret key
      const response = await verifySecretKey({
        ...selectedAssessment,
        secretKey: key,
      });
 // Check if the response status is OK (200)
      if (response.status === 200) {
        // Store selected assessment data in local storage
        localStorage.setItem(
          "assessmentData",
          JSON.stringify(selectedAssessmentsData)
        );
        // Navigate to the appropriate page based on the assessment type
        if (selectedAssessmentsData.type === "Skill") {
          navigate("/assessmentInstruction/skill");
        } else {
          navigate("/knowledgeAssessmentLandingPage");
        }
      } else {
        // Show error message if the secret key is invalid
        toast.error("Invalid Access Key");
        setShowModal(false);  // Ensure the modal is closed
      }
    } catch (error) {
      // Log any errors and show a generic error message
      console.error("Error verifying secret key:", error);
      toast.error("An error occurred. Please try again.");
      setShowModal(false);
    }
// Clear the selected assessment state
    setSelectedAssessment(null);
  };

  // Updates the assessment type state based on the selected tab value
  const handleTabChange = (event, newValue) => {
    setAssessmentType(newValue);
  };

  // Formats and returns a time string in a 12-hour format based on the provided time string
  const formatDateTime = (dateStr, timeStr) => {
    const formattedTime = new Date(`2000-01-01T${timeStr}`).toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    );
    return formattedTime;
  };

  return (
    <Container maxWidth="xl">
      <ToastContainer />
      <Box py={10}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          color="#25235c"
          fontSize={30}
          marginTop={1}
        >
          Scheduled Assessments
        </Typography>

        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
          marginTop={-5}
        >
          <Grid item xs={12} md={3}>
            <Tabs
              value={assessmentType}
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
          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <FormControl
                sx={{ width: 150, mr: 2 }}
                id="user-module-learning-filter-by-type-select"
              >
                <Select
                  value={filterOption}
                  onChange={handleFilterOptionChange}
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="byDate">By Date</MenuItem>
                </Select>
              </FormControl>

              {filterOption === "byDate" && (
                <TextField
                  type="date"
                  value={filterDate}
                  onChange={handleFilterDateChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  className="user-module-learning-filter-by-day-input"
                  size="small"
                />
              )}

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
          </Grid>
        </Grid>
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            p: 3,
            backgroundImage:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            marginBottom={2}
          >
            Assessment Details
          </Typography>
          <Typography variant="body1" paragraph marginBottom={0}>
            Assessment typically displays scheduled assessments based on
            specific topics. Users can view upcoming assessments related to
            their coursework. These assessments help evaluate your understanding
            and progress in the material.
          </Typography>
        </Paper>

        <Box mt={4}>
          <Grid container spacing={3}>
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={assessment.scheduledAssessmentId}
                >
                  <StyledCard className="user-module-learning-assessment-card">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {assessment.assessmentName}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <EventIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Scheduled Date:</strong>{" "}
                          {new Date(
                            assessment.assessmentDate
                          ).toLocaleDateString("en-US")}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <TimerIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Start Time: </strong>{" "}
                          {formatDateTime(
                            assessment.assessmentDate,
                            assessment.startTime
                          )}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AlarmOn color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong> Duration:</strong> {assessment.duration} min
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EventRepeat color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Status:</strong>
                          <StyledChip
                            label={assessment.status}
                            color="secondary"
                            variant="outlined"
                          />
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box mt="20" p={1}>
                      <Button
                        fullWidth
                        onClick={() => handleTakeAssessment(assessment)}
                        disabled={
                          !buttonState[assessment.scheduledAssessmentId]
                            ?.isEnabled
                        }
                        className={
                          !buttonState[assessment.scheduledAssessmentId]
                            ?.isEnabled
                            ? "user-module-learning-assessment-btn-disabled"
                            : "user-module-learning-assessment-btn"
                        }
                        sx={{
                          backgroundColor: !buttonState[
                            assessment.scheduledAssessmentId
                          ]?.isEnabled
                            ? "#a3a3a3"
                            : "#050c5e",
                          color: "#ffffff", // Always white text color
                          transition:
                            "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            backgroundColor: !buttonState[
                              assessment.scheduledAssessmentId
                            ]?.isEnabled
                              ? "#a3a3a3"
                              : "#050c5e",
                          },
                        }}
                      >
                        {buttonState[assessment.scheduledAssessmentId]
                          ?.isEnabled
                          ? "Take Assessment"
                          : "Take Assessment"}
                      </Button>
                    </Box>
                  </StyledCard>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box>
                  <Box display="flex" justifyContent="center" mt={5}>
                    <h6>No Assessment Scheduled</h6>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      <SecretKeyModal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitModal}
      />
    </Container>
  );
};

export default ScheduledAssessments;
