import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FemaleProfile from "../../assets/admin-module-assets/Female Profile.jpg";
import MaleProfile from "../../assets/admin-module-assets/Male Profile.jpg";

// Import validation functions
import { useNavigate } from "react-router-dom";
import {
  addUser,
  UpdateUserProfile,
  verifyUserEmail,
} from "../../services/admin_module_services/UserService";
import {
  validateUserEmail,
  validateUserMobile,
  validateUserName,
} from "../../utils/admin_module_utils/add_user_validation";

const defaultTheme = createTheme();

const AddUserModel = ({ onClose, loadData }) => {
  const [emailValid, setEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userGender: "",
  });

  const handleBlur = () => {
    const { userEmail } = formData;
    if (userEmail) {
      // axios.post(`http://localhost:8090/cap/user/validate/${userEmail}`)
      verifyUserEmail(userEmail)
        .then(() => {
          console.log(userEmail);
          setEmailValid(true);
        })
        .catch(() => {
          setEmailValid(false);
          setEmailError("Email already exists");
        });
    }
  };
  const [errors, setErrors] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userGender: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    // Clear existing error message when input changes
    setErrors({
      ...errors,
      [event.target.name]: "",
    });
    if (event.target.name === "userEmail") {
      setEmailError(""); // Clear emailError state when user starts typing a new email
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { userName, userEmail, userMobile, userGender } = formData;

      // Validate fields before submission
      const userNameError = validateUserName(userName);
      const userEmailError = validateUserEmail(userEmail);
      const userMobileError = validateUserMobile(userMobile);
      const userGenderError = validateUserGender(userGender);

      if (
        userNameError ||
        userEmailError ||
        userMobileError ||
        userGenderError
      ) {
        // If any validation fails, set errors and return
        setErrors({
          userName:
            userNameError || (userName ? "" : "Please enter a username"),
          userEmail:
            userEmailError ||
            (userEmail ? "" : "Please enter an email address"),
          userMobile:
            userMobileError ||
            (userMobile ? "" : "Please enter a mobile number"),
          userGender:
            userGenderError || (userGender ? "" : "Please select a gender"),
        });
        setLoading(false); // Stop loading spinner
        return;
      }

      let profileImage;
      if (userGender === "Male") {
        profileImage = MaleProfile;
      } else if (userGender === "Female") {
        profileImage = FemaleProfile;
      } else {
        profileImage = null;
      }

      const formDataToSend = new FormData();

      if (profileImage) {
        const imageBlob = await fetch(profileImage);
        var imageBlobData = await imageBlob.blob();
        formDataToSend.append("file", imageBlobData, "profile.jpg");
      }

      const data = { userName, userEmail, userMobile, userGender };

      const response = await addUser(data);
      await UpdateUserProfile(response.data, formDataToSend);
      onClose();
      loadData();

      toast.success("User added successfully!", {
        autoClose: 2000,
        position: "bottom-right",
      });
      setFormData({
        userName: "",
        userEmail: "",
        userMobile: "",
        userGender: "",
      });
      setTimeout(() => {
        onClose();
        navigate("/viewalluser", { replace: true });
        loadData();
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProfileImage = () => {
    if (formData.userGender === "Male") {
      return (
        <img
          src={MaleProfile}
          alt="Male Avatar"
          style={{ maxWidth: "100px" }}
        />
      );
    } else if (formData.userGender === "Female") {
      return (
        <img
          src={FemaleProfile}
          alt="Female Avatar"
          style={{ maxWidth: "100px" }}
        />
      );
    } else {
      return null;
    }
  };

  // Validation function for gender
  const validateUserGender = (userGender) => {
    if (!userGender) {
      return "Please select a gender.";
    }
    return null;
  };

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="sm">
          <Card sx={{ mt: 0, color: 'white', boxShadow: 'none',
  borderRadius: 0 }}>
            <CardContent>
              <Typography
                component="h3"
                variant="h5"
                align="center"
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3, 
                  color: '#27235c',
                  
                }}
              >
              ADD USER
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="off"
                      name="userName"
                      required
                      fullWidth
                      id="userName"
                      label="Username"
                      autoFocus
                      value={formData.userName}
                      onChange={handleInputChange}
                      error={!!errors.userName}
                      helperText={errors.userName}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="userEmail"
                      label="Email Address"
                      name="userEmail"
                      autoComplete="off"
                      onBlur={handleBlur}
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      error={errors.userEmail || (emailError && emailError)}
                      helperText={errors.userEmail || (emailError && emailError)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="userMobile"
                      label="Mobile"
                      name="userMobile"
                      autoComplete="off"
                      value={formData.userMobile}
                      onChange={handleInputChange}
                      error={!!errors.userMobile}
                      helperText={errors.userMobile}
                      pattern="[0-9]*"
                      inputProps={{
                        maxLength: 10,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      required
                      fullWidth
                      id="userGender"
                      name="userGender"
                      value={formData.userGender}
                      onChange={handleInputChange}
                      error={!!errors.userGender}
                      helperText={errors.userGender}
                      SelectProps={{
                        native: true,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 2,
                        backgroundColor: "#27235c",
                        "&:hover": {
                          backgroundColor: "#97247e",
                        },
                        borderRadius: 2,
                        padding: '10px 0',
                        fontSize: '1rem'
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default AddUserModel;