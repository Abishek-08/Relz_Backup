import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../../../constants/skill_assessment_constants/NotifyToasterConstants";
import { addCategory } from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";

 // Initialize state variable to store category data
const AddCategory = (props) => {
  const [data, setData] = useState({
    categoryName: "",
    language: {
      languageId: props.languageId,
    },
  });

// Handle form submission to add a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    props.setFlag(false);
    addCategory(data)
      .then(() => {
        notifySuccess("Category added successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Error adding category");
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
        onSubmit: (e) => handleAddCategory(e),
      }}
      onClose={() => props.setFlag(false)}
    >
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          required
          type="text"
          name="categoryName"
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

export default AddCategory;
