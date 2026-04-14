import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "../../../styles/admin_module_styles/AdminLearningAssessment/AddLearningAssessmentQuestionAdmin.css";
import AdminNavbar from "../AdminNavbar";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import { getAllTopic, getSubTopicList, getSubTopicQuestionCount, getTopicQuestionCount,} from '../../../services/admin_module_services/AdminLearningAssessmentService';
import AdminHorizontalLinearAlternativeLabelStepper from '../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LevelZeroLearningAssessment from './LevelZeroLearningAssessment';
import LevelThreeLearningAssessment from './LevelThreeLearningAssessment';
import ReplayCircleFilledTwoToneIcon from "@mui/icons-material/ReplayCircleFilledTwoTone";
import { submitModerateAssessment, submitQuickAssessment } from "../../../services/admin_module_services/LearningAssessmentService";


const AddLearningAssessmentQuestionAdmin = () => {
  //Quick Modules States

  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState();

  const assessment = JSON.parse(sessionStorage.getItem("assessment"));
  const assessmentId = assessment.assessmentId;

  const [topicResponse, setTopicResponse] = useState([]);

  const [basicCount, setBasicCount] = useState(0);
  const [intermediateCount, setIntermediateCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountVisible, setTotalCountVisible] = useState(false);
  const [questionPick, setQuestionPick] = useState(false);

  const [inputTotal, setInputTotal] = useState();
  const [totalError, setTotalError] = useState(false);

  const [sliderMax, setSliderMax] = useState(0);

  const [passPercentage, setPassPercentage] = useState();
  const [passPercentageError, setPassPercentageError] = useState(false);

  const [basic, setBasic] = useState(0);
  const [intermediate, setIntermediate] = useState(0);
  const [hard, setHard] = useState(0);

  const [value, setValue] = React.useState("1");

  const activeStep = 3;

  const navigate = useNavigate();

  const [quickAssessment, setQuickAssessment] = useState({
    topicId: 0,
    numberOfQuestion: 0,
    basic: 0,
    intermediate: 0,
    hard: 0,
    passMark: 0,
    assessment: {
      assessmentId: assessmentId,
    },
  });

  const [quickLearningAssessment, setQuickLearningAssessment] = useState({
    type: "Quick Schedule",
    assessment: {
      assessmentId: assessmentId,
    },
  });

  //Moderate Assessment

  const [subTopicList, setSubTopicList] = useState([]);

  const [totalSubTopicCount, setTotalSubTopicCount] = useState(false);

  const getTopics = async () => {
    // await axios.get("http://localhost:8090/cap/learning/topic")
    const response = await getAllTopic().then((response) => {
      setTopic(response.data);
    });
  };

  useEffect(() => {
    getTopics();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    const selectedTopic = topic.find((top) => top.topicId === topicId);
    setSubTopic([]);
    setInputTotal(" ");
    setTotalError(false);
    setSubTopicTotalVisible(false);
    setTopicId(topicId);
    handleTopicCategory(topicId);
    getSubTopicfunction(topicId);
    setQuickAssessment({ ...quickAssessment, topicId: topicId });
    setModerateAssessment({ ...moderateAssessment, topicId: topicId });

    setBasic(0);
    setIntermediate(0);
    setHard(0);
    setModerateInputTotal();
    setModerateTotalError(false);
  };

  const handleTopicCategory = async (id) => {
    // await axios.get(`http://localhost:8090/cap/learning/topicCount/${id}`)
    await getTopicQuestionCount(id).then((response) => {
      setTopicResponse(response.data);
      setBasicCount(response.data.Basic);
      setHardCount(response.data.Hard);
      setIntermediateCount(response.data.Intermediate);
      const total =
        response.data.Basic + response.data.Hard + response.data.Intermediate;
      setTotalCount(total);
      setTotalCountVisible(true);

      if (total > 0) {
        setQuestionPick(true);
      }
    });
  };

  const handleTotalChange = (e) => {
    const inputTotal = e.target.value;

    if (inputTotal <= totalCount) {
      setInputTotal(inputTotal);
      setTotalError(false);
    }
    else{
      setInputTotal(inputTotal);
    }

    if (inputTotal > totalCount || inputTotal === "") {
      setTotalError(true);
    }

    setBasic(0);
    setIntermediate(0);
    setHard(0);

    setSliderMax(Math.min(inputTotal, basicCount));
    setQuickAssessment({ ...quickAssessment, numberOfQuestion: inputTotal });
  };

  const handleBasicChange = (newValue) => {
    if (inputTotal - intermediate - hard >= newValue) {
      setBasic(newValue);
      setQuickAssessment({ ...quickAssessment, basic: newValue });
    }
  };

  const handleIntermediateChange = (newValue) => {
    if (inputTotal - basic - hard >= newValue) {
      setIntermediate(newValue);
      setQuickAssessment({ ...quickAssessment, intermediate: newValue });
    }
  };

  const handleHardChange = (newValue) => {
    if (inputTotal - basic - intermediate >= newValue) {
      setHard(newValue);
      setQuickAssessment({ ...quickAssessment, hard: newValue });
    }
  };

  const handlePercentageChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue < 45 || inputValue > 90) {
      setPassPercentage(inputValue);
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
      setPassPercentage(inputValue);
      setQuickAssessment({ ...quickAssessment, passMark: inputValue });
      setModerateAssessment({ ...moderateAssessment, passMark: inputValue });
    }
  };

  const handleRandomCounts = () => {
    let randomBasic = Math.floor(Math.random() * (basicCount + 1));
    let randomIntermediate = Math.floor(
      Math.random() * (intermediateCount + 1)
    );
    let randomHard = Math.floor(Math.random() * (hardCount + 1));

    let total = randomBasic + randomIntermediate + randomHard;

    if (total === inputTotal) {
      setBasic(randomBasic);
      setIntermediate(randomIntermediate);
      setHard(randomHard);
      return;
    }

    while (total < inputTotal) {
      const randomPick = Math.floor(Math.random() * 3); // 0, 1, or 2

      if (randomPick === 0 && randomBasic < basicCount) {
        randomBasic++;
      } else if (randomPick === 1 && randomIntermediate < intermediateCount) {
        randomIntermediate++;
      } else if (randomPick === 2 && randomHard < hardCount) {
        randomHard++;
      }

      total = randomBasic + randomIntermediate + randomHard;
    }

    while (total > inputTotal) {
      const randomPick = Math.floor(Math.random() * 3); // 0, 1, or 2

      if (randomPick === 0 && randomBasic > 0) {
        randomBasic--;
      } else if (randomPick === 1 && randomIntermediate > 0) {
        randomIntermediate--;
      } else if (randomPick === 2 && randomHard > 0) {
        randomHard--;
      }

      total = randomBasic + randomIntermediate + randomHard;
    }

    setBasic(randomBasic);
    setIntermediate(randomIntermediate);
    setHard(randomHard);

    setQuickAssessment((prevQuickAssessment) => ({
      ...prevQuickAssessment,
      basic: randomBasic,
      intermediate: randomIntermediate,
      hard: randomHard,
    }));
  };

  const generateTotal = (randomBasic, randomIntermediate, randomHard) => {
    const total = randomBasic + randomIntermediate + randomHard;
    return total;
  };

  const handleQuestionSubmit = () => {
    let errorOccurred = false;

    if (!topicId) {
      // Check if topicId is falsy (null, undefined, 0, "", etc.)
      toast("Please Choose the Topic and add Question count");
      errorOccurred = true;
    }

    console.log(inputTotal);

    if (!inputTotal || inputTotal <= 0) {
      if (!errorOccurred) {
        toast("Please add Question Count");
        errorOccurred = true;
      }
    }

    // Validate passPercentage
    if (!passPercentage || passPercentage <= 0 || passPercentage > 100) {
      if (!errorOccurred) {
        toast("Invalid Pass Percentage");
        errorOccurred = true;
      }
    }

    const randomBasic = quickAssessment.basic;
    const randomIntermediate = quickAssessment.intermediate;
    const randomHard = quickAssessment.hard;

    const generatedTotal = generateTotal(
      randomBasic,
      randomIntermediate,
      randomHard
    );

    if (generatedTotal < inputTotal) {
      if (!errorOccurred) {
        toast("Question doesn't match the Total");
        errorOccurred = true;
      }
    }

    if (!errorOccurred) {
      try {
        //axios.post(`http://localhost:8090/cap/admin/quicklearningassessment/${type}`, quickAssessment)
        submitQuickAssessment(quickAssessment).then((response) => {
          sessionStorage.setItem("activeStep", activeStep);
          navigate("/assessmentscheduling");
        });
      } catch (error) {
        console.error(error);
        toast("Unable to post");
      }
    }
  };

  //Moderate Assessment

  const [moderateAssessment, setModerateAssessment] = useState({
    topicId: 0,
    subTopic: [
      {
        subtopicId: 0,
      },
    ],
    passMark: 0,
    assessment: {
      assessmentId: assessmentId,
    },
    numberOfQuestion: 0,
  });

  const [subTopic, setSubTopic] = useState([]);

  const [totalQuestionCount, setTotalQuestionCount] = useState(0);

  const [moderateTotalError, setModerateTotalError] = useState(false);

  const [subTopicId, setSubTopicId] = useState([]);

  const [selectedSubTopic, setSelectedSubTopic] = useState([]);

  const [subTopicTotalVisible, setSubTopicTotalVisible] = useState(false);

  const getSubTopicfunction = async (id) => {
    try {
      // const response = await axios.get(`http://localhost:8090/cap/learning/subtopic/${id}`);
      const response = await getSubTopicList(id);
      const subtopics = response.data;

      // Fetch counts for each subtopic
      const subTopicCounts = await Promise.all(
        subtopics.map(async (subtopic) => {
          // const countResponse = await axios.get(`http://localhost:8090/cap/learning/subtopicCount/${subtopic.subtopicId}`);
          const countResponse = await getSubTopicQuestionCount(
            subtopic.subtopicId
          );
          return {
            ...subtopic,
            questionCount: countResponse.data,
          };
        })
      );

      setSubTopicList(subTopicCounts);
      // const totalQuestions = subTopicCounts.reduce((acc, current) => acc + current.questionCount, 0);
      // setTotalQuestionCount(totalQuestions);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const handleModerateSubtopicCount = async (lastId) => {
    try {
      // const response = await axios.get(`http://localhost:8090/cap/learning/subtopicCount/${lastId}`)
      const response = await getSubTopicQuestionCount(lastId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubTopic = (e) => {
    const names = e.target.value;
    setTotalSubTopicCount(false);

    setSubTopicTotalVisible(true);
    // Update subTopic state with selected names
    setSubTopic(names);

    // Use a set to maintain unique subtopicIds
    const uniqueSubTopicIds = new Set();
    const uniqueSubTopicObjects = []; // Initialize as an empty array
    // Iterate through selected names to find corresponding subtopicIds
    names.forEach((name) => {
      const selectedTopic = subTopicList.find(
        (sub) => sub.subtopicName === name
      );

      if (selectedTopic) {
        // Check if the object is not already in the array
        if (
          !uniqueSubTopicObjects.find(
            (obj) => obj.subtopicId === selectedTopic.subtopicId
          )
        ) {
          uniqueSubTopicObjects.push(selectedTopic);
        }

        uniqueSubTopicIds.add(selectedTopic.subtopicId);
      }
    });

    setSelectedSubTopic(uniqueSubTopicObjects);
    questionCount(uniqueSubTopicObjects);

    // handleModerateSubtopicCount()
    const lastSubTopicId = Array.from(uniqueSubTopicIds).pop();
    handleModerateSubtopicCount(lastSubTopicId);

    // Update moderateAssessment state to include only unique subtopics
    setModerateAssessment((prevState) => ({
      ...prevState,
      subTopic: Array.from(uniqueSubTopicIds).map((id) => ({
        subtopicId: id,
      })),
    }));
  };

  const questionCount = async (updatedSelectedSubTopic) => {
    const subTopicCounts = await Promise.all(
      updatedSelectedSubTopic.map(async (subtopic) => {
        // const countResponse = await axios.get(`http://localhost:8090/cap/learning/subtopicCount/${subtopic.subtopicId}`);
        const countResponse = await getSubTopicQuestionCount(
          subtopic.subtopicId
        );
        return {
          ...subtopic,
          questionCount: countResponse.data,
        };
      })
    );

    const totalQuestions = subTopicCounts.reduce(
      (acc, current) => acc + current.questionCount,
      0
    );
    setTotalQuestionCount(totalQuestions);
  };

  const handleDeleteSubTopic = (subtopicName) => {
    // Remove the subtopic name from subTopic state
    setSubTopic((prevSubTopic) =>
      prevSubTopic.filter((item) => item !== subtopicName)
    );

    const uniqueSubTopicObjects = [];
    // Get the subtopicId to remove
    const subtopicToRemove = subTopicList.find(
      (sub) => sub.subtopicName === subtopicName
    );
    const subTopicIdToRemove = subtopicToRemove
      ? subtopicToRemove.subtopicId
      : null;

    const updatedSelectedSubTopic = selectedSubTopic.filter(
      (sub) => sub !== subtopicToRemove && sub.subtopicId !== subTopicIdToRemove
    );
    questionCount(updatedSelectedSubTopic);

    setSelectedSubTopic(updatedSelectedSubTopic);
    // Remove the corresponding subtopicId from moderateAssessment.subTopic
    setModerateAssessment((prevState) => ({
      ...prevState,
      subTopic: prevState.subTopic.filter(
        (sub) => sub.subtopicId !== subTopicIdToRemove
      ),
    }));
  };

  const [moderateInputTotal, setModerateInputTotal] = useState();

  const handleModerateTotalChange = (e) => {
    const inputTotal = e.target.value;
  
    if (inputTotal <= totalQuestionCount && inputTotal > 0) {
      setModerateInputTotal(inputTotal);
      setModerateAssessment({
        ...moderateAssessment,
        numberOfQuestion: inputTotal,
      });
      setModerateTotalError(false);
    } else {
      setModerateInputTotal(inputTotal); // Update the state even if the input is invalid
      setModerateTotalError(true);
    }
  };

  const handleModeratePost = async () => {

    let errorMessage = "";

    if (!topicId) {
      errorMessage = "Please Choose the Topic and add Question count.";
    } else if (!moderateInputTotal) {
      errorMessage = "Add Number of Question.";
    } else if (!passPercentage) {
      errorMessage = "Add Pass Percentage.";
    } else if (moderateInputTotal > totalQuestionCount) {
      errorMessage = "Check the Selected Questions and Total Count.";
    }

    if (errorMessage) {
      toast(errorMessage);
      return;
    }

    try {
      const response = await submitModerateAssessment(moderateAssessment);
      sessionStorage.setItem("activeStep", activeStep);
      navigate("/assessmentscheduling");
    } catch (error) {
      console.error("Error moderating post:", error);
      toast("Unable to Post");
    }
  };

  return (
    <div className="container-fluid d-flex m-0 p-0">
      <div className="Add_Learning_Assessment_Questions_Admin_Navbar">
        <AdminNavbar />
      </div>
      <div className="Add_Learning_Assessment_Questions_Admin_Tabs_Parent">
        <div className="Add_Learning_Assessment_Questions_Stepper">
          <AdminHorizontalLinearAlternativeLabelStepper />
        </div>
        <div className="Add_Learning_Assessment_Questions_Admin_Tabs" >
          <div>
            <Box className="Add_Learning_Assessment_Questions_Admin_TabBox">
              <TabContext value={value}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example">
                    <Tab label="Level 0" value="1" />
                    <Tab label="Level 1" value="2" />
                    <Tab label="Level 2" value="3" />
                    <Tab label="Level 3" value="4" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <LevelZeroLearningAssessment />

                </TabPanel>
                <TabPanel value="2">
                  <div className="Add_Learning_Assessment_Questions_Admin_topic_fields">
                    <div>
                      <FormControl sx={{ minWidth: 220 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Topic
                        </InputLabel>
                        <Select
                          labelId="topic-label"
                          id="topic-select-small"
                          value={topicId}
                          label="Topic"
                          onChange={handleTopicChange}
                          >
                          {topic.map((top) => (
                            <MenuItem key={top.topicId} value={top.topicId}>
                              {top.topicName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {totalCountVisible
                            ? `${totalCount} Questions Available`
                            : "Choose a Topic"}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div>
                      <TextField
                        label="Total Number of Questions"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        onChange={handleTotalChange}
                        value={inputTotal}
                        error={totalError}
                        helperText={
                          totalError ? "Please choose below " + totalCount : ""
                        }
                      />
                    </div>
                  </div>
                  <div className="Add_Learning_Assessment_Questions_Admin_slider_parent">
                    <div className="Add_Learning_Assessment_Questions_Admin_slider">
                      <Typography id="non-linear-slider" gutterBottom>
                       Basic: {basicCount > 0 ? `${basic} (${basicCount})` : "0"}
                      </Typography>
                      <Slider
                        aria-label="Basic"
                        max={basicCount}
                        value={basic}
                        onChange={(e, newValue) => handleBasicChange(newValue)}
                        valueLabelDisplay="auto"
                      />
                    </div>
                    <div className="Add_Learning_Assessment_Questions_Admin_slider">
                      <Typography id="non-linear-slider" gutterBottom>
                        Intermediate: {intermediateCount > 0 ? `${intermediate} (${intermediateCount})` : "0"}
                      </Typography>
                      <Slider
                        aria-label="Intermediate"
                        max={intermediateCount}
                        value={intermediate}
                        onChange={(e, newValue) =>
                          handleIntermediateChange(newValue)
                        }
                        valueLabelDisplay="auto"
                      />
                    </div>
                    <div className="Add_Learning_Assessment_Questions_Admin_slider">
                      <Typography id="non-linear-slider" gutterBottom>
                        Hard: {hardCount > 0 ? `${hard} (${hardCount})` : "0"}
                      </Typography>
                      <Slider
                        aria-label="Hard"
                        max={hardCount}
                        value={hard}
                        onChange={(e, newValue) => handleHardChange(newValue)}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                  <div className="Add_Learning_Assessment_Questions_Admin_pass_field">
                    <div>
                      <TextField
                        sx={{
                          minWidth: 325,
                          maxWidth: 325,
                        }}
                        required
                        label="Pass Percentage"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        value={passPercentage}
                        onChange={handlePercentageChange}
                        error={passPercentageError}
                        min="45"
                        max="90"
                        helperText={
                          passPercentageError
                            ? "Please choose below percentage between 45 - 90 "
                            : ""
                        }
                      />
                    </div>
                    <div> 
                      <Button
                        variant="contained"
                        title="Generate Random Counts"
                        label="Random Counts"
                        onClick={handleRandomCounts}>
                       
                        Random Counts
                        {/* <AutoAwesomeIcon /> */}
                      </Button>
                    </div>
                  </div>
                  <div className="Add_Learning_Assessment_Questions_Admin_submit">
                    <Button variant="contained" onClick={handleQuestionSubmit}>
                      Next
                    </Button>
                  </div>
                </TabPanel>
                <TabPanel value="3">
                  <div>
                    <div className="Add_Learning_Assessment_Questions_Admin_topics">
                      <FormControl sx={{ minWidth: 220, m: 1 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Topic
                        </InputLabel>
                        <Select
                          labelId="topic-label"
                          id="topic-select-small"
                          value={topicId}
                          label="Topic"
                          onChange={handleTopicChange}
                          sx={{ height: 55 }}>
                          {topic.map((top) => (
                            <MenuItem key={top.topicId} value={top.topicId}>
                              {top.topicName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {totalCountVisible
                            ? `${totalCount} Questions Available`
                            : "Choose a Topic"}
                        </FormHelperText>
                      </FormControl>
                      <FormControl sx={{ width: 500, m: 1 }}>
                        <InputLabel>Select Sub Topics</InputLabel>
                        <Select
                          multiple
                          value={subTopic}
                          onChange={(e) => handleSubTopic(e)}
                          input={<OutlinedInput label="Multiple Select" />}
                          renderValue={(selected) => (
                            <Stack gap={1} direction="row" flexWrap="wrap">
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  onDelete={() => handleDeleteSubTopic(value)}
                                  deleteIcon={
                                    <CancelIcon
                                      onMouseDown={(event) =>
                                        event.stopPropagation()
                                      }
                                    />
                                  }
                                />
                              ))}
                            </Stack>
                          )}>
                          {subTopicList.map((subTopic) => (
                            <MenuItem
                              key={subTopic.subtopicId}
                              value={subTopic.subtopicName}
                              disabled={subTopic.questionCount === 0} // Disable if questionCount is 0
                            >
                              {subTopic.subtopicName} ({subTopic.questionCount})
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {subTopicTotalVisible
                            ? `${totalQuestionCount} Questions Selected`
                            : "Choose a Sub-Topic"}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div className="Add_Learning_Assessment_Questions_Admin_form">
                      <div>
                        <TextField
                          sx={{
                            minWidth: 350,
                            maxWidth: 350,
                            m: 1,
                          }}
                          required
                          label="Total Number of Question"
                          id="outlined-size-small"
                          size="small"
                          type="number"
                          value={moderateInputTotal }
                          onChange={handleModerateTotalChange}
                          autoComplete="off"
                          error={moderateTotalError}
                          disabled={totalQuestionCount === 0}
                          helperText={
                            moderateTotalError
                              ? `Question count shouldn't be greater than ${totalQuestionCount}`
                              : ""
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{
                            minWidth: 350,
                            maxWidth: 350,
                            m: 1,
                          }}
                          required
                          label="Pass Percentage"
                          id="outlined-size-small"
                          size="small"
                          type="number"
                          value={passPercentage}
                          onChange={handlePercentageChange}
                          error={passPercentageError}
                          autoComplete="off"
                          min="45"
                          max="90"
                          helperText={
                            passPercentageError
                              ? "Please choose a percentage between 45 - 90"
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="Add_Learning_Assessment_Questions_Admin_button">
                    <Button variant="contained" onClick={handleModeratePost}>
                      Next
                    </Button>
                  </div>
                </TabPanel>
                <TabPanel value="4">
                  <LevelThreeLearningAssessment />

                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddLearningAssessmentQuestionAdmin;
