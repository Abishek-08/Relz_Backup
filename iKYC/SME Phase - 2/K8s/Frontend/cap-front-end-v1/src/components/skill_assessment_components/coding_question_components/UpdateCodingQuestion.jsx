import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getCodingQuestion,
  updateCodingQuestion,
} from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/skill_assessment_styles/coding_question_styles/Update.css";
import { notifyError, notifySuccess } from "../../../constants/skill_assessment_constants/NotifyToasterConstants";
import "../../../styles/skill_assessment_styles/coding_question_styles/AddQuestion.css";


const UpdateCodingQuestion = (props) => {
  /**
   * State variables to store the coding question data, title error, description error, and Quill text.
   */
  const [data, setData] = useState({});
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [quillText, setQuillText] = useState("");

  /**
   * Effect hook to fetch the coding question data when the component mounts or the ID changes.
   */
  useEffect(() => {
    getCodingQuestion(props.id)
      .then((res) => {
        setData(res.data);
        setQuillText(res.data.questionDescription || "");
      })
      .catch(() => {
        notifyError("Error Fetching the details");
      });
  }, [props.id]);

  const validateTitle = (value) => {
    if (value.length < 10) {
      setTitleError("Question title must be at least 10 characters");
    } else {
      setTitleError("");
    }
  };

  const validateQuillText = (value) => {
    const plainText = value.replace(/<[^>]*>?/gm, "");
    if (plainText.length < 50) {
      setDescriptionError(
        "Question description must be at least 50 characters"
      );
    } else {
      setDescriptionError("");
    }
  };

  const handleQuillChange = (value) => {
    setQuillText(value);
    validateQuillText(value); // Validate on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate title and description before proceeding
    if (data.questionTitle.length < 10) {
      setTitleError("Question title must be at least 10 characters long");
      return;
    }
    if (quillText.length < 50) {
      setDescriptionError(
        "Question description must be at least 50 characters long"
      );
      return;
    }

    props.setFlag(false);
    const formData = {
      questionId: data.questionId,
      questionTitle: data.questionTitle,
      questionDescription: quillText,
    };

    updateCodingQuestion(formData)
      .then(() => {
        notifySuccess("Question Updated successfully!");
        setTimeout(() => {
          window.location.reload("/allcodingquestion");

        }, 500);
      })
      .catch(() => {
        notifyError("Error updating Question");
        setTimeout(() => {

        }, 3000);
      });
  };

  /**
   * Handle dialog close.
   */
  const handleClose = () => {
    props.setFlag(false);
  };

  return (
    <Dialog
      open={props.flag}
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
      onClose={handleClose}
      maxWidth={"md"}
    >
      <DialogContent className="dialog-content" id="codeupdate-dialog">
        <DialogTitle id="codeupdate-head">
          Update Question Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} id="code-updatefield">
            <TextField
              id="codeupdate-bg"
              fullWidth
              label="Question Title"
              name="questionTitle"
              value={data.questionTitle || ""}
              onChange={(e) => {
                setData({ ...data, questionTitle: e.target.value });
                validateTitle(e.target.value);
              }}
              required
              error={!!titleError}
              helperText={titleError}
            />
          </Grid>
          <Grid item xs={12}>
            <DialogTitle id="codeUpdate-description">
              Question Description
            </DialogTitle>
            <ReactQuill
              id="codeupdate-quill"
              value={quillText}
              onChange={handleQuillChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              theme="snow"
            />
            {descriptionError && (
              <p style={{ color: "red" }}>{descriptionError}</p>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="codedialog-actions">
        <Button onClick={handleClose} id="codecancel-button">
          Cancel
        </Button>
        <Button
          type="submit"
          id="codeupdate-button"
          autoFocus
          onClick={handleSubmit}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCodingQuestion;
