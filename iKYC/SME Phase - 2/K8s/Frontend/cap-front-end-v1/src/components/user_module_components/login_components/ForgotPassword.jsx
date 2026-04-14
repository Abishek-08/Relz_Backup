import React, { useState, useEffect } from "react";
import forgotPassword from "../../../assets/user-module-assets/forgot password.jpeg";
import "../../../styles/user_module_styles/login_styles/ForgotPasswordStyle.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { verifyOtp } from "../../../services/user_module_service/LoginService";
import {
  sendOtp,
  sendSecurityQuestions,
} from "../../../services/user_module_service/ProfileService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);  // State for verifying valid email
  const [otpSent, setOtpSent] = useState(false);  // State for sending OTP
  const [otp, setOtp] = useState("");  // State for verify OTP
  const [loading, setLoading] = useState(false); // State for loading animation
  const [expiryTime, setExpiryTime] = useState(null); // State for OTP expiry time
  const [verificationMethod, setVerificationMethod] = useState("sendOTP"); // Default to "sendOTP"
  const [shouldSendOTP, setShouldSendOTP] = useState(false); // State to track OTP send request
  const [otpSectionDisabled, setOtpSectionDisabled] = useState(false); // State for OTP section disable
  const navigate = useNavigate();
  const [countdownKey, setCountdownKey] = useState(Date.now()); // State for countdown time

// Save the user's email to session storage
  sessionStorage.setItem("userEmail", email);

  // Retrieves and sets OTP expiry time from session storage on component mount.
  useEffect(() => {
    const expiryTimeString = sessionStorage.getItem("otpExpiryTime");
    if (expiryTimeString) {
      const expiryTimeDate = new Date(expiryTimeString);
      setExpiryTime(expiryTimeDate);
    }
  }, []);

  // Updates OTP sending status based on email validity and verification method.
  useEffect(() => {
    setShouldSendOTP(isValidEmail && verificationMethod === "sendOTP");
  }, [isValidEmail, verificationMethod]);


  // Updates the email state with the new value from the input field.
  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);

    // Regex for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(regex.test(value));
  };

  const handleSendOTPSelected = () => {
    setVerificationMethod("sendOTP");
    setShouldSendOTP(isValidEmail); // Update OTP sending status based on email validity
    setOtpSent(false); // Reset OTP sent status
    setOtp(""); // Clear OTP field
    setOtpSectionDisabled(false); // Enable OTP section
  };

  // Validates the email, sends security questions if valid, and navigates based on the response.
  const handleTryAnotherWay = () => {
    if (!email.trim()) {
      toast.error("Enter Email Id");
    } else if (!isValidEmail) {
      toast.error("Enter valid email");
    } else {
      sendSecurityQuestions(email)
        .then((res) => {
          if (res.request.status === 200) {
            sessionStorage.setItem("emailId", email);
            setVerificationMethod("tryAnotherWay");
            setEmail(""); // Clear email field
            setOtp(""); // Clear OTP field
            setOtpSectionDisabled(true); // Disable OTP section
            navigate("/securityquestionsverifyview");
          } else if (res.request.status === 204) {
            toast.error("Email Id not found");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

// Sets the verification method to "tryAnotherWay" and clears OTP and email fields while disabling the OTP section.
  const handleTryAnotherWaySelected = () => {
    setVerificationMethod("tryAnotherWay");
    setEmail(""); // Clear email field
    setOtp(""); // Clear OTP field
    setOtpSectionDisabled(true); // Disable OTP section
  };

  // Verifies the OTP and navigates to the reset password page if valid, otherwise shows an error.
  const handleVerifyOtp = async () => {
    const response = await verifyOtp(email, otp);
    if (response.data === true) {
      setTimeout(() => {
        navigate("/resetpassword");
      }, 1000);
    } else {
      toast.error("Invalid OTP");
      setOtp("");
    }
  };

  // Sends an OTP if conditions are met, updates expiry time and session storage, and handles errors with appropriate feedback.
  const handleSendOTP = async () => {
    if (shouldSendOTP) {
      setLoading(true); // Start loading animation

      try {
        const response = await sendOtp(email);
        // Check for successful response
        if (response.status === 200) {
          toast.success("OTP sent successfully");
          sessionStorage.setItem("emailId", email);
          setOtpSent(true);
          const newExpiryTime = new Date(new Date().getTime() + 2 * 60 * 1000);
          setExpiryTime(newExpiryTime);
          setCountdownKey(Date.now());
          sessionStorage.setItem("otpExpiryTime", newExpiryTime.toISOString());
        }
      } catch (error) {
        // Handle errors thrown from the sendOtp service
        if (error.response) {
          // Error response from server (status codes outside 2xx)
          switch (error.response.status) {
            case 400:
              toast.error("Invalid email");
              break;
            case 404:
              toast.warning("Login first");
              break;
            default:
              toast.error("Something went wrong");
              break;
          }
        }
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  // Renders a countdown timer or a "Resend OTP" button based on OTP validity status.
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="mt-3 w-100 d-flex justify-content-center">
          <button
            className="forgotpage-custom-button primary"
            id=""
            onClick={handleSendOTP}
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      );
    } else {
      return (
        <div className="mt-3 w-100 d-flex justify-content-center">
          <Typography>
            OTP valid for{" "}
            <b className="text-danger">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </b>
          </Typography>
        </div>
      );
    }
  };

  // Renders an individual OTP input field with specified properties and styling.
  const renderInput = (props, index) => {
    return (
      <input
        {...props}
        key={index}
        type="text"
        maxLength={1}
        id="otp-input-style"
      />
    );
  };

  return (
    <>
      <div className="container-fluid" id="container_forgotpage">
        <ToastContainer />
        <div className="d-flex" id="forgot_custom_card">
          <div className="col-md-6 p-0">
            <div id="forgot_image-container">
              <img
                id="image_forgot_password"
                src={forgotPassword}
                alt="Forgot Password"
              />
            </div>
          </div>
          <div className="col-md-6 p-5" id="forgot_password_content_container">
            <div className="mb-4" id="main_container_forgot_password_feilds">
              <span id="forgot_password_text">Forgot Password?</span>
            </div>
            <div className="mb-4">
              <div className="col">
                <div id="forgot_password_email_text">
                  Enter the email address associated with your account.
                </div>
              </div>
            </div>
            <div id="radio_button_otp_tryanotherway">
              <RadioGroup
                aria-label="verificationMethod"
                name="verificationMethod"
                value={verificationMethod}
                onChange={(e) => {
                  const newMethod = e.target.value;
                  setVerificationMethod(newMethod);
                  if (newMethod === "tryAnotherWay") {
                    handleTryAnotherWaySelected();
                  } else {
                    handleSendOTPSelected();
                  }
                }}
              >
                <div>
                  <FormControlLabel
                    value="sendOTP"
                    control={<Radio id="sendOTP_radiobutton_forget_password" />}
                    label="Send OTP"
                    checked={verificationMethod === "sendOTP"}
                    onChange={handleSendOTPSelected}
                  />
                  <FormControlLabel
                    value="tryAnotherWay"
                    control={
                      <Radio id="tryAnotherWay_radiobutton_forget_password" />
                    }
                    label="Try Another Way"
                    checked={verificationMethod === "tryAnotherWay"}
                    onChange={handleTryAnotherWaySelected}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="mb-4" id="reset_email_section_forgot_password">
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <input
                    id="input_email_box_forgot_password"
                    type="email"
                    className="form-control"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={
                      otpSectionDisabled && verificationMethod === "sendOTP"
                    } // Disable only when "Send OTP" is selected
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  className="forgotpage-custom-button secondary"
                  id="back_button_forget_password_page"
                  onClick={handleBack}
                >
                  Back
                </button>
                {verificationMethod === "sendOTP" && (
                  <button
                    className="forgotpage-custom-button primary"
                    id="sendOtp_button_forgot_password_page"
                    onClick={handleSendOTP}
                    disabled={!isValidEmail || loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                )}
                {verificationMethod === "tryAnotherWay" && (
                  <button
                    className="forgotpage-custom-button primary"
                    id="tryAnotherWay_button_forgot_password_page"
                    onClick={handleTryAnotherWay}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
            {!otpSectionDisabled && otpSent && (
              <div className="mt-4">
                <div className="mb-3" id="verify_otp_column_forgot_password">
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                      <OTPInput
                        value={otp}
                        onChange={(otp) => setOtp(otp.replace(/[^0-9]/g, ""))}
                        numInputs={6}
                        isInputNum
                        renderInput={renderInput}
                        containerStyle="d-flex justify-content-between"
                        inputStyle={{
                          width: "40px",
                          height: "40px",
                          margin: "0 5px",
                          fontSize: "1.2rem",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <div className="mt-3 d-flex justify-content-center">
                    <button
                      id="verifyOtp_button_forgot_password_page"
                      className="forgotpage-custom-button primary"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6}
                    >
                      Submit OTP
                    </button>
                  </div>
                  <Countdown
                    key={countdownKey}
                    className="mt-3 w-100 d-flex justify-content-center"
                    date={expiryTime}
                    renderer={renderer}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
