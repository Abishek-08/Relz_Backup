import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  PostLevelZeroAssessment,
  getAllTopic,
  getTopicQuestionCount,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/admin_module_styles/AdminLearningAssessment/AddLearningAssessmentQuestionAdmin.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  L0AssessmentAction,
  L0AssessmentSubDataAction,
} from "../../../redux/actions/admin_module_actions/LearningAssessmentCreationAction";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Tooltip from "@mui/material/Tooltip";

const Tooltiper = ({ children, text, isVisible }) => (
  <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
    {children}
    {isVisible && (
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)", // Adjusted to create some space between Tooltiper and element
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#333",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "pre", // Prevents text from wrapping
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          fontSize: "14px",
          maxWidth: "475px", // Set a max-width to prevent very long Tooltipers
          textAlign: "center",
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            borderWidth: "5px",
            borderStyle: "solid",
            borderColor: "#333 transparent transparent transparent",
          }}
        ></div>
      </div>
    )}
  </div>
);

const LevelZeroLearningAssessmentRedux = () => {
  const L0AssessmentReduxData = useSelector(
    (state) => state.learningCreationTabNumber.L0Data
  );

  const L0SubAssessmentReduxData = useSelector(
    (state) => state.learningCreationTabNumber.L0SubData
  );

  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState(
    L0AssessmentReduxData.topicId === 0 ? null : L0AssessmentReduxData.topicId
  );
  const [topicName, setTopicName] = useState(
    L0SubAssessmentReduxData.topicName === ""
      ? ""
      : L0SubAssessmentReduxData.topicName
  );
  const [inputTotal, setInputTotal] = useState(
    L0AssessmentReduxData.numberOfQuestion === 0
      ? ""
      : L0AssessmentReduxData.numberOfQuestion
  );
  const [totalError, setTotalError] = useState(false);
  const [totalCount, setTotalCount] = useState(
    L0SubAssessmentReduxData.availableQuestionCount === 0
      ? 0
      : L0SubAssessmentReduxData.availableQuestionCount
  );
  const [availableQuestionCount, setAvailableQuestionCount] = useState(
    L0SubAssessmentReduxData.availableQuestionCount === 0
      ? ""
      : L0SubAssessmentReduxData.availableQuestionCount
  );
  const [totalCountVisible, setTotalCountVisible] = useState(false);
  const [setQuestionPick] = useState(false);
  const [passPercentage, setPassPercentage] = useState(
    L0AssessmentReduxData.passMark === 0 ? "" : L0AssessmentReduxData.passMark
  );
  const [passPercentageError, setPassPercentageError] = useState(false);

  const activeStep = 3;

  // New state for the tour
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const tourSteps = [
    {
      id: "topic",
      text: "Select a topic for the assessment. Available questions will be shown.",
    },
    {
      id: "questionCount",
      text: "Enter the number of questions. Cannot exceed the available questions.",
    },
    { id: "passPercentage", text: "Set the pass percentage (45-90%)." },
    {
      id: "previouStep",
      text: "Click to rollback to the previous step of creating the assessment.",
    },
    {
      id: "submit",
      text: "Click to proceed to the next step of creating the assessment.",
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [LevelZeroAssessment, setLevelZeroAssessment] = useState({
    topicId: L0AssessmentReduxData.topicId,
    numberOfQuestion: L0AssessmentReduxData.numberOfQuestion,
    passMark: L0AssessmentReduxData.passMark,
    assessment: {
      assessmentId: 0,
    },
  });

  const handleTopic = (e) => {
    const topicId = e.target.value;
    const selectedTopic = topic.find((top) => top.topicId === topicId);
    setLevelZeroAssessment({ ...LevelZeroAssessment, topicId: topicId });
    setTopicName(selectedTopic.topicName);
    setInputTotal("");
    setTotalError(false);
    setTopicId(topicId);
    setTopicName(selectedTopic.topicName);
    handleTopicsCategory(topicId);
  };

  const handleTopicsCategory = async (id) => {
    try {
      const response = await getTopicQuestionCount(id);
      const total =
        response.data.Basic + response.data.Hard + response.data.Intermediate;
      setTotalCount(total);
      setAvailableQuestionCount(total);
      setTotalCountVisible(true);

      if (total > 0) {
        setQuestionPick(true);
      }
    } catch (error) {
      console.error("Error fetching topic category:", error);
    }
  };

  const handleTotalQuestion = (e) => {
    const inputTotal = e.target.value;

    if (inputTotal <= totalCount) {
      setInputTotal(inputTotal);
      setTotalError(false);
    }

    if (inputTotal > totalCount || inputTotal === "") {
      setTotalError(true);
    }

    setLevelZeroAssessment({
      ...LevelZeroAssessment,
      numberOfQuestion: inputTotal,
    });
  };

  const handlePercentage = (e) => {
    const inputValue = e.target.value;
    if (inputValue < 45 || inputValue > 100) {
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
      setPassPercentage(inputValue);
      setLevelZeroAssessment({ ...LevelZeroAssessment, passMark: inputValue });
    }
  };

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

  const AddLevelZeroAssessment = () => {
    dispatch(L0AssessmentAction(LevelZeroAssessment));
    const payload = { topicName, availableQuestionCount };
    dispatch(L0AssessmentSubDataAction(payload));
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

    if (!errorOccurred) {
      try {
        // // axios .post(`http://localhost:8090/cap/admin/levelzerolearningassessment`, LevelZeroAssessment)
        // PostLevelZeroAssessment(LevelZeroAssessment).then((response) => {
        sessionStorage.setItem("activeStep", activeStep);
        navigate("/feedbackform");
        // });
      } catch (error) {
        console.error(error);
        toast("Unable to post");
      }
    }
  };

  const handlePrevious = () => {
    sessionStorage.setItem("activeStep", 1);
    dispatch(L0AssessmentAction(LevelZeroAssessment));
    const payload = { topicName, availableQuestionCount };
    dispatch(L0AssessmentSubDataAction(payload));
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
      <div className="Add_Learning_Assessment_Questions_Admin_topic_fields">
        <div>
          <Tooltiper
            text={tourSteps[0].text}
            isVisible={isTourActive && currentStep === 0}
          >
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel id="demo-select-small-label">Topic</InputLabel>
              <Select
                labelId="topic-label"
                id="topic-select-small"
                label="Topic"
                renderValue={() => topicName}
                defaultValue={topicName}
                onChange={handleTopic}
              >
                {topic.map((top) => (
                  <MenuItem key={top.topicId} value={top.topicId}>
                    {top.topicName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {availableQuestionCount !== 0
                  ? `${availableQuestionCount} Questions Available`
                  : "Choose a Topic"}
              </FormHelperText>
            </FormControl>
          </Tooltiper>
        </div>
        <div>
          <Tooltiper
            text={tourSteps[1].text}
            isVisible={isTourActive && currentStep === 1}
          >
            <TextField
              label="Number of Questions"
              id="outlined-size-small"
              size="small"
              type="number"
              defaultValue={inputTotal}
              onChange={handleTotalQuestion}
              error={totalError}
              helperText={
                totalError
                  ? "Please choose below " + availableQuestionCount
                  : ""
              }
              sx={{ minWidth: 250 }}
            />
          </Tooltiper>
        </div>
        <div>
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
      </div>
      <div id="admin-module-level0-assessment">
        <Tooltiper
          text={tourSteps[2].text}
          isVisible={isTourActive && currentStep === 2}
        >
          <TextField
            sx={{
              minWidth: 250,
              // maxWidth: 325,
            }}
            required
            label="Pass Percentage"
            id="outlined-size-small"
            size="small"
            defaultValue={passPercentage}
            onChange={handlePercentage}
            error={passPercentageError}
            inputProps={{
              min: 45,
              max: 100,
            }}
            helperText={
              passPercentageError
                ? "Please choose a percentage between 45 - 100"
                : ""
            }
          />
        </Tooltiper>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div className="Add_Learning_Assessment_Questions_Admin_submit">
          <Tooltiper
            text={tourSteps[3].text}
            isVisible={isTourActive && currentStep === 3}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#97247e",
                },
              }}
              onClick={handlePrevious}
            >
              Back
            </Button>
          </Tooltiper>
        </div>
        <div className="Add_Learning_Assessment_Questions_Admin_submit">
          <Tooltiper
            text={tourSteps[4].text}
            isVisible={isTourActive && currentStep === 4}
          >
            <Button
              sx={{
                backgroundColor: "#27235c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#97247e",
                },
              }}
              variant="contained"
              onClick={AddLevelZeroAssessment}
            >
              Next
            </Button>
          </Tooltiper>
        </div>
      </div>
      {isTourActive && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1001, borderRadius: '10px', backgroundImage: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)' }}>
          <Button
            sx={{ color: "white" }}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button sx={{ color: "white" }} onClick={nextStep}>
            {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
          </Button>
          <Button sx={{ color: "white" }} onClick={endTour}>
            End Tour
          </Button>
        </div>
      )}

      {isTourActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default LevelZeroLearningAssessmentRedux;
