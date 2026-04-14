
import React, { useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
/**
 * @author sundar.rajan
 * @since 06-07-2024
 * @version 1.0
 */
 
const SecretKeyModal = ({ showModal, handleClose, handleSubmit }) => {
  // State to manage the value of the input field
  const [inputValue, setInputValue] = useState("");
  // State to manage any error text to display
  const [errorText, setErrorText] = useState("");
 
  // Handles changes to the input field and clears any existing error text
  const handleChange = (event) => {
    setInputValue(event.target.value);
    setErrorText("");
  };
 
  // Clears the input field and error text
  const handleClear = () => {
    setInputValue("");
    setErrorText("");
  };
 
  const handleSubmitModal = () => {
    // Validate input (if needed)
    if (!inputValue) {
      setErrorText("Please enter a valid key.");
      return;
    }
 
    console.log(inputValue);
    // Pass input value to parent component
    handleSubmit(inputValue);
    setInputValue("");
  };
 
  return (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="access-key-modal"
      aria-describedby="modal-for-access-key"
    >
      <Box
        // className="user-schedule-assessments-secret-key-model"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          maxHeight: "80%",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Access Key
          <Button
            className="user-scheduled-assessment-close-model-button"
            onClick={handleClose}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </Button>
        </Typography>
 
        <TextField
          id="user-schedule-assessment-access-key-input"
          label="Enter Key"
          variant="outlined"
          fullWidth
          autoFocus
          style={{ marginTop: "20px" }}
          type="text"
          inputProps={{
            maxLength: 6,
          }}
          value={inputValue}
          onChange={handleChange}
          error={Boolean(errorText)}
          helperText={errorText}
        />
 
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            style={{ marginRight: "10px" }}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleSubmitModal} // Call handleSubmitModal instead of handleSubmit directly
          >
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
 
export default SecretKeyModal;
 
 