import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import InfoIcon from "@mui/icons-material/Info";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 150,
  bgcolor: "background.paper",
  border: ".5px solid #000",
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

const IdleTimeModel = ({ open, onClose }) => {
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
              <InfoIcon className="text-info" />
              <span className="ms-3">We've Noticed Your Inactivity</span>
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
          It appears that you have been inactive for a while. If you have
          finished your assessment, please feel free to submit it at your
          convenience. Thank you!
        </Typography>
      </Box>
    </Modal>
  );
};

export default IdleTimeModel;
