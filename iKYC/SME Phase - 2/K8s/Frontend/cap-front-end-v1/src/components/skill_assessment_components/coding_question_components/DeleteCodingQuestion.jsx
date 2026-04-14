import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { deleteCodingQuestion } from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import {
  notifySuccess,
  notifyError,
} from "../../../constants/skill_assessment_constants/NotifyToasterConstants";
import "../../../styles/skill_assessment_styles/coding_question_styles/Delete.css";
import "react-toastify/dist/ReactToastify.css";

//This method is used for delete the particular coding questions using question id.
 
const DeleteCodingQuestion = (props) => {
  const handleDeleteQuestion = (e) => {
    e.preventDefault();
    console.log(props.id);
    deleteCodingQuestion(props.id)
      .then(() => {
        notifySuccess("Delete Question Successfull");
        setTimeout(() => {
          window.location.reload();

        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Deletion failure");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    props.setFlag(false);
  };

  const handleClose = () => {
    props.setFlag(false);
  };

  return (
    <Dialog open={props.flag} onClose={handleClose} id="code-deletebox">
      <DialogTitle id="codeDelete-confirm">Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this question?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} id="cancelCode-deletebtn">
          Cancel
        </Button>
        <Button
          onClick={handleDeleteQuestion}
          id="deleteCode-deletebtn"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCodingQuestion;
