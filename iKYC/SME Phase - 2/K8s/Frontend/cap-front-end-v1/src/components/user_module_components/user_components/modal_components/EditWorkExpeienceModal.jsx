import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { updateWorkExperience } from "../../../../services/user_module_service/ProfileService";
import moment from "moment";
import { Close, Work } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "24px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
  width: "90%",
  maxWidth: "600px",
  maxHeight: "95vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "linear-gradient(45deg, #25235C 30%, #2196F3 90%)",
  marginTop: theme.spacing(3),
  borderRadius: "30px",
  padding: "12px 24px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    transition: "all 0.3s ease",
  },
  "& .MuiInputLabel-root": {
    transition: "all 0.3s ease",
  },
}));

const EditWorkExperienceModal = ({ open, onClose, workexperience, onSave }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const [workExperienceData, setWorkExperienceData] = useState({
    workExperienceId: "",
    companyName: "",
    role: "",
    location: "",
    fromYear: "",
    toYear: "",
    description: "",
    otherRole: "",
    currentlyWorking: false,
    user: {
      userId: userId,
    },
  });

  const [errors, setErrors] = useState({
    fromYear: "",
    toYear: "",
  });

  const [disableDateSelection, setDisableDateSelection] = useState(false);

  useEffect(() => {
    if (workexperience) {
      // Destructure workexperience and set default values if needed
      const {
        workExperienceId,
        companyName,
        role,
        otherRole,
        location,
        fromYear,
        toYear,
        description,
      } = workexperience;

      const isCurrentlyWorking = toYear === "Present";

      const newWorkExperienceData = {
        workExperienceId,
        companyName,
        role: role === "Software Engineer" || role === "Tech Support" || role === "Business Analyst" || role === "Data Analyst" ? role : "Other", // Conditionally set role
        location,
        fromYear,
        toYear: isCurrentlyWorking ? "Present" : toYear,
        description,
        otherRole: otherRole !== "" ? role : "", // Conditionally set otherRole
        currentlyWorking: isCurrentlyWorking, // Set checkbox based on toYear
        user: {
          userId,
        },
      };

      // Update state with newWorkExperienceData
      setWorkExperienceData(newWorkExperienceData);
    }
  }, [workexperience, userId]);

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setWorkExperienceData({
      ...workExperienceData,
      currentlyWorking: checked,
      toYear: checked ? "Present" : workExperienceData.toYear, // Set to "Present" if checked
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target || e;

    // Validate location for special characters
    if (name === "location" && /[^a-zA-Z0-9 ]/.test(value)) {
      toast.error("Location cannot contain special characters.");
      return;
    }

    // Handle role and otherRole logic
    if (name === "role" && value === "Other") {
      setWorkExperienceData({
        ...workExperienceData,
        role: value,
        otherRole: workExperienceData.otherRole || "",
      });
    } else if (name === "otherRole") {
      setWorkExperienceData({
        ...workExperienceData,
        otherRole: value,
      });
    } else if (moment.isMoment(value)) {
      const formattedDate = value.format("MMM-YYYY");

      if (workExperienceData.role === "Other") {
        setWorkExperienceData({
          ...workExperienceData,
          otherRole: workExperienceData.otherRole || "",
          [name]: formattedDate,
        });
      } else {
        setWorkExperienceData({
          ...workExperienceData,
          [name]: formattedDate,
        });
      }

      // Validate date ranges
      if (name === "fromYear") {
        const isValid = validateFromYear(
          formattedDate,
          workExperienceData.toYear
        );
        setDisableDateSelection(!isValid);
      } else if (name === "toYear") {
        const isValid = validateToYear(
          workExperienceData.fromYear,
          formattedDate
        );
        setDisableDateSelection(!isValid);
      }
    } else {
      setWorkExperienceData({
        ...workExperienceData,
        [name]: value,
      });
    }
  };

  const validateFromYear = (fromYear, toYear) => {
    if (!fromYear || !moment(fromYear, "MMM-YYYY").isValid()) {
      setErrors({
        ...errors,
        fromYear: "Invalid from year format. Use MMM-YYYY.",
      });
      return false;
    } else if (
      toYear &&
      moment(fromYear, "MMM-YYYY").isAfter(moment(toYear, "MMM-YYYY"))
    ) {
      setErrors({
        ...errors,
        fromYear: "From year must be before to year.",
      });
      return false;
    } else {
      setErrors({
        ...errors,
        fromYear: "",
      });
      return true;
    }
  };

  const validateToYear = (fromYear, toYear) => {
    // Check if the user is currently working and if toYear is "Present"
    if (workExperienceData.currentlyWorking && toYear === "Present") {
      return true;
    }
  
    // Check if toYear is not provided or if it's an invalid format
    if (!toYear || !moment(toYear, "MMM-YYYY").isValid()) {
      setErrors({
        ...errors,
        toYear: "Invalid to year format. Use MMM-YYYY.",
      });
      return false;
    }
  
    // Convert toYear and fromYear to moment objects
    const toYearMoment = moment(toYear, "MMM-YYYY");
    const fromYearMoment = fromYear ? moment(fromYear, "MMM-YYYY") : null;
  
    // Check if toYear is before fromYear
    if (fromYearMoment && toYearMoment.isBefore(fromYearMoment)) {
      setErrors({
        ...errors,
        toYear: "To year must be after from year.",
      });
      return false;
    }
  
    const currentMonth = moment().startOf('month'); 
    if (toYearMoment.isAfter(currentMonth)) {
      setErrors({
        ...errors,
        toYear: "To year must be in the past relative to the current month.",
      });
      return false;
    }

    setErrors({
      ...errors,
      toYear: "",
    });
    return true;
  };
  

  const handleUpdate = async () => {
    try {
      const isValidFromYear = validateFromYear(
        workExperienceData.fromYear,
        workExperienceData.toYear
      );
      const isValidToYear = validateToYear(
        workExperienceData.fromYear,
        workExperienceData.toYear
      );

      if (!isValidFromYear || !isValidToYear) {
        toast.error("Invalid date range. Please correct the dates.");
        return;
      }

      if (workExperienceData.role === "Other") {
        workExperienceData.role = workExperienceData.otherRole;
      }
      await updateWorkExperience(
        workExperienceData,
        workExperienceData.workExperienceId
      );
      toast.success("Work Experience updated successfully!");
      onSave(workExperienceData);
      onClose();
    } catch (error) {
      toast.error("Error updating work experience. Please try again.");
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            variant={isMobile ? "h5" : "h4"}
            component="h2"
            fontWeight="bold"
            style={{ color: "#25235C" }}
          >
            <Work
              fontSize={isMobile ? "large" : ""}
              style={{
                marginBottom: "5px",
                marginRight: "10px",
                verticalAlign: "middle",
              }}
            />
            Edit Work Experience
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close style={{color:"#25235c"}}/>
          </IconButton>
        </Box>
        <StyledTextField
          label="Company Name"
          name="companyName"
          value={workExperienceData.companyName}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <StyledTextField
          select
          label="Role"
          name="role"
          value={workExperienceData.role}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="Software Engineer">Software Engineer</MenuItem>
          <MenuItem value="Tech Support">Tech Support</MenuItem>
          <MenuItem value="Business Analyst">Business Analyst</MenuItem>
          <MenuItem value="Data Analyst">Data Analyst</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </StyledTextField>

        {workExperienceData.role === "Other" && (
          <StyledTextField
            label="Other Role"
            name="otherRole"
            value={workExperienceData.otherRole}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        )}

        <StyledTextField
          label="Location"
          name="location"
          value={workExperienceData.location}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <Box mt={1} mb={1}>
          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            style={{ color: theme.palette.text.secondary }}
          >
            Duration (Worked From & Till Duration)
          </Typography>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "stretch" : "center"}
          >
            <Box width={isMobile ? "100%" : "30%"} mb={isMobile ? 1 : 0}>
              <Datetime
                inputProps={{
                  style: {
                    borderRadius: "16px",
                    width: "100%",
                  },
                }}
                dateFormat="MM/YYYY"
                timeFormat={false}
                value={
                  workExperienceData.fromYear
                    ? moment(workExperienceData.fromYear, "MMM-YYYY")
                    : null
                }
                onChange={(date) =>
                  handleChange({ target: { name: "fromYear", value: date } })
                }
                renderInput={(props) => (
                  <StyledTextField {...props} fullWidth variant="outlined" />
                )}
                disabled={disableDateSelection}
              />
              {errors.fromYear && (
                <Typography color="error" variant="caption">
                  {errors.fromYear}
                </Typography>
              )}
            </Box>

            <Box width={isMobile ? "100%" : "30%"} mb={isMobile ? 1 : 0}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={workExperienceData.currentlyWorking}
                    onChange={handleCheckboxChange}
                    value={workExperienceData.toYear}
                    color="primary"
                  />
                }
                label="Currently Working Here"
              />
            </Box>

            {!workExperienceData.currentlyWorking && (
              <Box width={isMobile ? "100%" : "30%"}>
                <Datetime
                  inputProps={{
                    style: {
                      borderRadius: "16px",
                      width: "100%",
                    },
                  }}
                  dateFormat="MM/YYYY"
                  timeFormat={false}
                  value={
                    workExperienceData.toYear &&
                    workExperienceData.toYear !== "Present"
                      ? moment(workExperienceData.toYear, "MMM-YYYY")
                      : null
                  }
                  onChange={(date) =>
                    handleChange({ target: { name: "toYear", value: date } })
                  }
                  renderInput={(props) => (
                    <StyledTextField {...props} fullWidth variant="outlined" />
                  )}
                  disabled={disableDateSelection}
                />
                {errors.toYear && (
                  <Typography color="error" variant="caption">
                    {errors.toYear}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
        
        <StyledTextField
          label="Description"
          name="description"
          value={workExperienceData.description}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          multiline
          rows={1}
        />
        <Box display="flex" justifyContent="flex-end">
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            startIcon={<Work />}
            fullWidth
            style={{backgroundColor:"#25235C"}}
          >
            Save Changes
          </StyledButton>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default EditWorkExperienceModal;
