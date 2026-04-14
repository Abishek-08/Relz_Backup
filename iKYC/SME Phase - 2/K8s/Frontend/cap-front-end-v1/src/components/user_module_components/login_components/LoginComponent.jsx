import {
  Refresh,
  Visibility,
  VisibilityOff,
  VolumeUp,
} from "@mui/icons-material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cap_logo from "../../../assets/user-module-assets/CAP LOGIN DEMO.png";
import { UserProfileAction } from "../../../redux/actions/user_module_actions/UserProfileAction";
import { login } from "../../../services/user_module_service/LoginService";
import { addUserRequest } from "../../../services/user_module_service/UserRequestService";
import "../../../styles/user_module_styles/login_styles/LoginStyles.css";
import "../../../styles/user_module_styles/login_styles/LoginViewStyle.css"; // Ensure this path is correct
import { DescriptionValidations } from "../../../utils/user_module_utils/login_validations/DescriptionValidations";
import { emailValidations } from "../../../utils/user_module_utils/login_validations/LoginValidations";

const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({ email: "", password: "" }); // State for set the email and password
  const [captchaCode, setCaptchaCode] = useState(
    Math.random().toString(36).slice(7)
  ); // Initializes `captchaCode` with a random alphanumeric string.
  const [captchaInput, setCaptchaInput] = useState(""); // State for Input Captcha
  const [showPassword, setShowPassword] = useState(false); //State for showing password
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    captcha: false,
    modelEmail: false,
    modelDesc: false,
  }); //State for error with boolean flags
  const [loading, setLoading] = useState(false);
  const [loginResult, setLoginResult] = useState({ role: "user", count: "5" }); // State for loginResult with default values for role and count
  const [isFormValid, setIsFormValid] = useState(false); //State for isFormValid with false
  const [modelOpen, setModelOpen] = useState(false); // State for open the modal
  const [unlockRequest, setUnlockRequest] = useState({
    email: "",
    description: "",
  }); //State for unlockRequest with empty strings for email and description.

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting the values
  };

  // Updates `isFormValid` based on user input, error states, and login result conditions.
  useEffect(() => {
    const isValid =
      user.email.length > 0 &&
      user.password.length > 0 &&
      captchaInput.length > 0 &&
      !errors.email &&
      !errors.password &&
      !errors.captcha &&
      loginResult.count > 0;
    setIsFormValid(isValid);
  }, [user, captchaInput, errors, loginResult.count]);

  // Validates form inputs, updates errors, and submits the form if no validation errors are present.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {
      email: !emailValidations(user.email),
      password: user.password.length === 0,
      captcha: captchaInput !== captchaCode,
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some(Boolean)) {
      setLoading(true);
      try {
        const response = await login(user);
        console.log(response);
        handleLoginResponse(response);
      } catch (error) {
        toast.error("Network Error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Processes the login response, stores session data, and navigates based on user role and response status.
  const handleLoginResponse = (response) => {
    if (response.status === 200) {
      localStorage.setItem("loggedIn", true);
      const { data } = response;
      if (data.login.role === "ADMIN") {
        sessionStorage.setItem("adminEmail", user.email);
        sessionStorage.setItem(
          "otpExpiryTime",
          new Date(data.login.expiryTime)
        );
        navigate("/verifyOtp");
      } else {
        sessionStorage.setItem("userEmail", user.email);
        localStorage.setItem("userType", "USER");
        dispatch(UserProfileAction(data.user));
        sessionStorage.setItem("userId", data.userId);
        navigate(
          data.login.freshUser ? "/securityquestionsview" : "/userdashboard"
        );
      }
    } else if (response.response) {
      handleErrorResponse(response.response);
    }
  };

  // Handles error responses by displaying appropriate messages and resetting form fields based on status codes.
  const handleErrorResponse = (errorResponse) => {
    console.log(errorResponse);
    switch (errorResponse.status) {
      case 404:
        toast.error("Account not found. Please contact admin.");
        setUser({ email: "", password: "" });
        setCaptchaInput("");
        generateCaptcha();
        break;
      case 401:
        setLoginResult(errorResponse.data);
        toast.error("Invalid credentials");
        setUser({ ...user, password: "" });
        setCaptchaInput("");
        generateCaptcha();
        break;
      case 423:
        console.log(errorResponse.data.count);
        setLoginResult({ ...loginResult, count: errorResponse.data.count });
        toast.warn(`Account temporarily locked.`);
        setCaptchaInput("");
        generateCaptcha();
        setUnlockRequest({
          ...unlockRequest,
          email: errorResponse.data.user.userEmail,
        });
        break;
      default:
        toast.error("An error occurred. Please try again.");
        setUser({ email: "", password: "" });
        setCaptchaInput("");
        generateCaptcha();
    }
  };

  // Generates a new CAPTCHA code, resets the CAPTCHA input, and clears the CAPTCHA error state.
  const generateCaptcha = () => {
    setCaptchaCode(Math.random().toString(36).slice(7));
    setCaptchaInput("");
    setErrors({ ...errors, captcha: false });
  };

  // Speaks each character of the CAPTCHA code using the selected voice from the browser's speech synthesis.
  const speakCaptcha = () => {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices[6];

    for (const char of captchaCode) {
      const msg = new SpeechSynthesisUtterance(char);
      msg.voice = selectedVoice;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleUnlockRequest = () => {
    setModelOpen(true);
  };

  // Submits the unlock request, displays success or error messages, and resets form and loading state.
  const handleUnlockRequestSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log(unlockRequest);
    const response = await addUserRequest(unlockRequest);
    console.log(response);
    if (response?.status === 200) {
      toast.success("Unlock request submitted successfully.");
    } else if (response?.status === 208) {
      toast.warning("Your request is in pending/rejected state");
    } else {
      toast.error("Failed to submit unlock request.");
    }
    setUser({ email: "", password: "" });
    setUnlockRequest({ email: "", description: "" });
    setLoginResult({ role: "user", count: "5" });
    setModelOpen(false);
    setLoading(false);
  };

  // Updates the `unlockRequest` state with the new value for the specified form field.
  const handleUnlockRequestChange = (event) => {
    const { name, value } = event.target;
    setUnlockRequest({ ...unlockRequest, [name]: value });
  };

  return (
    <div
      className="user-module-container container-fluid vh-100 d-flex align-items-center justify-content-between"
      id="user-module-container"
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <Grid container item xs={12} md={12} id="user-module-grid">
        <Grid item xs={12} sm={5} md={6} id="user-module-image-container">
          <div id="user-module-overlay">
            <img src={Cap_logo} alt="" style={{ width: "70%" }} />
          </div>
        </Grid>
        <Grid item xs={12} sm={7} md={6} id="user-module-form-container">
          <div id="user-module-paper" className="me-5 shadow">
            <Typography variant="h4" className="fw-bold" id="user-module-title">
              Welcome Back!
            </Typography>
            <div className="mt-1">
              <small>It's nice to see you again. Ready to compete?</small>
            </div>

            <Form className="mt-1 h-75" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                className="user-module-login-inputField"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onBlur={(e) =>
                  setErrors({
                    ...errors,
                    email: !emailValidations(e.target.value),
                  })
                }
                error={errors.email}
                helperText={errors.email && "Enter valid email"}
                margin="dense"
              />
              <TextField
                fullWidth
                className="user-module-login-inputField"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                onBlur={() =>
                  setErrors({ ...errors, password: user.password.length === 0 })
                }
                error={errors.password}
                helperText={errors.password && "Password is required"}
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  // inputProps: {
                  //   onPaste: handlePaste, // Prevent pasting
                  // },
                }}
              />
              <Row className="mt-1 mb-0 align-items-center">
                <Col xs={4}>
                  <Paper variant="outlined" className="p-2 text-center">
                    <Typography
                      variant="h6"
                      style={{
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        MsUserSelect: "none",
                      }}
                      className="text-decoration-line-through user-module-login-inputField fw-bold fst-italic"
                    >
                      {captchaCode}
                    </Typography>
                  </Paper>
                </Col>
                <Col xs={8} className="d-flex flex-column">
                  <div className="btn border-0 d-flex gap-3" color="primary">
                    <div onClick={speakCaptcha}>
                      <VolumeUp /> Audio
                    </div>
                    <div onClick={generateCaptcha}>
                      <Refresh /> Refresh
                    </div>
                  </div>
                </Col>
              </Row>
              <TextField
                className="mt-3 user-module-login-inputField"
                fullWidth
                label="Captcha Code"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                onBlur={() =>
                  setErrors({
                    ...errors,
                    captcha: captchaInput !== captchaCode,
                  })
                }
                error={errors.captcha}
                helperText={errors.captcha && "Invalid captcha"}
                margin="dense"
              />
              <div className="d-flex justify-content-end mt-2">
                <Link
                  href="/cap/forgotpassword"
                  className="text-decoration-none"
                  underline="hover"
                  color="primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="mt-1"
                disabled={!isFormValid || loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
              {loginResult.count < 5 && (
                <Typography
                  variant="body2"
                  color="error"
                  className="mt-2 text-center"
                >
                  {loginResult.count <= 0
                    ? "Account temporarily locked"
                    : `Attempts Remaining: ${loginResult.count}`}
                </Typography>
              )}
            </Form>
            <div>
              {loginResult.count <= 0 && (
                <Button
                  type="button"
                  onClick={handleUnlockRequest}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="mt-1"
                >
                  Raise request
                </Button>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
      <div>
        {/* Unlock Request Modal */}
        <Dialog open={modelOpen} maxWidth="sm" fullWidth>
          <DialogTitle id="unlock-request-dialog-title">
            <LockOpenIcon /> <span className="pt-2">Unlock Request</span>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>! Important :</strong> You have previously violated the
              assessment rules and regulations. Please ensure that you do not
              repeat these violations. By submitting this unlock request, you
              are acknowledging your understanding of the rules and are
              committing to follow them.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Once your request is reviewed and approved by the admin, you will
              receive a notification via email. Please check your email for
              further instructions.
            </Typography>
            <form>
              <TextField
                label="Email"
                type="email"
                name="email"
                fullWidth
                value={unlockRequest.email}
                aria-readonly
                disabled
                error={errors.modelEmail}
                helperText={errors.modelEmail && "Enter valid email"}
                margin="dense"
                required
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={unlockRequest.description}
                onChange={handleUnlockRequestChange}
                margin="dense"
                onBlur={(e) =>
                  setErrors({
                    ...errors,
                    modelDesc: !DescriptionValidations(e.target.value),
                  })
                }
                error={errors.modelDesc}
                helperText={
                  errors.modelDesc &&
                  "Please enter atleast 10 character and less than 25"
                }
                required
              />

              <DialogActions>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Button
                    type="btn"
                    onClick={handleUnlockRequestSubmit}
                    variant="contained"
                    disabled={errors.modelEmail || errors.modelDesc}
                    color="primary"
                  >
                    Submit
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setModelOpen(false);
                    setLoading(false);
                    setUnlockRequest({
                      email: unlockRequest.email,
                      description: "",
                    });
                    setErrors({ modelEmail: "", modelDesc: "" });
                  }}
                  color="secondary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginComponent;
