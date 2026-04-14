import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FemaleProfile from "../../assets/admin-module-assets/Female Profile.jpg";
import MaleProfile from "../../assets/admin-module-assets/Male Profile.jpg";
import "../../styles/admin_module_styles/adduser.css";
import AdminNavbar from "./AdminNavbar";

// Import validation functions
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

const AddUser = () => {
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userGender: "",
  });

  const handleBlur = () => {
    const { userEmail } = formData;
    if (userEmail) {
      verifyUserEmail(userEmail)
        .then(() => {
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
        const imageBlobData = await imageBlob.blob();
        formDataToSend.append("file", imageBlobData, "profile.jpg");
      }

      const data = { userName, userEmail, userMobile, userGender };
      const response = await addUser(data);
      await UpdateUserProfile(response.data, formDataToSend);

      toast.success("User added successfully!");
      setTimeout(() => {
        navigate("/viewalluser");
      }, 2000); 
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="container-fluid m-0 p-0" id="admin_createUser_base">
      <AdminNavbar />
      <ToastContainer />
      <div className="container-fluid" id="admin_createUser_body">
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Card sx={{ width: '130%', borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  // avatar={
                    // <Avatar sx={{ bgcolor: "#27235c" }}>
                    //   <PermIdentityIcon />
                    // </Avatar>
                  // }
                  title={<Typography variant="h6" style={{textAlign:"center", color:"#27235c", fontWeight:"600"}}>ADD USER</Typography>}
                  // sx={{ backgroundColor: "#f5f5f5" }}
                />
                <CardContent>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
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
                          helperText={
                            errors.userEmail || (emailError && emailError)
                          }
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
                          }}>
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
                            mt: 3,
                            mb: 2,
                            backgroundColor: "#27235c",
                            "&:hover": {
                              backgroundColor: "#97247e",
                            },
                          }}
                          disabled={loading}>
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
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default AddUser;
