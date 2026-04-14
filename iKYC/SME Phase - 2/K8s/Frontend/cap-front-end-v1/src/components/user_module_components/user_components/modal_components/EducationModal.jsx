import {
  Business,
  Calculate,
  Close,
  MenuBook,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addEducation } from "../../../../services/user_module_service/ProfileService";
import { validateEducationForm } from "../../../../utils/user_module_utils/validateEducationForm"

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: "none",
  borderRadius: "15px",
  maxWidth: 600,
  width: "100%",
  margin: "auto",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #25235C, #2196F3, #26298C)",
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: "linear-gradient(45deg, #25235C 30%, #2196F3 90%)",
  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #2196F3 30%, #25235C 90%)",
  },
}));

const EducationModal = ({ open, onClose, updateEducation }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const [educationData, setEducationData] = useState({
    degree: "",
    stream: "",
    cgpa: 0,
    instituteName: "",
    fromDuration: "",
    toDuration: "",
  });

  const [degreeOptions] = useState([
    "BE",
    "BSC",
    "B.Tech",
    "BA",
    "ME",
    "MS",
    "M.Tech",
    "PHD",
    "Other",
  ]);

  const [streamOptions, setStreamOptions] = useState([]);
  const [customStream, setCustomStream] = useState("");

  const years = Array.from(
    { length: new Date().getFullYear() - 2000 + 1 },
    (_, index) => 2000 + index
  );

  const handleDegreeChange = (event) => {
    const selectedDegree = event.target.value;
    setEducationData({
      ...educationData,
      degree: selectedDegree,
      stream: "",
    });

    // Mocking streams based on selected degree (replace with your own logic)
    switch (selectedDegree) {
      case "BE":
        setStreamOptions([
          "Civil Engineering",
          "Mechanical Engineering",
          "Electrical Engineering",
        ]);
        break;
      case "B.Tech":
        setStreamOptions([
          "Computer Science",
          "Electronics",
          "Information Technology",
        ]);
        break;
      case "BSC":
        setStreamOptions([
          "Biology",
          "Chemistry",
          "Physics",
          "Computer Application",
        ]);
        break;
      case "ME":
        setStreamOptions(["Structural Engineering", "Thermal Engineering"]);
        break;
      case "MS":
        setStreamOptions(["Data Science", "Artificial Intelligence"]);
        break;
      case "M.Tech":
        setStreamOptions(["Software Engineering", "Networks"]);
        break;
      case "PHD":
        setStreamOptions(["Computer Engineering", "Environmental Engineering"]);
        break;
      case "BA":
        setStreamOptions(["English", "Tamil"]);
        break;
      case "Other":
        setStreamOptions([]);
        setCustomStream("");
        break;
      default:
        setStreamOptions([]);
        break;
    }
  };

  const handleStreamChange = (event) => {
    const selectedStream = event.target.value;
    setEducationData({
      ...educationData,
      stream: selectedStream,
    });

    if (selectedStream === "Other") {
      setCustomStream("");
    }
  };

  const handleAddEducation = () => {
    const errors = validateEducationForm(educationData); // Use the validation function
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const finalDegree =
      educationData.degree === "Other"
        ? educationData.otherDegree || ""
        : educationData.degree;

    const finalStream =
      educationData.stream === "Other" || educationData.degree === "Other"
        ? customStream
        : educationData.stream;

    const postData = {
      degree: finalDegree,
      stream: finalStream,
      cgpa: educationData.cgpa,
      instituteName: educationData.instituteName,
      fromDuration: educationData.fromDuration,
      toDuration: educationData.toDuration,
    };

    addEducation(postData, userId)
      .then((response) => {
        updateEducation(response.data);
        toast.success("Details added successfully!");
        setEducationData({
          degree: "",
          stream: "",
          cgpa: "",
          instituteName: "",
          fromDuration: "",
          toDuration: "",
        });
        onClose();
      })
      .catch((error) => {
        toast.error("Failed to Add Details.");
      });
  };

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <StyledPaper elevation={24}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <HeaderTypography variant="h5" style={{ color: "#25235C" }}>
              <School
                style={{
                  marginRight: "8px",
                  verticalAlign: "middle",
                  color: "#25235C",
                  marginBottom: "5px",
                }}
              />
              Add Education
            </HeaderTypography>
            <IconButton onClick={onClose} size="small">
              <Close
                style={{
                  margin: "8px",
                  verticalAlign: "middle",
                  color: "#25235C",
                }}
              />
            </IconButton>
          </Box>

          <form>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Degree</InputLabel>
              <Select
                label="Degree"
                value={educationData.degree}
                onChange={handleDegreeChange}
              >
                {degreeOptions.map((degree) => (
                  <MenuItem key={degree} value={degree}>
                    {degree}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {educationData.degree === "Other" && (
              <TextField
                label="Enter Degree"
                name="otherDegree"
                value={educationData.otherDegree || ""}
                onChange={(e) =>
                  setEducationData({
                    ...educationData,
                    otherDegree: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <School color="action" style={{ marginRight: 8 }} />
                  ),
                }}
              />
            )}

            {educationData.degree !== "Other" && (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Stream</InputLabel>
                <Select
                  label="Stream"
                  value={educationData.stream}
                  onChange={handleStreamChange}
                  disabled={
                    !educationData.degree || educationData.degree === "Other"
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="">Select Stream</MenuItem>
                  {streamOptions.map((stream) => (
                    <MenuItem key={stream} value={stream}>
                      {stream}
                    </MenuItem>
                  ))}
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            )}

            {(educationData.stream === "Other" ||
              educationData.degree === "Other") && (
              <TextField
                label="Other Stream"
                name="otherStream"
                value={customStream}
                onChange={(e) => setCustomStream(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <MenuBook color="action" style={{ marginRight: 8 }} />
                  ),
                }}
              />
            )}

            <TextField
              label="Institute Name"
              name="instituteName"
              value={educationData.instituteName}
              onChange={(e) =>
                setEducationData({
                  ...educationData,
                  instituteName: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <Business color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />

            <TextField
              label="CGPA"
              name="cgpa"
              type="number"
              value={educationData.cgpa}
              onChange={(e) =>
                setEducationData({
                  ...educationData,
                  cgpa: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <Calculate color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />

            <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
              <FormControl
                style={{ width: "48%" }}
                variant="outlined"
                margin="normal"
              >
                <InputLabel>From Year</InputLabel>
                <Select
                  label="From Year"
                  value={educationData.fromDuration}
                  onChange={(e) =>
                    setEducationData({
                      ...educationData,
                      fromDuration: e.target.value,
                    })
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                style={{ width: "48%" }}
                variant="outlined"
                margin="normal"
              >
                <InputLabel>To Year</InputLabel>
                <Select
                  label="To Year"
                  value={educationData.toDuration}
                  onChange={(e) =>
                    setEducationData({
                      ...educationData,
                      toDuration: e.target.value,
                    })
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleAddEducation}
            >
              Add Education
            </StyledButton>
          </form>
        </StyledPaper>
      </Fade>
    </StyledModal>
  );
};

export default EducationModal;
