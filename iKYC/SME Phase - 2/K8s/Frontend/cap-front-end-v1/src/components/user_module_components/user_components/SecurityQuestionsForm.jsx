 /**
 * @author Sb Abishek
 * @from 04-07-2024 to 11-07-2024
 * @version 1.0
 */

import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/user_module_styles/security_questions_styles/SecurityQuestions.css";
import {
  addSecurityQuestion,
  fetchSecurityQuestions,
} from "../../../services/user_module_service/SecurityQuestionsService";
import Security from "../../../assets/user-module-assets/Security.gif";

const SecurityQuestionsForm = () => {
  const navigate = useNavigate();

  const userEmail = useSelector(
    (state) => state.profileDetails.profileDetails.userEmail
  );

  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(["", "", ""]);
  const [answers, setAnswers] = useState(["", "", ""]);

  useEffect(() => {
    fetchSecurityQuestions()
      .then((res) => {
        setQuestions(res.data);
        setAvailableQuestions(res.data);
      })
      .catch((err) => {
        setAvailableQuestions([]);
        console.log(err);
      });
  }, []);

  const handleQuestionChange = (value, index) => {
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[index] = value;
    setSelectedQuestions(newSelectedQuestions);

    // Remove selected question from available questions
    const updatedAvailableQuestions = availableQuestions.filter(
      (q) => q !== value
    );
    setAvailableQuestions(updatedAvailableQuestions);
  };

  const handleAnswerChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleClear = () => {
    setSelectedQuestions(["", "", ""]);
    setAnswers(["", "", ""]);
    setAvailableQuestions(questions); // Reset available questions
  };

  const handleSubmit = async () => {
    let isValid = true;
    let errorMessage = "";

    // Check if any questions are the same
    if (
      selectedQuestions[0] === selectedQuestions[1] ||
      selectedQuestions[1] === selectedQuestions[2] ||
      selectedQuestions[2] === selectedQuestions[0]
    ) {
      toast.error("Select Different Questions");
      return;
    }

    // Validate each question and answer
    selectedQuestions.forEach((question, index) => {
      if (!question) {
        isValid = false;
        errorMessage += `Please select or enter question ${index + 1}.\n`;
      } else if (question.length < 15) {
        isValid = false;
        errorMessage += `Question ${
          index + 1
        } must be at least 15 characters long.\n`;
      }

      if (!answers[index]) {
        isValid = false;
        errorMessage += `Please enter an answer for question ${index + 1}.\n`;
      }
    });

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    const payload = selectedQuestions.map((question, index) => {
      return {
        answers: answers[index],
        questions: question,
      };
    });
    const response = await addSecurityQuestion(userEmail, payload);

    if (response.status === 200) {
      toast.success("Security questions added successfully");
      navigate("/resetpassword");
    } else if (response.status === 204) {
      toast.error("You already have security questions");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      id="user-module-security-questions-main-container"
      className="d-flex flex-wrap m-0 justify-content-end align-items-center vh-100 p-5"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-7 d-flex justify-content-center align-items-center">
            <img
              src={Security}
              alt="SecurityQuestions"
              id="security_questions_image"
            />
          </div>
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <div className="w-100" id="user-module-security-questions-card">
              <ToastContainer />
              <div>
                <h2 className="mb-4">Security Questions</h2>
                <p className="mb-4 text-danger">
                  * You can select from predefined questions or enter your own
                  custom questions.
                </p>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="mb-2">
                    <Autocomplete
                      disablePortal
                      className="bg-light rounded"
                      id={`question-${index}`}
                      options={availableQuestions} // Use available questions here
                      value={selectedQuestions[index]}
                      onChange={(event, value) =>
                        handleQuestionChange(value, index)
                      }
                      renderInput={(params) => (
                        <TextField
                          className="bg-white bg-opacity-10 rounded border-0"
                          {...params}
                          label={`Select or type`}
                        />
                      )}
                      freeSolo // Allow free input
                      onInputChange={(event, newInputValue) => {
                        handleQuestionChange(newInputValue, index); // Update selected question with free input
                      }}
                    />
                    {selectedQuestions[index] && ( // Render answer field only if question is selected
                      <div className="mt-2">
                        <TextField
                          className="rounded"
                          fullWidth
                          label={`Answer`}
                          value={answers[index]}
                          onChange={(event) =>
                            handleAnswerChange(event.target.value, index)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="d-flex flex-wrap justify-content-end gap-2">
                  <Button
                    variant="contained"
                    id="user-module-security-questions-clear-btn"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    id="user-module-security-questions-submit-btn"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionsForm;
