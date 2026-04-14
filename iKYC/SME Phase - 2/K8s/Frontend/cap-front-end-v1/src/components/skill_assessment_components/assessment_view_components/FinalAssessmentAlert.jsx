import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";

const FinalAssessmentAlert = ({ open, setOpen, setRequestFlag }) => {
  // Custom hook to manage fullscreen mode
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  /**
   * Handles the closing of the dialog.
   * Ensures fullscreen mode is applied before closing.
   */
  const handleClose = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen(); // Reapply fullscreen mode if needed
    }
    setOpen(false); // Close the dialog
  };

  /**
   * Handles the submission of the assessment.
   * Applies fullscreen mode, then exits after a delay, and sets the request flag.
   */
  const handleSubmit = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen(); // Ensure fullscreen mode is applied
      setTimeout(() => {
        exitFullscreen(); // Exit fullscreen mode after 2 seconds
      }, 2000);
      setOpen(false); // Close the dialog
      setRequestFlag(true); // Set the request flag to true to indicate submission
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Alert
          severity="warning"
          color="error"
          style={{ fontSize: "30px" }}
        >
          <Typography variant="h6">Required Confirmation</Typography>
        </Alert>
      </DialogTitle>
      <DialogContent>
        <strong>Are you sure you want to submit this assessment?</strong>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          autoFocus
          id="skill_module_cancel_btn"
        >
          No
        </Button>
        <Button
          id="skill_module_confirm_btn"
          onClick={handleSubmit}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinalAssessmentAlert;
