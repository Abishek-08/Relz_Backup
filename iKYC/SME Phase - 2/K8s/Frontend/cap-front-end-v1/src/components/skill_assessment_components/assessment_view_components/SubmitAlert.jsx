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
import { useNavigate } from "react-router-dom";

/**
 * @author dharshsun.s
 * @since 12-07-2024
 * @version 1.0
 */

//This method is used for submit alert
const SubmitAlert = ({ open, onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };

  //After submit
  const handleConfirm = () => {
    navigate("/attemptstatus");
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Alert severity="warning" color="error">
          <Typography variant="h6">Submit Confirmation</Typography>
        </Alert>
      </DialogTitle>
      <DialogContent>
        <strong>Are you sure you want to submit your answers?</strong>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus id="skill_module_cancel_btn">
          Cancel
        </Button>
        <Button id="skill_module_confirm_btn" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitAlert;
