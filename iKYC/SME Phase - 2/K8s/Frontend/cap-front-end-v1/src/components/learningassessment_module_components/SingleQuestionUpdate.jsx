import React, { useEffect, useState } from "react";
import "../../styles/learning_assessment_styles/SingleQuestionUpdate.css";
import {
  fetchQuestionById,
  updateQuestion,
  deleteAnswerById,
} from "../../services/learning_assessment_service/SingleQuestionUpdateService.js";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  Card,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  validateQuestionContent,
  validateMSQOptions,
  checkForDuplicateOptions,
} from "../../utils/learning_assessment_utils/SingleQuestionUpdateValidation";

const SingleQuestionUpdate = () => {
  // State variables to manage question and answers data
  const [questionId, setQuestionId] = useState("");
  const [complexity, setComplexity] = useState("");
  const [content, setContent] = useState("");
  const [mark, setMark] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [subtopicId, setSubtopicId] = useState("");
  const [subtopic, setSubtopic] = useState({});
  const [topicName, setTopicName] = useState("");
  const [subtopicName, setSubtopicName] = useState("");

  const [answers, setAnswers] = useState([
    { optionId: 1, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 2, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 3, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 4, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 5, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 6, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 7, correctAnswer: 0, optionContent: "", optionMark: 0 },
    { optionId: 8, correctAnswer: 0, optionContent: "", optionMark: 0 },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [prevQuestionType, setPrevQuestionType] = useState("");

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const questionData = await fetchQuestionById(id);
        console.log("Fetched data:", questionData);

        const question = questionData[0].question;

        setQuestionId(question.questionId);
        setComplexity(question.complexity);
        setContent(question.content);
        setMark(question.mark);
        setQuestionType(question.questionType);

        if (question.subtopic) {
          setSubtopicId(question.subtopic.subtopicId);
          setSubtopic(question.subtopic);
          setSubtopicName(question.subtopic.subtopicName);
          setTopicName(question.subtopic.topic.topicName);
        } else {
          setSubtopicId("");
          setSubtopic({});
          setSubtopicName("");
          setTopicName("");
        }

        setAnswers(questionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchQuestionData();
  }, [id]);

  useEffect(() => {
    setPrevQuestionType(questionType);
  }, [questionType]);

  useEffect(() => {
    if (questionType === "SSQ" && prevQuestionType === "MSQ") {
      setAnswers(answers.map((answer) => ({ ...answer, correctAnswer: 0 })));
    }
  }, [questionType, prevQuestionType, answers]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedAnswer = answers.find((answer) => answer.correctAnswer === 1);
    if (questionType === "SSQ" && !selectedAnswer) {
      toast.error("Please select an answer for SSQ");
      return;
    }

    // Validate question content
    const contentError = validateQuestionContent(content);
    if (contentError) {
      toast.warning(contentError);
      return;
    }

    // Validate MSQ options
    if (questionType === "MSQ") {
      const msqError = validateMSQOptions(answers);
      if (msqError) {
        toast.error(msqError);
        return;
      }
    }

    // Check for duplicate options
    const duplicateError = checkForDuplicateOptions(answers);
    if (duplicateError) {
      toast.error(duplicateError);
      return;
    }

    const updatedQuestion = {
      question: {
        questionId,
        complexity,
        content,
        mark,
        questionType,
        subtopic: {
          subtopicId,
          ...subtopic,
        },
      },
      answer: answers.map((answer) => ({
        optionId: answer.optionId,
        correctAnswer: answer.correctAnswer,
        optionContent: answer.optionContent,
        optionMark: answer.optionMark,
      })),
    };

    console.log("Updated question:", updatedQuestion);

    try {
      const response = await updateQuestion(updatedQuestion);
      console.log(response);
      toast.success("Question updated successfully!", {
        autoClose: 2000,
        onClose: () => {
          navigate("/allKnowledgeQuestions");
        },
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast.warning("Question is already uploaded");
    }
  };

  const handleAnswerChange = (index, event) => {
    const { value } = event.target;
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      optionContent: value,
    };
    setAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index, event) => {
    const checked = event.target.checked;

    let updatedAnswers;

    if (questionType === "SSQ") {
      updatedAnswers = answers.map((answer, idx) => ({
        ...answer,
        correctAnswer: idx === index ? (checked ? 1 : 0) : 0,
      }));

      updatedAnswers = updatedAnswers.map((answer) => ({
        ...answer,
        optionMark: answer.correctAnswer === 1 ? mark : 0,
      }));
    } else {
      updatedAnswers = answers.map((answer, idx) => ({
        ...answer,
        correctAnswer: idx === index ? (checked ? 1 : 0) : answer.correctAnswer,
      }));

      const totalCheckedCount = updatedAnswers.reduce(
        (count, answer) => count + (answer.correctAnswer === 1 ? 1 : 0),
        0
      );

      const perMark = totalCheckedCount > 0 ? mark / totalCheckedCount : 0;

      updatedAnswers = updatedAnswers.map((answer) => ({
        ...answer,
        optionMark: answer.correctAnswer === 1 ? perMark : 0,
      }));
    }

    setAnswers(updatedAnswers);
  };

  const handleAddAnswer = () => {
    if (answers.length >= 8) {
      toast.warning("Maximum 8 options allowed!");
      return;
    }

    const newOption = {
      optionId: 0,
      correctAnswer: 0,
      optionContent: "",
      optionMark: 0,
    };

    setAnswers([...answers, newOption]);
  };

  const handleRemoveAnswer = async (index) => {
    const answerId = answers[index].optionId;

    if (answerId > 0) {
      try {
        const response = await deleteAnswerById(answerId);
        if (response) {
          const updatedAnswers = [...answers];
          updatedAnswers.splice(index, 1);
          setAnswers(updatedAnswers);
          toast.success("Option deleted successfully!");
        } else {
          toast.error("Failed to delete option");
        }
      } catch (error) {
        toast.error("Error deleting option: " + error.message);
      }
    } else {
      const updatedAnswers = [...answers];
      updatedAnswers.splice(index, 1);
      setAnswers(updatedAnswers);
    }
  };

  const handlerCancel = () => {
    navigate("/allknowledgeQuestions");
  };

  return (
    <Container
      id="learning-container"
      style={{ marginTop: "9%", marginBottom: "4%" }}
    >
      <Card sx={{ padding: 4, border: "1px solid #C0C0C0" }}>
        <h4 id="learning-updatesingle-heading">UPDATE KNOWLEDGE QUESTION </h4>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <TextField label="Topic" fullWidth disabled value={topicName} />
            </div>
            <div className="col-md-6">
              <TextField
                label="Subtopic"
                fullWidth
                disabled
                value={subtopicName}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <FormControl fullWidth>
                <InputLabel>Complexity*</InputLabel>
                <Select
                  label="Complexity*"
                  required
                  value={complexity}
                  onChange={(event) => setComplexity(event.target.value)}
                >
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl fullWidth>
                <InputLabel>Question Type*</InputLabel>
                <Select
                  label="Question Type*"
                  required
                  value={questionType}
                  onChange={(event) => setQuestionType(event.target.value)}
                >
                  <MenuItem value="SSQ">
                    SSQ - Single Selection Question
                  </MenuItem>
                  <MenuItem value="MSQ">
                    MSQ - Multiple Selection Question
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-3">
              <Tooltip title="You can update upto 30 Mark Only">
                <TextField
                  label="Mark"
                  fullWidth
                  required
                  type="number"
                  value={mark}
                  inputProps={{ min: 1, max: 30, step: 1 }}
                  onChange={(event) => {
                    const value = Math.min(
                      30,
                      Math.max(1, parseInt(event.target.value, 10))
                    );
                    setMark(value);
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="mb-5">
            <TextField
              label="Content"
              fullWidth
              variant="outlined"
              value={content}
              rows={3}
              multiline
              required
              inputProps={{ maxLength: 300 }}
              onChange={(event) => setContent(event.target.value)}
              helperText={`${300 - content.length} characters remaining`}
            />
          </div>
          {answers.map((answer, index) => (
            <div className="row mb-4" key={index}>
              <div className="col-md-10">
                <TextField
                  label={`Option ${index + 1}`}
                  fullWidth
                  required
                  value={answer.optionContent}
                  onChange={(event) => handleAnswerChange(index, event)}
                />
              </div>
              <div className="col-md-1 d-flex align-items-center">
                {questionType === "SSQ" ? (
                  <Radio
                    checked={answer.correctAnswer === 1}
                    onChange={(event) =>
                      handleCorrectAnswerChange(index, event)
                    }
                  />
                ) : (
                  <Checkbox
                    checked={answer.correctAnswer === 1}
                    onChange={(event) =>
                      handleCorrectAnswerChange(index, event)
                    }
                  />
                )}
              </div>
              <div className="col-md-1 d-flex align-items-center">
                <IconButton onClick={() => handleRemoveAnswer(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end mb-5">
            <Tooltip title="You can add 8 Options">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#27235c", marginRight: "60px" }}
                onClick={handleAddAnswer}
                id="circular-button"
              >
                +
              </Button>
            </Tooltip>
          </div>
          <div className="d-flex justify-content-start">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                marginLeft: 62,
              }}
              onClick={handlerCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                marginLeft: 5,
              }}
            >
              Update
            </Button>
          </div>
        </form>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default SingleQuestionUpdate;
