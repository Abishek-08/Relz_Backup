import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { addLanguage } from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import {
  notifySuccess,
  notifyError,
} from "../../../constants/skill_assessment_constants/NotifyToasterConstants";

const AddLanguage = (props) => {
  // Initialize state variable to store language data
  const [data, setData] = useState({
    languageName: "",
  });

  // Handle form submission to add a new language
  const handleAddLanguage = (e) => {
    e.preventDefault();
    props.setFlag(false);
    addLanguage(data)
      .then(() => {
        notifySuccess("Language added successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch(() => {
        notifyError("Error adding language");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  return (
    <Dialog
      open={props.flag}
      PaperProps={{
        component: "form",
        onSubmit: (e) => handleAddLanguage(e),
      }}
      onClose={() => props.setFlag(false)}
    >
      <DialogTitle>Add New Language</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Language Name"
          name="languageName"
          type="text"
          fullWidth
          onChange={(e) =>
            setData({ ...data, [e.target.name]: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setFlag(false)} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLanguage;
