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
  getAllTopic,
  getComplexityCount,
  getSubTopicList,
  getSubTopicQuestionCount,
  getTopicQuestionCount,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import { Card, CardHeader } from "@mui/material";
import { toast } from "react-toastify";
import { addLevelThreeLearningAssessment } from "../../../services/admin_module_services/LearningAssessmentService";

/**
 * @author ranjitha.rajaram
 * @version 4.0
 * @since 18-07-2024
 */

const LevelThreeLearningAssessment = () => {
  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [subTopic, setSubTopic] = useState("");
  const [inputTotal, setInputTotal] = useState("");
  const [subInputTotal, setSubInputTotal] = useState("");
  const [totalError, setTotalError] = useState(false);
  const [subTotalError, setSubTotalError] = useState(false);
  const [basic, setBasic] = useState(0);
  const [intermediate, setIntermediate] = useState(0);
  const [hard, setHard] = useState(0);
  const [basicCount, setBasicCount] = useState(0);
  const [intermediateCount, setIntermediateCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [subTopicList, setSubTopicList] = useState([]);
  const [subTopicTotal, setSubTopicTotal] = useState(0);
  const [subTopicTotalVisible, setSubTopicTotalVisible] = useState(false);
  const [passPercentage, setPassPercentage] = useState(null);
  const [passPercentageError, setPassPercentageError] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [questionDatas, setQuestionDatas] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountVisible, setTotalCountVisible] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const [topicList, setTopicList] = useState([]);
  const [allSubTopics, setAllSubTopics] = useState([]);
  const [subTopicCount, setSubTopiccount] = useState("");
  const [totalTopicCount, setTotalTopicCount] = useState(0);
  const [totalTopicCountVisible, setTotalTopicCountVisible] = useState(false);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const activeStep = 3;
  const navigate = useNavigate();

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

  useEffect(() => {
    if (
      topicId &&
      inputTotal &&
      subTopic &&
      subInputTotal &&
      (basic > 0 || intermediate > 0 || hard > 0)
    ) {
      setIsAddButtonEnabled(true);
    } else {
      setIsAddButtonEnabled(false);
    }
  }, [topicId, inputTotal, subTopic, subInputTotal, basic, intermediate, hard]);

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    setTopicId(topicId);
    await handleTopicCategory(topicId);
    await getSubTopicfunction(topicId);
    setQuestionDatas([]);
    setTableVisible(false);
    setInputTotal("");
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
    if (value < 45 || value > 90) {
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
    }
    setPassPercentage(value);
  };

  const handleAddQuestions = async () => {
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
          assessmentId: assessmentId,
        },
      };

      await addLevelThreeLearningAssessment(payload);

      sessionStorage.setItem("activeStep", activeStep);
      setQuestionDatas([]);
      setTableVisible(false);
      navigate("/assessmentscheduling");
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  return (
    <div>
      <div id="Add_Learning_Assessment_Questions_Admin_topic_fields1">
        <Grid container sx={{ width: "100%", height: "500%" }} spacing={2}>
          <Grid container sx={{ width: "100%" }} spacing={2}>
            <Grid item sm={6} xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="topic-label">Topic</InputLabel>
                <Select
                  labelId="topic-label"
                  id="topic-select-small"
                  value={topicId || ""}
                  label="Topic"
                  onChange={handleTopicChange}>
                  {topic.map((top) => (
                    <MenuItem key={top.topicId} value={top.topicId}>
                      {top.topicName}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>
                  Total Questions in Topic: {totalTopicCount}{" "}
                </FormHelperText>

                {totalCountVisible && (
                  <FormHelperText>
                    Remaining Questions in Topic: {totalCount}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={6}>
              <TextField
                label="Total Questions"
                id="outlined-size-small"
                size="small"
                type="number"
                value={inputTotal}
                onChange={handleTotalChange}
                sx={{ minWidth: 360, maxWidth: 150 }}
                error={totalError}
                helperText={totalError ? "Invalid total questions" : ""}
              />
              <FormHelperText>
                Selected Questions: {selectedQuestionCount} {""} {"||"}{" "}
                Remaining Question to Select:{" "}
                {inputTotal - selectedQuestionCount}
              </FormHelperText>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid
            container
            sx={{ width: "100%" }}
            spacing={2}
            style={{ marginTop: "25px" }}>
            <Grid item sm={6} xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="subtopic-label">Subtopic</InputLabel>
                <Select
                  labelId="subtopic-label"
                  id="subtopic-select-small"
                  value={subTopic || ""}
                  label="Subtopic"
                  onChange={handleSubTopicChange}
                  disabled={!subTopicList.length}>
                  {subTopicList.map((subtopic) => (
                    <MenuItem
                      key={subtopic.subtopicId}
                      value={subtopic.subtopicName}>
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
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Total subtopic Questions"
                  id="outlined-size-small"
                  size="small"
                  onChange={handleSubTopicTotalChange}
                  sx={{ minWidth: 360, maxWidth: 150 }}
                  error={subTotalError}
                  helperText={
                    subTotalError
                      ? "Total questions exceed available count for this subtopic."
                      : ""
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
        </Grid>
      </div>
      <div className="Add_Learning_Assessment_Questions_Admin_slider_parent">
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
      </div>

      <div className="Add_Learning_Assessment_Questions_Admin_pass_field">
        <Button
          variant="contained"
          title="Generate Random Counts"
          onClick={handleRandomCounts}>
          Random Counts
          <RefreshOutlinedIcon />
        </Button>

        <Button
          variant="contained"
          onClick={handleAddQuestions}
          startIcon={<QuizIcon />}
          disabled={!isAddButtonEnabled}>
          ADD QUESTIONS
        </Button>

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
            max: 90,
          }}
          helperText={
            passPercentageError
              ? "Please fill in the pass percentage"
              : (passPercentageError && passPercentage < 45) ||
                passPercentage > 90
              ? "Please choose a percentage between 45 - 90"
              : ""
          }
        />
      </div>

      <br />
      <br />

      {tableVisible && (
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
                        onClick={() => handleRemoveQuestion(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    title={`${
                      topic.find((topic) => topic.topicId === question.topicId)
                        ?.topicName
                    } - ${
                      allSubTopics.find(
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
          <div className="Add_Learning_Assessment_Questions_Admin_submit">
            <Button variant="contained" onClick={handleNextButtonClick}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelThreeLearningAssessment;
