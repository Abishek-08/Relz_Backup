 /**
 * @author Sb Abishek
 * @from 04-07-2024 to 11-07-2024
 * @version 1.0
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import SecurityGif from '../../../../src/assets/user-module-assets/Authentication.gif';
import "../../../../src/styles/user_module_styles/security_questions_styles/SecurityQuestionsVerify.css";

const SecurityQuestionsVerify = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("userEmail"); // Retrieves the user's email from session storage.
  const [fetchedQuestions, setFetchedQuestions] = useState([]); // Initializes `fetchedQuestions` as an empty array to store retrieved security questions.
  const [answers, setAnswers] = useState({});   // Initializes `answers` as an empty object to store user-provided answers to security questions.
  const [fetchError, setFetchError] = useState(null); // Initializes `fetchError` as `null` to store any error that occurs during data fetching.

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        console.log(email);
        const response = await axios.get(
          `http://localhost:8090/cap/security/mapped/${email}`
        );
        console.log("Fetch response:", response.data);
        setFetchedQuestions(response.data || []);
        initializeAnswers(response.data || []); // Initialize answers state with empty strings
        setFetchError(null); // Reset fetch error state
      } catch (error) {
        console.error("Error fetching user questions:", error);
        setFetchError("Error fetching user questions. Please try again.");
        setFetchedQuestions([]);
        initializeAnswers([]); // Initialize answers state with empty array
      }
    };

    if (email) {
      fetchUserQuestions();
    }
  }, [email]); // Include email in the dependency array

  const initializeAnswers = (questions) => {
    const initialAnswers = {};
    questions.forEach((question, index) => {
      initialAnswers[index] = ""; // Initialize each answer with an empty string
    });
    setAnswers(initialAnswers);
  };

  const handleAnswerChange = (index, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: answer,
    }));
  };

  const handleVerifyAnswersSubmit = async () => {
    try {
      const answersPayload = Object.keys(answers).map((index) => ({
        answers: answers[index], // Answer corresponding to the index
        questions: fetchedQuestions[index], // Question corresponding to the index
      }));

      console.log(answersPayload);

      const response = await axios.post(
        `http://localhost:8090/cap/security/verify/${email}`,
        answersPayload
      );
      console.log("Verification response:", response);

      toast.success("Verification Successful");

      // Redirect to reset page after 3 seconds
      setTimeout(() => {
        navigate("/resetpassword");
      }, 3000);
    } catch (error) {
      console.error("Error verifying answers:", error);
      toast.error("Verification Failed");
    }
  };

  // Clears the answer for a specific question by updating the `answers` state at the given index.
  const handleClearAnswer = (index) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: "",
    }));
  };

  return (
    <div id="security-sidebar-form">
      <Container>
        <div id="security-content-wrapper" className="d-flex align-items-center">
          {/* Left column for GIF */}
          <div id="security-gif-column">
          <img src={SecurityGif} alt="GIF" />
          </div>
          
          {/* Right column for form */}
          <div id="security-form-column" className="d-flex flex-column align-items-center h-100"> 
            <Typography variant="h4">Security Questions Verification</Typography>

            {fetchError && (
              <Alert severity="error" style={{ marginBottom: "10px" }}>
                {fetchError}
              </Alert>
            )}

            {fetchedQuestions.length > 0 && (
              <>
                {fetchedQuestions.map((question, index) => (
                  <TextField
                    key={index}
                    id={`question-${index}-input`}
                    label={question}
                    required
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear answer"
                            onClick={() => handleClearAnswer(index)}
                            edge="end"
                          >
                            <RefreshIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}
                <Button
                  id="security-verify-answers-btn"
                  onClick={handleVerifyAnswersSubmit}
                  variant="contained"
                >
                  <ChecklistRoundedIcon id="security-questions-verify-icon" />{" "}
                  Verify
                </Button>
              </>
            )}
          </div>
        </div>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default SecurityQuestionsVerify;
