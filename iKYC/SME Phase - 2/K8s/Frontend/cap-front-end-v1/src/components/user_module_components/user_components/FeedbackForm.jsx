import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Rating,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import feedbackGif from "../../../assets/user-module-assets/Feedback.gif";
import { setProctoring } from "../../../redux/actions/user_module_actions/ProctoringAction";
import { insertFeedbackToAssessment } from "../../../services/user_module_service/FeedbackService";
import "../../../styles/user_module_styles/user_dashboard_styles/FeedbackStyles.css";
import { validateFeedback } from "../../../utils/user_module_utils/user_validations/ValidateFeedbackForm";
import useFullScreen from "../Proctoring/useFullScreen";
import { getDynamicFeedback } from "../../../services/user_module_service/FeedbackService";
import "../../../styles/user_module_styles/user_dashboard_styles/FeedbackStyles.css";

import FeedBackRender from "./FeedBackRender";

import { Star } from "@mui/icons-material";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});
  const [hover, setHover] = useState(-1); // Add state for hover feedback
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profileDetails.profileDetails);
  const userId = user.userId;

  const userData = JSON.parse(localStorage.getItem("assessmentData"));
  const assessmentId = userData.assessmentId;
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  useEffect(() => {
    getDynamicFeedback(assessmentId)
      .then((response) => {
        setDynamicFields(response.data);
      })
      .catch((err) => {
        toast.err("Error Fetching Dynamic Fields");
      });
  }, [assessmentId]);

  useEffect(() => {
    const abrupt = localStorage.getItem("abruptStop");
    if (abrupt === "true") {
      let timerInterval;
      Swal.fire({
        title: "Violation Limit Exceeded!",
        html: "You have exceeded the maximum allowed violations. You will be redirected shortly. <b></b>",
        icon: "error",
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getHtmlContainer().querySelector("b");
          if (timer) {
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft() || 0}`;
            }, 500);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(() => {
        sessionStorage.setItem("submitted", true);
        setTimeout(() => {
          dispatch(setProctoring());
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
        }, 5000);
      });
    }
  }, [dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setProctoring());
    const validationError = validateFeedback(feedback);
    if (validationError) {
      setError(validationError);
      return;
    }

    const feedbackObject = {
      feedback: {
        feedback: feedback,
        rating: rating.toString(),
      },
      userId: userId,
      assessmentId: assessmentId,
      attribute: dynamicValues,
    };

    insertFeedbackToAssessment(feedbackObject)
      .then(() => {
        toast.success("Feedback submitted successfully");
        if (!isFullscreen) {
          enterFullscreen();
          setTimeout(() => {
            exitFullscreen();
            navigate("/userdashboard");
          }, 1000);
        } else {
          navigate("/userdashboard");
        }
        setFeedback("");
        setRating(0);
        setDynamicValues({});
      })
      .catch((err) => {
        toast.error("Failed to submit feedback. Please try again later.");
      });
  };

  const handleFeedbackChange = (value) => {
    setFeedback(value);
    if (error) {
      setError("");
    }
  };

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

  const handleDynamicFieldChange = (attributeId, value) => {
    setDynamicValues((prevValues) => ({
      ...prevValues,
      [attributeId]: value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: "#25235c",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              WE WANT YOUR <br />{" "}
              <span style={{ color: "#e00472" }}>FEEDBACK</span>
            </Typography>
            <form onSubmit={handleSubmit} id="feedback_form_form_container">
              <Box mb={3}>
                <ReactQuill
                  value={feedback}
                  onChange={handleFeedbackChange}
                  placeholder="Your Feedback here..."
                  theme="snow"
                  id="feedback_form_quill_editor_container"
                  style={{ height: "150px", marginBottom: "50px" }}
                />
              </Box>
              <Box mb={3}>
                {" "}
                {dynamicFields.map((field, index) => (
                  <div key={field.attributeId}>
                    <FeedBackRender
                      field={field}
                      questionNumber={index + 1}
                      handleDynamicFieldChange={handleDynamicFieldChange}
                    />
                  </div>
                ))}
              </Box>
              <Box mb={3} sx={{ textAlign: "center" }}>
                <Typography variant="h6" component="div" gutterBottom>
                  Rate your experience:
                </Typography>
                <Rating
                  name="hover-feedback"
                  value={rating}
                  precision={0.5}
                  onChange={handleRatingChange}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {rating !== null && (
                  <Box sx={{ ml: 2 }}>{hover !== -1 ? hover : rating}</Box>
                )}
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#25235c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#e00472",
                  },
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                SUBMIT FEEDBACK
              </Button>
              {error && (
                <Typography
                  variant="body2"
                  sx={{ color: "red", mt: 2, textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}
            </form>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "relative",
              minHeight: { xs: "300px", md: "600px" },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${feedbackGif})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.3,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, #25235c 30%, #e00472 90%)`,
                mixBlendMode: "color-burn",
              },
            }}
          />
        </Grid>
      </Paper>
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default FeedbackForm;
