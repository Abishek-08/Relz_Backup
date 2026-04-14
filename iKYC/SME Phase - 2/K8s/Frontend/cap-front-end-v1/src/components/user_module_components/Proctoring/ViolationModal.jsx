import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 150,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  borderRadius: "8px", // Optional: adds rounded corners
  overflow: "hidden", // Optional: hides any overflow
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const ViolationModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          <Typography
            className="fw-bold"
            id="modal-title"
            variant="h6"
            component="h2"
          >
            <div>
              <WarningAmberIcon className="text-warning" />
              <span className="ms-3">Violation Warning</span>
            </div>
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: "gray" }} // Optional: color for the icon
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          If you keep breaking the rules, your account may be terminated and
          your authenticity scores may drop.
        </Typography>
      </Box>
    </Modal>
  );
};

export default ViolationModal;
