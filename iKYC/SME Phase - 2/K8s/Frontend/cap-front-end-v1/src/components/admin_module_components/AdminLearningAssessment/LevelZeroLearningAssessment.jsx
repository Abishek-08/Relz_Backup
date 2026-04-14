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
  getAllTopic,
  getTopicQuestionCount,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import "../../../styles/admin_module_styles/AdminLearningAssessment/AddLearningAssessmentQuestionAdmin.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PostLevelZeroAssessment } from "../../../services/admin_module_services/LearningAssessmentService";
const LevelZeroLearningAssessment = () => {
  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [inputTotal, setInputTotal] = useState(null);
  const [totalError, setTotalError] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountVisible, setTotalCountVisible] = useState(false);
  const [setQuestionPick] = useState(false);
  const [passPercentage, setPassPercentage] = useState(null);
  const [passPercentageError, setPassPercentageError] = useState(false);

  const assessment = JSON.parse(sessionStorage.getItem("assessment"));
  const assessmentId = assessment.assessmentId;

  const activeStep = 3;

  const navigate = useNavigate();

  const [LevelZeroAssessment, setLevelZeroAssessment] = useState({
    topicId: "",
    numberOfQuestion: "",
    passMark: "",
    assessment: {
      assessmentId: assessmentId,
    },
  });
  
  const handleTopic = (e) => {
    const topicId = e.target.value;
    const selectedTopic = topic.find((top) => top.topicId === topicId);
    setLevelZeroAssessment({ ...LevelZeroAssessment, topicId: topicId });
    setInputTotal(null);
    setTotalError(false);
    setTopicId(topicId);
    handleTopicsCategory(topicId);
  };

  const handleTopicsCategory = async (id) => {
    try {
      const response = await getTopicQuestionCount(id);
      const total =
        response.data.Basic + response.data.Hard + response.data.Intermediate;
      setTotalCount(total);
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
    if (inputValue < 45 || inputValue > 90) {
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
        // axios .post(`http://localhost:8090/cap/admin/levelzerolearningassessment`, LevelZeroAssessment)
        PostLevelZeroAssessment(LevelZeroAssessment)
        .then((response) => {
          sessionStorage.setItem("activeStep", activeStep);
          navigate("/assessmentscheduling");
        });
      } catch (error) {
        console.error(error);
        toast("Unable to post");
      }
    }
  };

  return (
    <div>
      <div className="Add_Learning_Assessment_Questions_Admin_topic_fields">
        <div>
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="demo-select-small-label">Topic</InputLabel>
            <Select
              labelId="topic-label"
              id="topic-select-small"
              value={topicId}
              label="Topic"
              onChange={handleTopic}
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
            label="Number of Questions"
            id="outlined-size-small"
            size="small"
            type="number"
            value={inputTotal}
            onChange={handleTotalQuestion}
            error={totalError}
            helperText={totalError ? "Please choose below " + totalCount : ""}
            sx={{ minWidth: 250 }}
          />
        </div>
      </div>
      <div id="admin-module-level0-assessment">
        <TextField
          sx={{
            minWidth: 250,
            // maxWidth: 325,
          }}
          required
          label="Pass Percentage"
          id="outlined-size-small"
          size="small"
          type="number"
          value={passPercentage}
          onChange={handlePercentage}
          error={passPercentageError}
          inputProps={{
            min: 45,
            max: 90,
          }}
          helperText={
            passPercentageError
              ? "Please choose a percentage between 45 - 90"
              : ""
          }
        />
      </div>

      <div className="Add_Learning_Assessment_Questions_Admin_submit">
        <Button variant="contained" onClick={AddLevelZeroAssessment}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default LevelZeroLearningAssessment;
