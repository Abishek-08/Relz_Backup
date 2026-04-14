import React, { useState } from "react";
import { Button, Modal, TextField, MenuItem, Checkbox, FormControlLabel, Paper, Typography, IconButton, Box, Fade } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import {
  validateCompanyName,
  validateRole,
  validateLocation,
  validateFromYear,
} from "../../../../utils/user_module_utils/WorkExperienceValidation";
import { Close, CorporateFare, LocationOn, Work, WorkHistory } from "@mui/icons-material";
import { addWorkExperience } from "../../../../services/user_module_service/ProfileService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";  // Correct import for styled

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: '15px',
  maxWidth: 600,
  width: '100%',
  margin: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #25235C, #2196F3, #26298C)',
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(45deg, #25235C 30%, #2196F3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #2196F3 30%, #25235C 90%)',
  },
}));

const WorkExperienceModal = ({ open, onClose, updateProfile }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const initialFormData = {
    companyName: "",
    role: "",
    location: "",
    fromYear: null,
    toYear: null,
    description: "",
    otherRole: "",
    currentlyWorking: false,
  };

  const [workingData, setWorkingData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    companyName: null,
    role: null,
    location: null,
    fromYear: null,
    toYear: null,
    description: null,
    otherRole: null,
  });

  const handleAddWorking = async () => {
    // Validate all fields before submission
    const companyNameError = validateCompanyName(workingData.companyName);
    const roleError = validateRole(workingData.role);
    const locationError = validateLocation(workingData.location);
    const fromYearError = validateFromYear(workingData.fromYear, workingData.toYear);

    // If any error exists, set them and return
    if (companyNameError || roleError || locationError || fromYearError) {
      setErrors({
        companyName: companyNameError,
        role: roleError,
        location: locationError,
        fromYear: fromYearError,
        toYear: workingData.currentlyWorking ? null : errors.toYear,
        description: null,
        otherRole: null,
      });
      return;
    }

    // Format the dates to ensure only MMM-YYYY format is sent
    if (workingData.role === "Other") {
      workingData.role = workingData.otherRole;
    }

    const formattedDataToSend = {
      ...workingData,
      fromYear: formatDate(workingData.fromYear),
      toYear: workingData.currentlyWorking ? "Present" : formatDate(workingData.toYear),
    };

    addWorkExperience(formattedDataToSend, userId)
      .then((response) => {
        updateProfile(response.data); // Update profile data in parent component
        toast.success("Work experience added successfully");
        onClose(); // Close the modal after successful submission
        setWorkingData(initialFormData);
      })
      .catch((error) => {
        toast.error("Failed to Add Details.");
      });
  };

  // Helper function to format date to MMM-YYYY
  const formatDate = (date) => {
    if (!date) return null;
    const monthYear = new Date(date).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    return monthYear.toUpperCase();
  };

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <StyledPaper elevation={24}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <HeaderTypography variant="h5" style={{color:"#25235C"}}>
              <Work style={{ marginRight: '8px', verticalAlign: 'middle' , color:"#25235C", marginBottom:"5px"}} />
              Add Work Experience
            </HeaderTypography>
            <IconButton onClick={onClose} size="small">
              <Close style={{color:"#25235C"}}/>
            </IconButton>
          </Box>

          <form>
            {/* Company Name */}
            <TextField
              label="Company Name"
              name="companyName"
              value={workingData.companyName}
              onChange={(e) => setWorkingData({ ...workingData, companyName: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
              inputProps={{ maxLength: 50 }}
              InputProps={{
                startAdornment: <CorporateFare color="action" style={{ marginRight: 8 }} />,
              }}
            />

            {/* Role */}
            <TextField
              select
              label="Role"
              name="role"
              value={workingData.role}
              onChange={(e) => setWorkingData({ ...workingData, role: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.role}
              helperText={errors.role}
            >
              <MenuItem value="Software Engineer">Software Engineer</MenuItem>
              <MenuItem value="Tech Support">Tech Support</MenuItem>
              <MenuItem value="Business Analyst">Business Analyst</MenuItem>
              <MenuItem value="Data Analyst">Data Analyst</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {/* Other Role (conditional) */}
            {workingData.role === "Other" && (
              <TextField
                label="Other Role"
                name="otherRole"
                value={workingData.otherRole}
                onChange={(e) => setWorkingData({ ...workingData, otherRole: e.target.value })}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: <WorkHistory color="action" style={{ marginRight: 8 }} />,
                }}
              />
            )}

            {/* Location */}
            <TextField
              label="Location"
              name="location"
              value={workingData.location}
              onChange={(e) => setWorkingData({ ...workingData, location: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.location}
              helperText={errors.location}
              inputProps={{ pattern: "[^0-9!@#$%^&*(),.?\":{}|<>]+" }}
              InputProps={{
                startAdornment: <LocationOn color="action" style={{ marginRight: 8 }} />,
              }}
            />

            {/* Date inputs */}
            <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
              <Box width="48%">
                <Datetime
                  value={workingData.fromYear}
                  onChange={(date) => setWorkingData({ ...workingData, fromYear: date })}
                  inputProps={{
                    placeholder: "Select from Duration",
                    style: { width: '100%', padding: '10px' }
                  }}
                  dateFormat="MMM-YYYY"
                  timeFormat={false}
                  closeOnSelect={true}
                  isValidDate={(current) => current.isBefore(new Date())}
                />
                {errors.fromYear && (
                  <Typography variant="caption" color="error">{errors.fromYear}</Typography>
                )}
              </Box>
              {!workingData.currentlyWorking && (
                <Box width="48%">
                  <Datetime
                    value={workingData.toYear}
                    onChange={(date) => setWorkingData({ ...workingData, toYear: date })}
                    inputProps={{
                      placeholder: "Select to Duration",
                      style: { width: '100%', padding: '10px' }
                    }}
                    dateFormat="MMM-YYYY"
                    timeFormat={false}
                    closeOnSelect={true}
                    isValidDate={(current) => current.isAfter(workingData.fromYear)}
                  />
                  {errors.toYear && (
                    <Typography variant="caption" color="error">{errors.toYear}</Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Currently Working Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={workingData.currentlyWorking}
                  onChange={(e) => setWorkingData({
                    ...workingData,
                    currentlyWorking: e.target.checked,
                    toYear: e.target.checked ? "Present" : workingData.toYear,
                  })}
                  color="primary"
                />
              }
              label="Currently Working Here"
            />

            {/* Description */}
            <TextField
              label="Detailed Description About your Role"
              name="description"
              value={workingData.description}
              onChange={(e) => setWorkingData({ ...workingData, description: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />

            {/* Submit Button */}
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleAddWorking}
            >
              Add Work Experience
            </StyledButton>
          </form>
        </StyledPaper>
      </Fade>
    </StyledModal>
  );
};

export default WorkExperienceModal;
