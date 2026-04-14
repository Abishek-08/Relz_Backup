import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import otpGif from "../../../assets/user-module-assets/Enter OTP.gif";
import {
  resendOtp,
  verifyOtp,
} from "../../../services/user_module_service/LoginService";
import "../../../styles/user_module_styles/login_styles/VerifyOTPStyle.css";
import { otpValidation } from "../../../utils/user_module_utils/login_validations/OtpValidation";

/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: VerifyOtpComponent.jsx
 */

const VerifyOtpComponent = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [countdownKey, setCountdownKey] = useState(Date.now()); // Unique key for Countdown
  const [endTime, setEndTime] = useState(Date.now() + 2 * 60 * 1000); // Default 2 minutes from now

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setEmail(await sessionStorage.getItem("adminEmail"));

      // Retrieve stored end time and calculate remaining time
      const storedEndTime = sessionStorage.getItem("otpEndTime");
      if (storedEndTime) {
        const currentTime = Date.now();
        const remainingTime = parseInt(storedEndTime, 10) - currentTime;
        if (remainingTime > 0) {
          setEndTime(parseInt(storedEndTime, 10));
        } else {
          setEndTime(currentTime + 2 * 60 * 1000); // Reset to 2 minutes if expired
        }
      } else {
        // Set end time for 2 minutes from now
        const newEndTime = Date.now() + 2 * 60 * 1000;
        sessionStorage.setItem("otpEndTime", newEndTime.toString());
        setEndTime(newEndTime);
      }

      setCountdownKey(Date.now()); // Force re-render of Countdown
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  // Verifies OTP length and validity, then proceeds with OTP verification or shows an error
  const handleVerifyAndLogin = () => {
    if (otp.length !== 6) {
      setError("Please enter OTP to continue");
    } else if (otpValidation(otp)) {
      handleVerifyOtp();
    } else {
      setError("Please enter a valid 6-digit OTP");
    }
  };
  // Verifies OTP, handles response and navigation, manages loading state, and handles errors
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      if (response.data === true) {
        setTimeout(() => {
          setLoading(false);
          navigate("/adminDashboard");
          sessionStorage.removeItem("otpEndTime");
          localStorage.setItem("userType", "ADMIN");
        }, 1000);
      } else {
        setError("Invalid OTP");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
      setError("An error occurred");
      setLoading(false);
    }
  };

  // Resends OTP, updates countdown, handles responses and errors, and manages loading state
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await resendOtp(email);
      console.log(response);

      if (response.status === 200) {
        // Reset countdown end time to 2 minutes from now
        const newEndTime = Date.now() + 2 * 60 * 1000;
        sessionStorage.setItem("otpEndTime", newEndTime.toString());
        setEndTime(newEndTime);
        setCountdownKey(Date.now()); // Change key to force re-render

        setLoading(false);
        setError("");
        setOtp("");
        toast.success("OTP has been resent");
      } else if (response.status === 400) {
        setLoading(false);
        toast.error("Technical Problem");
      } else {
        setLoading(false);
        toast.error("Network Error");
      }
    } catch (error) {
      console.error("Failed to resend OTP", error);
      setLoading(false);
      toast.error("An error occurred");
    }
  };

  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <div
          className="mt-5 w-100 d-flex justify-content-center"
          id="resend_otp_text_area"
        >
          <span>Didn't receive OTP? </span>
          <input
            type="button"
            id="verifyOTP_resend_otp_button"
            onClick={handleResendOtp}
            value="Resend"
          />
        </div>
      );
    } else {
      // Render a countdown
      return (
        <div className="mt-3 w-100 d-flex justify-content-center">
          <span>
            OTP valid for{" "}
            <b className="text-danger">
              {minutes}:{seconds}
            </b>
          </span>
        </div>
      );
    }
  };

  return (
    <div
      className="container d-flex flex-wrap"
      id="user-module-otp-main-container"
    >
      <ToastContainer />
      <div>
        <img className="img-fluid" src={otpGif} alt="OTP GIF" />
      </div>
      <div id="user-module-otp-main-container-child">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
            width: "500px",
            padding: 4,
          }}
        >
          <Grid
            container
            sx={{
              paddingLeft: "40px",
            }}
            spacing={2}
          >
            <Grid item xs={12}>
              <OTPInput
                value={otp}
                onChange={(otp) => setOtp(otp.replace(/[^0-9]/g, ""))}
                numInputs={6}
                renderInput={(props) => (
                  <input {...props} type="tel" pattern="[0-9]*" />
                )}
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  margin: "10px",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography variant="body2" className="ms-2" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
            {loading ? (
              <Grid
                className=" d-flex justify-content-center align-items-center"
                item
                xs={12}
              >
                <div>
                  <CircularProgress sx={{ color: "#1d1c69" }} />
                </div>
              </Grid>
            ) : (
              <Grid id="user-module-otp-btn-container" item xs={12}>
                <button
                  id="user-module-otp-btn-verify"
                  onClick={handleVerifyAndLogin}
                >
                  Continue
                </button>
              </Grid>
            )}
          </Grid>
          <Countdown
            key={countdownKey} // Ensure countdown re-renders when key changes
            className="mt-3 w-100 d-flex justify-content-center"
            date={endTime} // Set countdown end time
            renderer={renderer}
          />
        </Box>
      </div>
    </div>
  );
};

export default VerifyOtpComponent;
