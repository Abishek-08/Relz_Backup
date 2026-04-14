import React, { useState } from "react";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
} from "@mui/material";
import {
  Close,
  CardMembership,
  School,
  DateRange,
  Verified,
  Title,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCertification } from "../../../../services/user_module_service/ProfileService";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { validateCertificationData } from "../../../../utils/user_module_utils/user_validations/CertificationValidation"; 

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
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #2196F3 30%, #25235C 90%)",
  },
}));

const CertificationModal = ({ open, onClose, updateCertificate }) => {
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const initialCertificationData = {
    verificationId: "",
    issueDate: "",
    institutionName: "",
    certificateName: "",
    certificateImage: null,
  };

  const initialErrors = {
    verificationId: "",
    issueDate: "",
    institutionName: "",
    certificateName: "",
    certificateImage: "",
  };

  const [certificationData, setCertificationData] = useState(
    initialCertificationData
  );
  const [errors, setErrors] = useState(initialErrors);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "issueDate") {
      const currentDate = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > currentDate) {
        setErrors({
          ...errors,
          [name]: "Issue Date cannot be in the future",
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }

    setCertificationData({
      ...certificationData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setCertificationData({
      ...certificationData,
      certificateImage: e.target.files[0],
    });
  };

  const handleAddCertification = async () => {
    const { valid, errors: validationErrors } = validateCertificationData(certificationData);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("verificationId", certificationData.verificationId);
    formData.append("issueDate", certificationData.issueDate);
    formData.append("institutionName", certificationData.institutionName);
    formData.append("certificateName", certificationData.certificateName);
    if (certificationData.certificateImage) {
      formData.append("file", certificationData.certificateImage);
    }

    try {
      const response = await addCertification(formData, userId);
      updateCertificate(response);
      onClose(); // Close modal after successful submission
      setCertificationData(initialCertificationData); // Reset form data
      setErrors(initialErrors); // Reset errors
      toast.success("Certificate uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload certificate");
    }
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
            <HeaderTypography variant="h5" style={{ color: "#25235c" }}>
              <CardMembership
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Add Certification
            </HeaderTypography>
            <IconButton onClick={onClose} size="small">
              <Close style={{ color: "#25235c" }} />
            </IconButton>
          </Box>

          <form>
            <TextField
              required
              label="Certificate Verification ID"
              name="verificationId"
              value={certificationData.verificationId}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.verificationId}
              helperText={errors.verificationId}
              InputProps={{
                startAdornment: (
                  <Verified color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />
            <TextField
              required
              label="Issue Date"
              name="issueDate"
              type="date"
              value={certificationData.issueDate}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.issueDate}
              helperText={errors.issueDate}
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              InputProps={{
                startAdornment: (
                  <DateRange color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />
            <TextField
              required
              label="Certification Provider Name"
              name="institutionName"
              value={certificationData.institutionName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.institutionName}
              helperText={errors.institutionName}
              InputProps={{
                startAdornment: (
                  <School color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />
            <TextField
              label="Certified In (Eg:Java,Sql.,)"
              required
              name="certificateName"
              value={certificationData.certificateName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              error={!!errors.certificateName}
              helperText={errors.certificateName}
              InputProps={{
                startAdornment: (
                  <Title color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />
            <Box mt={2}>
              <label
                style={{
                  color: "gray",
                  fontSize: "13px",
                  fontWeight: "lighter",
                }}
              >
                {" "}
                &nbsp;&nbsp;&nbsp;Upload your Certificate Here *
              </label>
              <input
                className="form-control"
                type="file"
                name="certificateImage"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {errors.certificateImage && (
                <Typography
                  color="error"
                  variant="caption"
                  style={{ marginTop: 5 }}
                >
                  {errors.certificateImage}
                </Typography>
              )}
            </Box>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleAddCertification}
            >
              Add Certification
            </StyledButton>
          </form>
        </StyledPaper>
      </Fade>
    </StyledModal>
  );
};

export default CertificationModal;
