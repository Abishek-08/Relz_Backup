import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Radio,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addSingleQuestion,
  addSubTopic,
  addTopic,
  getAllSubTopics,
  getAllTopics,
} from "../../services/learning_assessment_service/AddQuestionService";
import "../../styles/learning_assessment_styles/SingleQuestionUpload.css";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const SingleQuestionUploads = () => {
  // Toast notifications
  const notify = () => toast.success("Question Added Successfully !");
  const notifySelectTopicError = () => toast.error("Topic Required !");
  const notify1 = () => toast.error("Question Already Exist !");
  const optionCount = () => toast.warning("Maximum 8 options allowed!");

  // Toast alerts for adding topics and subtopics
  const addTopicAlert = (e) =>
    toast.success(
      <div>
        Topic <span id="learning-addsingle-tostify">{e}</span> Added
        Successfully
      </div>
    );

  const addTopicAlertError = () =>
    toast.error(
      <div id="learning-addsingle-tostify-errors">Topic Already Exist</div>
    );

  const addSubtopicAlert = (e) =>
    toast.success(
      <div>
        SubTopic <span id="learning-addsingle-tostify">{e}</span> Added
        Successfully
      </div>
    );

  const addSubtopicAlertError = () =>
    toast.error(
      <div id="learning-addsingle-tostify-errors">SubTopic Already Exist</div>
    );

  // State variables
  const [topicName, setTopicName] = useState("");
  const [subTopicName, setSubTopicName] = useState("");
  const [allTopic, setAllTopic] = useState([]);
  const [allSubTopic, setAllSubTopic] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [subTopicId, setSubTopicId] = useState("");
  const [complexity, setComplexity] = useState("");
  const [content, setContent] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [totalMark, setTotalMark] = useState("1");
  const [subTopicDisabled, setSubTopicDisabled] = useState(true);

  // Hook for navigation
  const navigate = useNavigate();

  const specialChars = " !@#$%^&*()_+~`-=[]{},.|\\:;\"'<>";

  const [options, setOptions] = useState([
    { value: "", mark: 0, selected: false },
    { value: "", mark: 0, selected: false },
  ]);

  // Handle option change
  const handleOptionChange = (index, value) => {
    setOptions(
      options.map((option, i) => (i === index ? { ...option, value } : option))
    );
  };
  // Handle mark change for single select questions
  const handleMarkChange = (index, mark) => {
    const updatedOptions = [...options];
    updatedOptions.forEach((option, idx) => {
      if (idx === index) {
        option.mark = mark;
      } else {
        option.mark = 0;
      }
    });
    setOptions(updatedOptions);
  };
  // Handle mark change for multi-select questions
  const handleMarkChange1 = (index, isSelected) => {
    const newOptions = [...options];
    newOptions[index].selected = isSelected;

    const totalSelected = newOptions.filter((option) => option.selected).length;

    if (totalSelected === 1) {
      newOptions.forEach((option) => {
        if (option.selected) {
          option.mark = totalMark;
        } else {
          option.mark = 0;
        }
      });
    } else {
      const markPerOption = totalMark / totalSelected;
      newOptions.forEach((option) => {
        if (option.selected) {
          option.mark = markPerOption;
        } else {
          option.mark = 0;
        }
      });
    }

    setOptions(newOptions);
  };
  // Add a new option if less than 8 options
  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, { value: "", mark: "" }]);
    } else {
      optionCount();
    }
  };

  const [isTopicSelected, setIsTopicSelected] = useState(false);

  // Handle global keydown events for adding topics and subtopics
  const handleGlobalKeyDown = (event) => {
    if (event.ctrlKey && event.key === "m") {
      event.preventDefault();
      if (
        event.target === document.body ||
        event.target === document.documentElement
      ) {
        handleShowTopic();
      }
    }

    if (event.ctrlKey && event.key === "b") {
      event.preventDefault();
      if (
        event.target === document.body ||
        event.target === document.documentElement
      ) {
        if (isTopicSelected) {
          handleShowSubTopic();
        } else {
          toast.warning("Please select a topic before adding a subtopic.");
        }
      }
    }
  };

  // Load topics when the component mounts
  useEffect(() => {
    loadDataForTopic();
    // Add global keydown event listener
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isTopicSelected]);

  // Fetch all topics
  const loadDataForTopic = async () => {
    try {
      const response = await getAllTopics();
      setAllTopic(response.data.map((item) => item));
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  // Fetch subtopics based on the selected topic
  const loadDataForSubTopic = async (topicId) => {
    try {
      const response = await getAllSubTopics(topicId);
      console.log(response.data);
      setAllSubTopic(response.data.map((item) => item));
    } catch (error) {
      console.error("Error loading subtopics:", error);
    }
  };

  // Handle topic submission
  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    const topicData = {
      topicName: topicName,
    };

    // Validate topic name
    const hasTopicMinLength = topicName.length >= 1;

    if (specialChars.includes(topicName) || !hasTopicMinLength) {
      toast.error("Invalid topic name");
      return;
    }

    addTopic(topicData)
      .then((res) => {
        if (res.data === true) {
          addTopicAlert(topicName);
          setShowTopic(false);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
      .catch((error) => {
        addTopicAlertError();
        setShowTopic(false);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      });
  };

  // Handle subtopic submission
  const handleSubTopicSubmit = async (e) => {
    e.preventDefault();
    const subtopicData = {
      subtopicName: subTopicName,
      topic: {
        topicId: topicId,
      },
    };
    // Validate subtopic name
    const hasMinLength = subTopicName.length >= 2;
    if (specialChars.includes(subTopicName) || !hasMinLength) {
      toast.error("Invalid Subtopic name");
      return;
    }

    // Add subtopic and handle response
    addSubTopic(subtopicData)
      .then((res) => {
        if (res.data === true) {
          addSubtopicAlert(subTopicName);
          setShowSubTopic(false);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
      .catch((error) => {
        addSubtopicAlertError();
        setShowSubTopic(false);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      });
  };

  // Handle topic change
  const handleTopicChange = (event) => {
    const topicId = event.target.value;
    setIsTopicSelected(topicId !== "" && topicId !== "addTopic");
    setSubTopicDisabled(false);
    setTopicId(topicId);
    loadDataForSubTopic(topicId);
  };

  // Handle subtopic change
  const handleSubTopicChange = (event) => {
    setSubTopicId(event.target.value);
  };

  // Handle complexity change
  const handleComplexityChange = (event) => {
    setComplexity(event.target.value);
  };

  // Handle option change
  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Handle form submission for adding a question
  const handleSubmit = async (event) => {
    event.preventDefault();

    const checkedCheckboxes = Array.prototype.filter.call(
      document.querySelectorAll('input[type="checkbox"]'),
      (checkbox) => checkbox.checked
    );

    const hasQuestionMinLength = content.length >= 4;

    if (specialChars.includes(content[0]) || !hasQuestionMinLength) {
      toast.warning("Please Enter Right Question Format !");
      return;
    }

    if (checkedCheckboxes.length > 3) {
      toast.warning("Please select Maximum 3 Options");
      return;
    } else if (
      (checkedCheckboxes.length === 0 && questionType === "MSQ") ||
      (checkedCheckboxes.length === 1 && questionType === "MSQ")
    ) {
      toast.warning("Please select Atleast Two Options");
      return;
    }

    const existingOptions = new Set();
    const duplicates = options.filter((option) => {
      const value = option.value.toLowerCase();
      if (existingOptions.has(value)) {
        return true;
      }
      existingOptions.add(value);
      return false;
    });
    if (duplicates.length > 0) {
      toast.warning(
        `Duplicate options detected: ${duplicates.map((option) => option.value).join(", ")}`
      );
      return;
    }
    // Create question data
    const questionData = {
      question: {
        complexity: complexity,
        content: content,
        mark: parseFloat(totalMark),
        questionType: questionType,
        subtopic: {
          subtopicId: subTopicId,
          topic: {
            topicId: topicId,
          },
        },
      },
      answer: options.map((option) => ({
        optionContent: option.value,
        optionMark: parseFloat(option.mark),
      })),
    };
    // Add question and handle response
    addSingleQuestion(questionData)
      .then((res) => {
        if (res.data === true) {
          notify();
          setTimeout(() => {
            navigate("/allknowledgeQuestions");
          }, 5000);
        }
      })
      .catch((error) => {
        notify1();
      });
  };
  // Show topic modal
  const [showTopic, setShowTopic] = useState(false);

  const handleCloseTopic = () => setShowTopic(false);
  const handleShowTopic = () => setShowTopic(true);

  // Show subtopic modal
  const [showSubTopic, setShowSubTopic] = useState(false);

  const handleCloseSubTopic = () => setShowSubTopic(false);
  const handleShowSubTopic = () => setShowSubTopic(true);

  return (
    <div style={{ marginBottom: "80px" }}>
      {/* Modals for adding topic and subtopic */}
      <div>
        <ToastContainer />
        <Modal
          show={showTopic}
          onHide={handleCloseTopic}
          backdrop="static"
          keyboard={false}
          centered
          id="learning-addTopic-subtopic-model"
        >
          <Modal.Header>
            <Modal.Title style={{ fontWeight: "bold", color: "#25235c" }}>
              Add Topic
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={handleTopicSubmit}>
              <div className="form-group">
                <TextField
                  style={{ marginLeft: "", width: "100%" }}
                  id="filled-search"
                  label="Enter Topic"
                  type="search"
                  required
                  onChange={(e) => setTopicName(e.target.value)}
                />
              </div>

              <br></br>
              <Button
                variant="secondary"
                style={{ marginLeft: "5%" }}
                onClick={handleCloseTopic}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ marginLeft: "28%" }}
                id="learning-addSinglequestion-topicmodel-addbtn"
              >
                Add +
              </Button>
            </form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showSubTopic}
          onHide={handleCloseSubTopic}
          centered
          backdrop="static"
          id="learning-addTopic-subtopic-model"
        >
          <Modal.Header>
            <Modal.Title style={{ fontWeight: "bold", color: "#25235c" }}>
              Add Subtopic
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubTopicSubmit}>
              <div className="form-group">
                <TextField
                  style={{ marginLeft: "", width: "100%" }}
                  id="filled-search"
                  label="Enter SubTopic"
                  type="search"
                  required
                  onChange={(e) => setSubTopicName(e.target.value)}
                />
              </div>

              <br></br>

              <Button
                variant="secondary"
                style={{ marginLeft: "5%" }}
                onClick={handleCloseSubTopic}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: "28%" }}
                id="learning-addSinglequestion-topicmodel-addbtn"
              >
                Add +
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      <div id="learning-addsingle-maincontainer">
        <div>
          <h4 id="learning-addsingle-heading">ADD KNOWLEDGE QUESTION </h4>
          {/* Form for adding a question */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <FormControl
                      id=""
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      <InputLabel id="">Select Topic</InputLabel>
                      <Select
                        labelId=""
                        id=""
                        value={topicId}
                        onChange={(event) => {
                          if (event.target.value !== "addTopic") {
                            handleTopicChange(event);
                          }
                        }}
                        label="Select Topic 1"
                        required
                      >
                        <MenuItem
                          value="addTopic"
                          onClick={() => handleShowTopic(true)}
                          id="learning-addquestion-addtopic-subtopic-dropdown"
                        >
                          + Add Topic
                        </MenuItem>
                        {allTopic.map((topic, index) => (
                          <MenuItem key={index} value={topic.topicId}>
                            {topic.topicName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <b>Note:</b> Press{" "}
                    <label style={{ color: "#25235c", fontWeight: "bold" }}>
                      "Ctrl+m"{" "}
                    </label>{" "}
                    to add Topic
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <InputLabel id="">Select SubTopic</InputLabel>
                      <Select
                        labelId=""
                        id=""
                        value={subTopicId}
                        onChange={(event) => {
                          if (event.target.value !== "addLanguage") {
                            handleSubTopicChange(event);
                          }
                        }}
                        label="Select Topic 2"
                        required
                        disabled={subTopicDisabled}
                      >
                        <MenuItem
                          value="addLanguage"
                          onClick={() => handleShowSubTopic()}
                          id="learning-addquestion-addtopic-subtopic-dropdown"
                        >
                          + Add SubTopic
                        </MenuItem>
                        {allSubTopic.map((topic, index) => (
                          <MenuItem key={index} value={topic.subtopicId}>
                            {topic.subtopicName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <b> Note:</b> Press{" "}
                    <label style={{ color: "#25235c", fontWeight: "bold" }}>
                      "Ctrl+b"{" "}
                    </label>{" "}
                    to add SubTopic
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <InputLabel id="">Complexity</InputLabel>
                      <Select
                        labelId=""
                        id=""
                        label="Select Topic 1"
                        value={complexity}
                        onChange={handleComplexityChange}
                        required
                      >
                        <MenuItem value={"Basic"}>Basic</MenuItem>
                        <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                        <MenuItem value={"Hard"}>Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <InputLabel id="">Question type</InputLabel>
                      <Select
                        labelId=""
                        id=""
                        value={questionType}
                        onChange={(event) =>
                          setQuestionType(event.target.value)
                        }
                        label="Select Topic 2"
                        required
                      >
                        <MenuItem value={"SSQ"}>
                          SSQ - Single Select Question
                        </MenuItem>
                        <MenuItem value={"MSQ"}>
                          MSQ - Multi Select Question
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <Tooltip title="Max 30 Marks" placement="top">
                        <TextField
                          id="outlined-read-only-input"
                          label="Question Mark"
                          value={totalMark}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 1 && value <= 30) {
                              setTotalMark(value);
                            } else {
                              setTotalMark("");
                            }
                          }}
                          inputProps={{
                            min: 1,
                            max: 30,
                            type: "number",
                          }}
                        />
                      </Tooltip>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="Question Content"
                  color="primary"
                  placeholder="Add Question here"
                  erorText="Please enter only 12 digits number"
                  inputProps={{ maxLength: 300 }}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <span style={{ color: "#25235c" }}>
                  {300 - content.length} characters remaining
                </span>
              </Grid>
            </Grid>

            <h5 id="learning-addquestion-addoptions">Add Options</h5>

            <Grid container sx={{ mb: 3 }}>
              <Grid item xs={12}>
                {options.map((option, index) => (
                  <Grid
                    container
                    spacing={3}
                    sx={{ mb: 3 }}
                    key={index}
                    alignItems="center"
                  >
                    <Grid item xs={10}>
                      <TextField
                        label={`Enter Option ${index + 1}`}
                        required
                        value={option.value}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>

                    {questionType && (
                      <Grid item xs={1}>
                        <div id="learning-addsingle-radio">
                          {questionType === "SSQ" ? (
                            <Radio
                              required
                              type="radio"
                              name="ssqOption"
                              value={totalMark}
                              checked={options[index].mark === totalMark}
                              onChange={(e) =>
                                handleMarkChange(
                                  index,
                                  e.target.checked ? totalMark : 0
                                )
                              }
                            />
                          ) : (
                            <Checkbox
                              placeholder="Enter Option Mark"
                              value={options[index].mark}
                              onInput={(e) => {
                                if (e.target.value < 0) {
                                  e.target.value = 0;
                                }
                              }}
                              onChange={(e) =>
                                handleMarkChange1(index, e.target.checked)
                              }
                            />
                          )}
                        </div>
                      </Grid>
                    )}

                    {index > 1 && (
                      <Grid item xs={1} style={{ textAlign: "right" }}>
                        <Tooltip title="Remove Options" placement="top">
                          <IconButton
                            color="secondary"
                            aria-label="delete option"
                            component="span"
                            onClick={() => handleDeleteOption(index)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Tooltip
              title="Max 8 Options"
              placement="top"
              className="Learning-assessment-tooltips"
            >
              <button
                type="button"
                id="learning-addOption-btn"
                onClick={handleAddOption}
              >
                +
              </button>
            </Tooltip>

            <Button type="submit" id="learning-submit-btn">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingleQuestionUploads;
