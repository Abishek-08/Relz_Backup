import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import updatePasswordImage from "../../../assets/user-module-assets/Security On.gif";
import "../../../styles/user_module_styles/user_dashboard_styles/UpdatePasswordComponentStyles.css";
import { RingLoader } from "react-spinners";
import { updatePassword } from "../../../services/user_module_service/LoginService";
import PasswordStrengthBar from "react-password-strength-bar";

function UpdatePasswordComponent() {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.userPassword);
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  }); // State to manage form values and visibility toggles for password fields
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  }); // State to track the fulfillment of various password criteria for validation
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false); // State to track whether the new password input field is focused
  const [modalOpen, setModalOpen] = useState(false);

  // Handles input changes, limits new password to 15 characters, and updates password criteria
  const handleChange = (prop) => (event) => {
    const value = event.target.value.slice(0, 15); // Limit input to 15 characters
    setValues({ ...values, [prop]: value });

    if (prop === "newPassword") {
      if (value.length <= 15) {
        setPasswordCriteria({
          hasUpperCase: /[A-Z]/.test(value),
          hasLowerCase: /[a-z]/.test(value),
          hasNumber: /[0-9]/.test(value),
          hasSpecialChar: /[@#$%^&*!]/.test(value),
          isLongEnough: value.length >= 10,
        });
      }
    }
  };

  // Toggles visibility of the password field specified by 'prop'
  const handleClickShowPassword = (prop) => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  // Prevents default action when the password field is clicked
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Handles form submission: validates passwords and shows error messages if validation fails
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.oldPassword === "") {
      toast.error("Please Enter Old Password");
      return;
    }

    if (values.oldPassword === values.newPassword) {
      toast.error("Old and New Password Must be Different");
      return;
    }

    if (values.confirmPassword !== values.newPassword) {
      toast.error("Password Doesn't Match");
      return;
    }

    // Show modal with loader
    setModalOpen(true);

    try {
      await updatePassword(values);

      // On successful update
      toast.success("Password updated successfully");
      sessionStorage.clear();
      localStorage.removeItem("assessmentData");
      localStorage.removeItem("jwt");
      localStorage.removeItem("userType");
      localStorage.removeItem("loggedIn");
      navigate("/login");

      // Clear form fields
      setValues({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });

      // Close modal after successful update
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update password");
      setModalOpen(false); // Close modal on failure
    }
  };

  // Disable button until all fields are filled
  const isButtonDisabled =
    !values.oldPassword || !values.newPassword || !values.confirmPassword;

  console.log(
    !values.oldPassword,
    !values.newPassword,
    !values.confirmPassword,
    loading
  );

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting
  };

  return (
    <div id="container-fluid">
      <div
        className="row"
        id="update_password_component_user_component_main_row"
      >
        <div className="col-md-7 d-flex justify-content-center">
          <div>
            <img
              src={updatePasswordImage}
              alt=""
              className="img-fluid"
              id="update_password_gif_conatiner"
            />
          </div>
        </div>
        <div className="col-md-3 justify-content-center align-items-center">
          <div id="user-login-update-password-content">
            <div className="conatiner-fluid">
              <Box sx={{ my: 5, textAlign: "center" }}>
                <Typography variant="h5" component="h1" gutterBottom>
                  <LockResetRoundedIcon id="lock_icon_in_update_password_component" />{" "}
                  Update Password
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Old Password"
                    type={values.showOldPassword ? "text" : "password"}
                    value={values.oldPassword}
                    onChange={handleChange("oldPassword")}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword("showOldPassword")}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showOldPassword ? (
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
                  <TextField
                    fullWidth
                    label="New Password"
                    type={values.showNewPassword ? "text" : "password"}
                    value={values.newPassword}
                    onChange={handleChange("newPassword")}
                    onFocus={() => setIsNewPasswordFocused(true)}
                    onBlur={() => setIsNewPasswordFocused(false)}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword("showNewPassword")}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showNewPassword ? (
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
                    inputProps={{ maxLength: 15 }} // Limit input to 15 characters
                  />
                  {isNewPasswordFocused && (
                    <Box sx={{ width: "100%", marginTop: "10px" }}>
                      <PasswordStrengthBar password={values.newPassword} />
                      <Typography variant="body2">
                        <ul className="user_module_update_password-criteria-list">
                          <li
                            className={
                              passwordCriteria.hasUpperCase &&
                              passwordCriteria.hasLowerCase
                                ? "criteria-valid"
                                : "criteria-invalid"
                            }
                          >
                            Upper & lower case letters
                          </li>
                          <li
                            className={
                              passwordCriteria.hasSpecialChar
                                ? "criteria-valid"
                                : "criteria-invalid"
                            }
                          >
                            Symbols (e.g., @#$)
                          </li>
                          <li
                            className={
                              passwordCriteria.hasNumber
                                ? "criteria-valid"
                                : "criteria-invalid"
                            }
                          >
                            Numbers
                          </li>
                          <li
                            className={
                              passwordCriteria.isLongEnough
                                ? "criteria-valid"
                                : "criteria-invalid"
                            }
                          >
                            A longer password (at least 10 characters)
                          </li>
                        </ul>
                      </Typography>
                    </Box>
                  )}
                  <br />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={values.showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword(
                              "showConfirmPassword"
                            )}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showConfirmPassword ? (
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
                    inputProps={{ maxLength: 15 }} // Limit input to 15 characters
                  />
                  <br />
                  <br />
                  <Button
                    id="submit_button_update_password"
                    type="submit"
                    variant="contained"
                    disabled={isButtonDisabled}
                  >
                    Update
                  </Button>
                </form>
              </Box>
            </div>
          </div>
          {/* Modal with RingLoader */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="d-flex align-items-center justify-content-center h-100">
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "transparent",
                  borderRadius: 10,
                  p: 4,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <center>
                    <RingLoader color="#25235c" loading={true} size={150} />
                    <br />
                    <Typography
                      variant="h5"
                      component="h2"
                      color="white"
                      gutterBottom
                    >
                      Updating Password ...
                    </Typography>
                  </center>
                </div>
              </Box>
            </div>
          </Modal>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordComponent;
