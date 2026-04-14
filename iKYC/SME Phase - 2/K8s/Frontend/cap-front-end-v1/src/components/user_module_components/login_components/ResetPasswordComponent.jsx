import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "../../../assets/user-module-assets/Reset password.gif";
import "../../../styles/user_module_styles/login_styles/ResetPasswordStyle.css";
import { validatePassword } from "../../../utils/user_module_utils/login_validations/ResetPasswordValidation";
import { resetPassword } from "../../../services/user_module_service/LoginService";

/**
 * @author varshinee.manisekar
 * @since 08-07-2024
 * @version 1.0
 *
 * @author kirubakaran.b
 * @since 12-07-2024
 * @version 2.0
 *
 * @author varshinee.manisekar
 * @since 29-07-2024
 * @version 3.0
 *
 */

function ResetPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  }); //state to control the visibility of new and confirm password fields.
  const [buttonDisable, setButtonDisable] = useState(false); //state to control the enabled/disabled state of a button.
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); //State to track whether the password input field is focused.
  const [loading, setLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  }); // State of passwordCriteria to track various password validation criteria.
  const navigate = useNavigate();

  const userEmail = sessionStorage.getItem("userEmail");

  // Validates passwords, updates the password if valid, handles errors, and navigates to the login page on success.
  const handleResetPassword = async () => {
    const isValidPassword = validatePassword(password);

    if (!isValidPassword) {
      toast.error(
        "Password must contain 1-15 characters with special characters, numbers, and alphabets."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please enter matching passwords.");
      return;
    }

    try {
      setLoading(true);
      setButtonDisable(true);

      const response = await resetPassword(userEmail, password);

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        sessionStorage.clear();
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
      setButtonDisable(false);
    }
  };

  // Toggles the visibility of the specified password field.
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };
  // Sets `isPasswordFocused` to `true` when the password input field gains focus.
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  // Sets `isPasswordFocused` to `false` when the password input field loses focus.
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  // Handles the change event of the password input field.
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    if (value.length <= 15) {
      setPassword(value);
      setPasswordCriteria({
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[@#$%^&*!]/.test(value),
        isLongEnough: value.length >= 10,
      });
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting
  };

  return (
    <div className="container-fluid" style={{ maxWidth: "100vw" }}>
      <div
        className="row d-flex justify-content-center align-items-center"
        id="reset_password_component_sub_container"
      >
        <div className="col-md-5">
          <img src={ResetPassword} alt="resetPassword" />
        </div>
        <div className="col-md-3">
          <ToastContainer />
          <div>
            <div>
              <br />
              <div style={{ fontSize: "30px", fontWeight: "lighter" }}>
                Reset your
              </div>
              <div
                style={{
                  color: "#25235c",
                  fontSize: "52px",
                  fontWeight: "bold",
                  marginTop: "-15px",
                }}
              >
                Password
              </div>
              <br></br>
              <TextField
                type={showPassword.newPassword ? "text" : "password"}
                label="New Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("newPassword")}
                        edge="end"
                      >
                        {showPassword.newPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps: {
                    onPaste: handlePaste, // Prevent pasting
                  },
                }}
                style={{ marginBottom: "10px", marginTop: "-5px" }}
              />
              {isPasswordFocused && (
                <Box sx={{ width: "100%", marginTop: "10px" }}>
                  <PasswordStrengthBar password={password} />
                  <Typography variant="body2">
                    <ul>
                      <li
                        style={{
                          color:
                            passwordCriteria.hasUpperCase &&
                            passwordCriteria.hasLowerCase
                              ? "green"
                              : "red",
                        }}
                      >
                        Upper & lower case letters
                      </li>
                      <li
                        style={{
                          color: passwordCriteria.hasSpecialChar
                            ? "green"
                            : "red",
                        }}
                      >
                        Symbols (e.g., @#$)
                      </li>
                      <li
                        style={{
                          color: passwordCriteria.hasNumber ? "green" : "red",
                        }}
                      >
                        Numbers
                      </li>
                      <li
                        style={{
                          color: passwordCriteria.isLongEnough
                            ? "green"
                            : "red",
                        }}
                      >
                        A longer password (at least 10 characters)
                      </li>
                    </ul>
                  </Typography>
                </Box>
              )}
              <br />
              <br />
              <TextField
                type={showPassword.confirmPassword ? "text" : "password"}
                label="Confirm New Password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        edge="end"
                      >
                        {showPassword.confirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps: {
                    onPaste: handlePaste, // Prevent pasting
                  },
                }}
              />
              <br />
              <br />
              <center>
                <Button
                  style={{ backgroundColor: "#25235c", color: "white" }}
                  variant="contained"
                  onClick={handleResetPassword}
                  disabled={buttonDisable}
                >
                  {loading ? (
                    <RingLoader color="#ffffff" loading={true} size={26} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordComponent;
