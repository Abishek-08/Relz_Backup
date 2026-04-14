import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate } from "react-router-dom";
import {
  addLevelThreeLearningAssessment,
  getAllTopic,
  getComplexityCount,
  getSubTopicList,
  getSubTopicQuestionCount,
  getTopicQuestionCount,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import { Card, CardHeader } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {
  L3AssessmentAction,
  L3AssessmentSubDataAction,
} from "../../../redux/actions/admin_module_actions/LearningAssessmentCreationAction";
import Tooltip from '@mui/material/Tooltip';


/**
 * @author ranjitha.rajaram
 * @version 4.0
 * @since 18-07-2024
 */

const Tooltiper = ({ children, text, isVisible }) => (
  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
    {children}
    {isVisible && (
      <div style={{
        position: 'absolute',
        bottom: 'calc(100% + 10px)', // Adjusted to create some space between Tooltiper and element
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        zIndex: 1000,
        whiteSpace: 'pre', // Prevents text from wrapping
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        fontSize: '14px',
        maxWidth: '475px', // Set a max-width to prevent very long Tooltipers
        textAlign: 'center',
      }}>
        {text}
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '5px',
          borderStyle: 'solid',
          borderColor: '#333 transparent transparent transparent',
        }}></div>
      </div>
    )}
  </div>
);

const LevelThreeLearningAssessmentRedux = () => {
  //Redux
  const L3AssessmentReduxData = useSelector(
    (state) => state.learningCreationTabNumber.L3Data
  );

  const L3SubAssessmentReduxData = useSelector(
    (state) => state.learningCreationTabNumber.L3SubData
  );

  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState(
    L3SubAssessmentReduxData.topicId === 0
      ? 0
      : L3SubAssessmentReduxData.topicId
  );
  const [tempSubTopic, setTempSubTopic] = useState(
    L3SubAssessmentReduxData.tempSubTopic === ""
      ? ""
      : L3SubAssessmentReduxData.tempSubTopic
  );
  const [subTopic, setSubTopic] = useState("");
  const [inputTotal, setInputTotal] = useState(
    L3AssessmentReduxData.totalNumberOfQuestions === 0
      ? 0
      : L3AssessmentReduxData.totalNumberOfQuestions
  );
  const [subInputTotal, setSubInputTotal] = useState(
    L3SubAssessmentReduxData.subInputTotal === ""
      ? ""
      : L3SubAssessmentReduxData.subInputTotal
  );
  const [totalError, setTotalError] = useState(false);
  const [subTotalError, setSubTotalError] = useState(false);
  const [basic, setBasic] = useState(0);
  const [intermediate, setIntermediate] = useState(0);
  const [hard, setHard] = useState(0);
  const [basicCount, setBasicCount] = useState(0);
  const [intermediateCount, setIntermediateCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [subTopicList, setSubTopicList] = useState(
    L3SubAssessmentReduxData.subTopicList.length === 0
      ? []
      : L3SubAssessmentReduxData.subTopicList
  );
  const [subTopicTotal, setSubTopicTotal] = useState(0);
  const [subTopicTotalVisible, setSubTopicTotalVisible] = useState(false);
  const [passPercentage, setPassPercentage] = useState(
    L3AssessmentReduxData.passMarks === 0 ? "" : L3AssessmentReduxData.passMarks
  );
  const [passPercentageError, setPassPercentageError] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [questionDatas, setQuestionDatas] = useState(
    L3AssessmentReduxData.chosenQuestions.length === 0
      ? []
      : L3AssessmentReduxData.chosenQuestions
  );

  const [totalCount, setTotalCount] = useState(
    L3SubAssessmentReduxData.totalCount === 0
      ? 0
      : L3SubAssessmentReduxData.totalCount
  );
  const [totalCountVisible, setTotalCountVisible] = useState(
    L3SubAssessmentReduxData.totalCount === 0 ? false : true
  );
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(
    L3SubAssessmentReduxData.selectedQuestionCount === 0
      ? 0
      : L3SubAssessmentReduxData.selectedQuestionCount
  );

  const [topicList, setTopicList] = useState([]);
  const [allSubTopics, setAllSubTopics] = useState(
    L3SubAssessmentReduxData.allSubTopics.length === 0
      ? []
      : L3SubAssessmentReduxData.allSubTopics
  );
  const [subTopicCount, setSubTopiccount] = useState("");
  const [totalTopicCount, setTotalTopicCount] = useState(
    L3SubAssessmentReduxData.totalTopicCount === 0
      ? 0
      : L3SubAssessmentReduxData.totalTopicCount
  );
  const [totalTopicCountVisible, setTotalTopicCountVisible] = useState(false);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const activeStep = 3;

  const [topicName, setTopicName] = useState(
    L3SubAssessmentReduxData.topicName === ""
      ? null
      : L3SubAssessmentReduxData.topicName
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // New state for the tour
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const tourSteps = [
    { id: 'topic', text: 'Select a topic for the assessment. Available questions will be shown.' },
    { id: 'questionCount', text: 'Enter the number of questions. Cannot exceed the available questions.' },
    { id: 'subTopic', text: 'Choose a SubTopic' },
    { id: 'subTopicTotal', text: 'Enter Total Number of Questions required in sub topic.' },
    { id: 'complexity', text: 'Select Total Number of Questions requires on the complexity.' },
    { id: 'random', text: 'Else Click to Randomly generate and assign count' },
    { id: 'addQuestion', text: 'Click to add Questions.' },
    { id: 'pass', text: 'Set the pass percentage (45-90%).' },
    { id: 'submit', text: 'Click to proceed to the next step of creating the assessment.' },
    { id: 'previouStep', text: 'Click to rollback to the previous step of creating the assessment.' },
  ];

  useEffect(() => {
    fetchTopicData();
  }, []);

  const fetchTopicData = async () => {
    try {
      const response = await getAllTopic();
      setTopic(response.data);
    } catch (error) {
      console.error("Error fetching topic data:", error);
    }
  };

  console.log("topicId ", topicId);
  console.log("inputTotal ", inputTotal);
  console.log("tempSubTopic ", tempSubTopic);
  console.log("subInputTotal ", subInputTotal);

  useEffect(() => {
    if (
      topicId &&
      inputTotal &&
      (tempSubTopic || subTopic) &&
      subInputTotal &&
      (basic > 0 || intermediate > 0 || hard > 0)
    ) {
      setIsAddButtonEnabled(true);
    } else {
      setIsAddButtonEnabled(false);
    }
  }, [
    topicId,
    inputTotal,
    tempSubTopic,
    subTopic,
    subInputTotal,
    basic,
    intermediate,
    hard,
  ]);

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    const selectedTopic = topic.find((data) => data.topicId === topicId);
    setTopicName(selectedTopic.topicName);
    setTopicId(topicId);
    await handleTopicCategory(topicId);
    await getSubTopicfunction(topicId);
    setQuestionDatas([]);
    setTableVisible(false);
    setInputTotal("");
    setSelectedQuestionCount(0);
    setPassPercentage("");
    setBasic(0);
    setIntermediate(0);
    setHard(0);
  };

  const handleTopicCategory = async (id) => {
    try {
      const response = await getTopicQuestionCount(id);
      const total =
        response.data.Basic + response.data.Hard + response.data.Intermediate;
      setTotalCount(total);
      setTotalCountVisible(true);
      const totalTopicResponse = await getTopicQuestionCount(id);
      const totalTopic =
        totalTopicResponse.data.Basic +
        totalTopicResponse.data.Hard +
        totalTopicResponse.data.Intermediate;
      setTotalTopicCount(totalTopic);
      setTotalTopicCountVisible(true);
    } catch (error) {
      console.error("Error fetching topic category:", error);
    }
  };

  const getSubTopicfunction = async (id) => {
    try {
      const response = await getSubTopicList(id);
      const subtopics = response.data;
      setSubTopicList(subtopics);
      setAllSubTopics(subtopics);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const handleSubTopicChange = async (e) => {
    const selectedSubTopic = e.target.value;
    setSubTopic(selectedSubTopic);
    setTempSubTopic(selectedSubTopic);
    setSubInputTotal('')
    const subTopicObj = subTopicList.find(
      (subtopic) => subtopic.subtopicName === selectedSubTopic
    );
    if (subTopicObj) {
      try {
        const countResponse = await getComplexityCount(
          parseInt(subTopicObj.subtopicId)
        );
        setBasicCount(countResponse.data.Basic);
        setIntermediateCount(countResponse.data.Intermediate);
        setHardCount(countResponse.data.Hard);
        setSubTopicTotal(
          countResponse.data.Basic +
          countResponse.data.Intermediate +
          countResponse.data.Hard
        );
        setSubTopiccount(
          countResponse.data.Basic +
          countResponse.data.Intermediate +
          countResponse.data.Hard
        );
        setSubTopicTotalVisible(true);
      } catch (error) {
        console.error("Error fetching subtopic complexity count:", error);
      }
    } else {
      setBasicCount(0);
      setIntermediateCount(0);
      setHardCount(0);
      setSubTopicTotal(0);
      setSubTopicTotalVisible(false);
    }

    setBasic(0);
    setIntermediate(0);
    setHard(0);
    console.log("Selected subtopic:", selectedSubTopic);
    console.log("Subtopic object:", subTopicObj);
  };

  const handleTotalChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > totalCount) {
      setInputTotal(totalCount);
      setTotalError(true);
    } else if (value < 1) {
      setTotalError(true);
    } else {
      setInputTotal(value);
      setTotalError(false);
    }
  };

  const handleSubTopicTotalChange = (e) => {
    const value = parseInt(e.target.value);
    const currentTotal = questionDatas.reduce(
      (acc, data) =>
        acc + data.basicCount + data.intermediateCount + data.hardCount,
      0
    );
    const newTotal = currentTotal + value;

    if (newTotal > inputTotal) {
      setSubInputTotal(inputTotal - currentTotal);
      setSubTotalError(true);
    } else if (value < 1) {
      setSubTotalError(true);
    } else if (value > subTopicCount) {
      setSubTotalError(true);
    } else {
      setSubInputTotal(value);
      setSubTotalError(false);
    }
  };

  const handleBasicChange = (newValue) => {
    setBasic(newValue);
  };

  const handleIntermediateChange = (newValue) => {
    setIntermediate(newValue);
  };

  const handleHardChange = (newValue) => {
    setHard(newValue);
  };

  const handleRandomCounts = () => {
    let randomBasic = 0;
    let randomIntermediate = 0;
    let randomHard = 0;

    let total = 0;

    while (total < subInputTotal && total < subTopicCount) {
      const randomPick = Math.floor(Math.random() * 3);

      if (
        randomPick === 0 &&
        randomBasic < basicCount &&
        total + 1 <= subInputTotal
      ) {
        randomBasic++;
      } else if (
        randomPick === 1 &&
        randomIntermediate < intermediateCount &&
        total + 1 <= subInputTotal
      ) {
        randomIntermediate++;
      } else if (
        randomPick === 2 &&
        randomHard < hardCount &&
        total + 1 <= subInputTotal
      ) {
        randomHard++;
      }

      total = randomBasic + randomIntermediate + randomHard;
    }

    setBasic(randomBasic);
    setIntermediate(randomIntermediate);
    setHard(randomHard);
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    if (value < 45 || value > 100) {
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
    }
    setPassPercentage(value);
  };

  const handleAddQuestions = async () => {
    setSubInputTotal("");
    const selectedSubTopic = subTopicList.find(
      (subtopic) => subtopic.subtopicName === subTopic
    );

    if (!selectedSubTopic) {
      toast.error("Selected subtopic is invalid.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const subTopicObj = {
      subtopicId: selectedSubTopic.subtopicId,
      subtopicName: selectedSubTopic.subtopicName,
    };
    const totalNewQuestions = basic + intermediate + hard;
    if (totalNewQuestions > subTopicCount) {
      toast.error(
        "Required question count exceeds available questions in this subtopic.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      return;
    }
    const existingQuestion = questionDatas.find(
      (data) =>
        data.subtopicId === subTopicObj.subtopicId && data.topicId === topicId
    );

    if (existingQuestion) {
      const totalExisting =
        existingQuestion.basicCount +
        existingQuestion.intermediateCount +
        existingQuestion.hardCount;
      const totalCountAfterAdding = totalExisting + totalNewQuestions;

      if (totalCountAfterAdding > subTopicCount) {
        toast.error(
          "Total count of questions exceeds available questions for the selected subtopic.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
        return;
      }
    }
    const selectedTopic = topic.find((top) => top.topicId === topicId);

    const newData = {
      topicId: selectedTopic?.topicId || null,
      subtopicId: subTopicObj.subtopicId || null,
      basicCount: basic,
      intermediateCount: intermediate,
      hardCount: hard,
    };

    setQuestionDatas([...questionDatas, newData]);
    setTableVisible(true);

    setTotalCount(totalCount - totalNewQuestions);

    setSelectedQuestionCount(selectedQuestionCount + totalNewQuestions);

    console.log(subTopicCount - totalNewQuestions);
    setSubTopiccount(subTopicCount - totalNewQuestions);
    setSubTopicTotal(subTopicTotal - totalNewQuestions);
    setSubTopicTotalVisible(true);

    setPassPercentageError(false);
    setSubTopic("");
    setSubTopicTotal(0);
    setSubTopicTotalVisible(false);
    setTotalError(false);
    setBasic(0);
    setIntermediate(0);
    setHard(0);
  };
  useEffect(() => {
    console.log("SubTopicTotal updated:", subTopicTotal);
  }, [subTopicTotal]);

  const handleRemoveQuestion = (index) => {
    const removedQuestion = questionDatas[index];
    const updatedQuestionDatas = questionDatas.filter((_, i) => i !== index);
    setQuestionDatas(updatedQuestionDatas);
    const updatedSubTopicList = [...subTopicList];
    const subTopicObj = updatedSubTopicList.find(
      (subtopic) => subtopic.subtopicId === removedQuestion.subtopicId
    );

    if (subTopicObj) {
    } else {
      updatedSubTopicList.push({
        subtopicId: removedQuestion.subtopicId,
        subtopicName: removedQuestion.subtopicName,
      });
    }
    setSubTopicList(updatedSubTopicList);
    const totalRemovedQuestions =
      removedQuestion.basicCount +
      removedQuestion.intermediateCount +
      removedQuestion.hardCount;
    setSelectedQuestionCount(selectedQuestionCount - totalRemovedQuestions);

    setTotalCount(totalCount + totalRemovedQuestions);

    setBasicCount(basicCount + removedQuestion.basicCount);
    setIntermediateCount(intermediateCount + removedQuestion.intermediateCount);
    setHardCount(hardCount + removedQuestion.hardCount);
  };

  const handleNextButtonClick = async (e) => {
    const totalQuestions = questionDatas.reduce(
      (acc, data) =>
        acc + data.basicCount + data.intermediateCount + data.hardCount,
      0
    );
    if (inputTotal !== totalQuestions) {
      setTotalError(true);
      return;
    }
    if (!passPercentage) {
      setPassPercentageError(true);
      return;
    }
    try {
      const assessment = JSON.parse(sessionStorage.getItem("assessment"));
      const assessmentId = assessment?.assessmentId;
      const payload = {
        totalNumberOfQuestions: parseInt(inputTotal),
        passMarks: parseInt(passPercentage),
        chosenQuestions: questionDatas.map((question) => ({
          topicId: question.topicId,
          subtopicId: question.subtopicId,
          basicCount: question.basicCount,
          intermediateCount: question.intermediateCount,
          hardCount: question.hardCount,
        })),
        assessment: {
          assessmentId: 0,
        },
      };
      console.log(payload);

      dispatch(L3AssessmentAction(payload));
      //await addLevelThreeLearningAssessment(payload);
      const subData = {
        topicId,
        topicName,
        tempSubTopic,
        subInputTotal,
        totalTopicCount,
        totalCount,
        selectedQuestionCount,
        subTopicList,
        subInputTotal,
        allSubTopics,
      };
      dispatch(L3AssessmentSubDataAction(subData));

      sessionStorage.setItem("activeStep", activeStep);
      //setQuestionDatas([]);
      //setTableVisible(false);
      navigate("/feedbackform");
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handlePrevious = () => {
    sessionStorage.setItem("activeStep", 1);
    const assessment = JSON.parse(sessionStorage.getItem("assessment"));
    const assessmentId = assessment?.assessmentId;
    const payload = {
      totalNumberOfQuestions: parseInt(inputTotal),
      passMarks: parseInt(passPercentage),
      chosenQuestions: questionDatas.map((question) => ({
        topicId: question.topicId,
        subtopicId: question.subtopicId,
        basicCount: question.basicCount,
        intermediateCount: question.intermediateCount,
        hardCount: question.hardCount,
      })),
      assessment: {
        assessmentId: assessmentId,
      },
    };
    const subData = {
      topicId,
      topicName,
      tempSubTopic,
      subInputTotal,
      totalTopicCount,
      totalCount,
      selectedQuestionCount,
      subTopicList,
      subInputTotal,
      allSubTopics,
    };
    console.log(payload);
    dispatch(L3AssessmentAction(payload));
    dispatch(L3AssessmentSubDataAction(subData));
    navigate("/proctorstep");
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTourActive(false);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
  };

  return (
    <div>
      <div id="Add_Learning_Assessment_Questions_Admin_topic_fields1">
        <Grid container sx={{ width: "100%", height: "500%" }} spacing={2}>
          <Grid container sx={{ width: "100%" }} spacing={2}>
            <Grid item sm={6} xs={5}>
              <Tooltiper text={tourSteps[0].text} isVisible={isTourActive && currentStep === 0}>
                <FormControl fullWidth size="small">
                  <InputLabel id="topic-label">Topic</InputLabel>
                  <Select
                    labelId="topic-label"
                    id="topic-select-small"
                    defaultValue={topicName}
                    renderValue={() => topicName}
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
                    Total Questions in Topic: {totalTopicCount}
                  </FormHelperText>

                  {totalCountVisible && (
                    <FormHelperText>
                      Remaining Questions in Topic: {totalCount}
                    </FormHelperText>
                  )}
                </FormControl>
              </Tooltiper>
            </Grid>
            <Grid item sm={6} xs={5} style={{ display: "flex", justifyContent: "space-evenly", }}>
              <div>
                <Tooltiper text={tourSteps[1].text} isVisible={isTourActive && currentStep === 1}>
                  <TextField
                    label="Total Questions"
                    id="outlined-size-small"
                    size="small"
                    defaultValue={inputTotal || ''}
                    onChange={handleTotalChange}
                    sx={{ minWidth: 360, maxWidth: 150 }}
                    error={totalError}
                    helperText={totalError ? "Invalid total questions" : ""}
                    InputProps={{
                      inputProps: {
                        min: 1, // Optional, but you mentioned a range
                        max: 10, // Optional, but you mentioned a range
                        step: null, // This disables the arrows
                      },
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <FormHelperText>
                    Selected Questions: {selectedQuestionCount || 0} {""} {"||"}{" "}
                    Remaining Question to Select:{" "}
                    {(inputTotal || 0) - (selectedQuestionCount || 0)}
                  </FormHelperText>
                </Tooltiper>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <Tooltip title="Guide Tour">
                  <HelpCenterIcon sx={{
                    transition: 'transform 0.2s', // add transition effect
                    '&:hover': {
                      cursor: 'pointer',
                      transform: 'scale(1.1)', // scale up on hover
                    },
                  }} onClick={() => setIsTourActive(true)} />
                </Tooltip>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{ width: "100%" }}
            spacing={2}
            style={{ marginTop: "25px" }}
          >
            <Grid item sm={6} xs={6}>
              <Tooltiper text={tourSteps[2].text} isVisible={isTourActive && currentStep === 2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="subtopic-label">Subtopic</InputLabel>
                  <Select
                    labelId="subtopic-label"
                    id="subtopic-select-small"
                    value={subTopic || ""}
                    label="Subtopic"
                    onChange={handleSubTopicChange}
                    disabled={!subTopicList.length}
                  >
                    {subTopicList.map((subtopic) => (
                      <MenuItem
                        key={subtopic.subtopicId}
                        value={subtopic.subtopicName}
                      >
                        {subtopic.subtopicName}
                      </MenuItem>
                    ))}
                  </Select>
                  {subTopicTotalVisible && (
                    <FormHelperText>
                      {subTopicTotal} Questions Available
                    </FormHelperText>
                  )}
                </FormControl>
              </Tooltiper>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <Tooltiper text={tourSteps[3].text} isVisible={isTourActive && currentStep === 3}>
                  <TextField
                    label="Total subtopic Questions"
                    id="outlined-size-small"
                    size="small"
                    value={subInputTotal || ''}
                    onChange={handleSubTopicTotalChange}
                    sx={{ minWidth: 360, maxWidth: 150 }}
                    error={subTotalError}
                    helperText={
                      subTotalError
                        ? "Total questions exceed available count for this subtopic."
                        : ""
                    }
                    InputProps={{
                      inputProps: {
                        min: 1, // Optional, but you mentioned a range
                        max: 10, // Optional, but you mentioned a range
                        step: null, // This disables the arrows
                      },
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Tooltiper>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
        </Grid>
      </div>
      <div className="Add_Learning_Assessment_Questions_Admin_slider_parent">
        <Tooltiper text={tourSteps[4].text} isVisible={isTourActive && currentStep === 4}>
          <Grid container sx={{ width: "100%" }} spacing={1}>
            <Grid item xs={12} sm={4}>
              <div className="Add_Learning_Assessment_Questions_Admin_slider">
                <Typography gutterBottom>
                  Basic: {basicCount > 0 ? `${basic} (${basicCount})` : "0"}
                </Typography>
                <Slider
                  aria-label="Basic"
                  max={Math.min(basicCount, subTopicTotal)}
                  value={basic}
                  onChange={(e, newValue) => handleBasicChange(newValue)}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="Add_Learning_Assessment_Questions_Admin_slider">
                <Typography gutterBottom>
                  Intermediate:{" "}
                  {intermediateCount > 0
                    ? `${intermediate} (${intermediateCount})`
                    : "0"}
                </Typography>
                <Slider
                  aria-label="Intermediate"
                  max={Math.min(intermediateCount, subTopicTotal)}
                  value={intermediate}
                  onChange={(e, newValue) => handleIntermediateChange(newValue)}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="Add_Learning_Assessment_Questions_Admin_slider">
                <Typography gutterBottom>
                  Hard: {hardCount > 0 ? `${hard} (${hardCount})` : "0"}
                </Typography>
                <Slider
                  aria-label="Hard"
                  max={Math.min(hardCount, subTopicTotal)}
                  value={hard}
                  onChange={(e, newValue) => handleHardChange(newValue)}
                  valueLabelDisplay="auto"
                />
              </div>
            </Grid>
          </Grid>
        </Tooltiper>
      </div>
      <div className="Add_Learning_Assessment_Questions_Admin_pass_field">
        <Tooltiper text={tourSteps[5].text} isVisible={isTourActive && currentStep === 5}>
          <Button
            variant="contained"
            title="Generate Random Counts"
            onClick={handleRandomCounts}
          >
            Random Counts
            <RefreshOutlinedIcon />
          </Button>
        </Tooltiper>

        <Tooltiper text={tourSteps[6].text} isVisible={isTourActive && currentStep === 6}>
          <Button
            variant="contained"
            onClick={handleAddQuestions}
            startIcon={<QuizIcon />}
            disabled={!isAddButtonEnabled}
          >
            ADD QUESTIONS
          </Button>
        </Tooltiper>

        <Tooltiper text={tourSteps[7].text} isVisible={isTourActive && currentStep === 7}>
          <TextField
            sx={{
              minWidth: 325,
              maxWidth: 325,
            }}
            required
            label="Pass Percentage"
            id="outlined-size-small"
            size="small"
            value={passPercentage || ""}
            onChange={handlePercentageChange}
            error={passPercentageError}
            inputProps={{
              min: 45,
              max: 100,
            }}
            helperText={
              passPercentageError
                ? "Please choose a percentage between 45 - 100"
                : (passPercentageError && passPercentage < 45) ||
                  passPercentage > 100
                  ? "Please choose a percentage between 45 - 100"
                  : ""
            }
          />
        </Tooltiper>
      </div>
      <br />
      <br />
      {questionDatas.length !== 0 && (
        <div>
          <Grid container spacing={2}>
            {questionDatas.map((question, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={8}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar>
                        <QuizIcon />
                      </Avatar>
                    }
                    action={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    title={`${topic.find((topic) => topic.topicId === question.topicId)
                      ?.topicName
                      } - ${allSubTopics.find(
                        (subtopic) =>
                          subtopic.subtopicId === question.subtopicId
                      )?.subtopicName
                      }`}
                    subheader={`Basic: ${question.basicCount}, Intermediate: ${question.intermediateCount}, Hard: ${question.hardCount}`}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div className="Add_Learning_Assessment_Questions_Admin_submit">
          <Tooltiper text={tourSteps[9].text} isVisible={isTourActive && currentStep === 9}>
            <Button
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#97247e",
                },
              }}
              variant="contained"
              onClick={handlePrevious}
            >
              Back
            </Button>
          </Tooltiper>
        </div>
        <div className="Add_Learning_Assessment_Questions_Admin_submit">
          <Tooltiper text={tourSteps[8].text} isVisible={isTourActive && currentStep === 8}>
            <Button
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#97247e",
                },
              }}
              variant="contained"
              onClick={handleNextButtonClick}
            >
              Next
            </Button>
          </Tooltiper>
        </div>
      </div>
      {isTourActive && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1001, borderRadius: '10px', backgroundImage: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)' }}>
        <Button sx={{ color: 'white' }} onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
          <Button sx={{ color: 'white' }} onClick={nextStep}>
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
          <Button sx={{ color: 'white' }} onClick={endTour}>End Tour</Button>
        </div>
      )}

      {isTourActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }} />
      )}
    </div>
  );
};

export default LevelThreeLearningAssessmentRedux;
