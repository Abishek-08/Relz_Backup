import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Modal,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close, School } from "@mui/icons-material";
import { toast } from "react-toastify";
import { updateEducation } from "../../../../services/user_module_service/ProfileService";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "600px",
  maxHeight: "95vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: "20px",
  padding: "10px 20px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const EditEducationModal = ({ open, onClose, education, onSave }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  // Memoize the degreeStreams object
  const degreeStreams = useMemo(
    () => ({
      BSC: ["Biology", "Chemistry", "Physics", "Computer Application", "Other"],
      BE: [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
      ],
      "B.Tech": ["Computer Science", "Electronics", "Information Technology"],
      MSC: ["Physics", "Mathematics", "Chemistry"],
      MS: ["Data Science", "Artificial Intelligence"],
      PHD: ["Computer Engineering", "Environmental Engineering"],
      MA: ["Literature", "History", "Psychology"],
      ME: ["Structural Engineering", "Thermal Engineering"],
      "M.Tech": ["Software Engineering", "Networks"],
      BA: ["English", "Tamil"],
    }),
    []
  );

  const [availableStreams, setAvailableStreams] = useState([]);
  const [educationData, setEducationData] = useState({
    academicId: "",
    instituteName: "",
    degree: "Other",
    otherDegree: "",
    stream: "",
    otherStream: "",
    fromDuration: "",
    toDuration: "",
    cgpa: "",
    user: { userId: userId },
  });

  const updateAvailableStreams = useCallback(
    (selectedDegree) => {
      if (degreeStreams[selectedDegree]) {
        setAvailableStreams(degreeStreams[selectedDegree]);
      } else {
        setAvailableStreams([]);
      }
    },
    [degreeStreams]
  );

  useEffect(() => {
    if (education) {
      const {
        academicId,
        instituteName,
        degree,
        stream,
        fromDuration,
        toDuration,
        cgpa,
      } = education;

      const selectedDegree = degree in degreeStreams ? degree : "Other";

      // Update available streams when degree changes
      updateAvailableStreams(selectedDegree);

      // Ensure stream is correctly initialized based on available streams
      setEducationData({
        academicId,
        instituteName,
        degree: selectedDegree,
        otherDegree: degree,
        stream: availableStreams.includes(stream) ? stream : "Other",
        otherStream: stream,
        fromDuration,
        toDuration,
        cgpa,
        user: { userId: userId },
      });
    }
  }, [
    education,
    degreeStreams,
    availableStreams,
    userId,
    updateAvailableStreams,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "degree") {
      setEducationData((prevData) => ({
        ...prevData,
        degree: value,
        otherDegree: value === "Other" ? prevData.otherDegree : "",
        stream: value === "Other" ? "" : prevData.stream,
        otherStream: value === "Other" ? "" : prevData.otherStream,
      }));
    } else if (name === "stream") {
      setEducationData((prevData) => ({
        ...prevData,
        stream: value,
        otherStream: value === "Other" ? prevData.otherStream : "",
      }));
    } else {
      setEducationData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const fromYear = moment(educationData.fromDuration, "YYYY");
      const toYear = moment(educationData.toDuration, "YYYY");

      if (educationData.degree === "BE" || educationData.degree === "B.Tech") {
        const gap = toYear.diff(fromYear, "years");
        if (gap !== 4) {
          toast.error("Duration Must be 4 years.");
          return;
        }
      }

      if (educationData.degree === "BA" || educationData.degree === "BSC") {
        const gap = toYear.diff(fromYear, "years");
        if (gap !== 3) {
          toast.error("Duration Must be 3 years.");
          return;
        }
      }

      if (educationData.degree === "ME" || educationData.degree === "M.Tech") {
        const gap = toYear.diff(fromYear, "years");
        if (gap !== 2) {
          toast.error("Duration Must be 2 years.");
          return;
        }
      }

      if (
        !fromYear.isValid() ||
        !toYear.isValid() ||
        toYear.isSameOrBefore(fromYear)
      ) {
        toast.error("Invalid duration. Please select valid years.");
        return;
      }
      if (parseFloat(educationData.cgpa) < 5) {
        toast.error("CGPA must be greater than 5.");
        return;
      }

      const updatedData = {
        ...educationData,
        degree:
          educationData.degree === "Other"
            ? educationData.otherDegree
            : educationData.degree,
        stream:
          educationData.stream === "Other" || educationData.degree === "Other"
            ? educationData.otherStream
            : educationData.stream,
      };

      await updateEducation(educationData.academicId, updatedData);
      toast.success("Education updated successfully!");
      onSave(updatedData);
      onClose();
    } catch (error) {
      toast.error("Error updating education. Please try again.");
    }
  };

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = 2000; year <= currentYear; year++) {
      years.push(
        <MenuItem key={year} value={year.toString()}>
          {year}
        </MenuItem>
      );
    }
    return years;
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            style={{ color: "#25235C" }}
          >
            <School
              color="primary"
              fontSize="large"
              style={{
                marginBottom: "7px",
                color: "#25235C",
                marginRight: "10px",
              }}
            />
            Edit Education
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close style={{ color: "#25235c" }} />
          </IconButton>
        </Box>
        <TextField
          label="Institute Name"
          name="instituteName"
          value={educationData.instituteName}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Degree</InputLabel>
          <Select
            label="Degree"
            name="degree"
            value={educationData.degree}
            onChange={handleChange}
          >
            {Object.keys(degreeStreams).map((degree) => (
              <MenuItem key={degree} value={degree}>
                {degree}
              </MenuItem>
            ))}
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {educationData.degree === "Other" && (
          <TextField
            label="Other Degree"
            name="otherDegree"
            value={educationData.otherDegree}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        )}
        {educationData.degree !== "Other" && (
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Stream</InputLabel>
            <Select
              label="Stream"
              name="stream"
              value={educationData.stream}
              onChange={handleChange}
            >
              {availableStreams.map((stream) => (
                <MenuItem key={stream} value={stream}>
                  {stream}
                </MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        )}
        {educationData.stream === "Other" && (
          <TextField
            label="Other Stream"
            name="otherStream"
            value={educationData.otherStream}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        )}
        <div className="container-fluid" style={{ padding: "0px" }}>
          <div className="row">
            <div className="col-md-6">
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>From Duration</InputLabel>
                <Select
                  label="From Duration"
                  name="fromDuration"
                  value={educationData.fromDuration}
                  onChange={handleChange}
                >
                  {generateYearOptions()}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>To Duration</InputLabel>
                <Select
                  label="To Duration"
                  name="toDuration"
                  value={educationData.toDuration}
                  onChange={handleChange}
                >
                  {generateYearOptions()}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
        <TextField
          label="CGPA"
          name="cgpa"
          value={educationData.cgpa}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Box mt={1} display="flex" justifyContent="flex-end">
          <StyledButton
            variant="contained"
            fullWidth
            onClick={handleUpdate}
            startIcon={<School />}
            style={{ backgroundColor: "#25235C" }}
          >
            Save
          </StyledButton>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default EditEducationModal;
