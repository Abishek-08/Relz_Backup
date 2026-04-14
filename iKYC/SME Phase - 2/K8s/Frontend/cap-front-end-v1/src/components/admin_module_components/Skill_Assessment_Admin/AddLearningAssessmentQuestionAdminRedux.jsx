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
import { FormHelperText, Card, CardContent } from "@mui/material";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getAllTopic,
  getSubTopicList,
  getSubTopicQuestionCount,
  getTopicQuestionCount,
  submitModerateAssessment,
  submitQuickAssessment,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LevelZeroLearningAssessment from "./LevelZeroLearningAssessmentRedux";
import LevelThreeLearningAssessment from "./LevelThreeLearningAssessmentRedux";
import { useDispatch, useSelector } from "react-redux";
import ReplayCircleFilledTwoToneIcon from "@mui/icons-material/ReplayCircleFilledTwoTone";
import {
  L1AssessmentAction,
  L1AssessmentSubDataAction,
  tabNumberAction,
} from "../../../redux/actions/admin_module_actions/LearningAssessmentCreationAction";
import LevelThreeLearningAssessmentRedux from "./LevelThreeLearningAssessmentRedux";
import LevelZeroLearningAssessmentRedux from "./LevelZeroLearningAssessmentRedux";
import {
  changeLevelTwoPassPercentage,
  changeLevelTwoSelectedSubtopicIdList,
  changeLevelTwoSelectedSubtopicNameList,
  changeLevelTwoTopicId,
  changeLevelTwoTopicName,
  changeLevelTwoTotal,
  changeSelectedTotalQuestion,
} from "../../../redux/actions/admin_module_actions/CreateAssessment";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import Tooltip from '@mui/material/Tooltip';


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

const TooltiperTwo = ({ children, text, isVisible }) => (
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
        maxWidth: '700px', // Set a max-width to prevent very long Tooltipers
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

const AddLearningAssessmentQuestionAdminRedux = () => {
  //Quick Modules States

  const activeTabNumber = useSelector(
    (state) => state.learningCreationTabNumber.number
  );
  const dispatch = useDispatch();

  const L1AssessmentSubData = useSelector(
    (state) => state.learningCreationTabNumber.L1SubData
  );

  const L1AssessmentData = useSelector(
    (state) => state.learningCreationTabNumber.L1Data
  );

  console.log("L1Data: " + L1AssessmentData);

  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState(
    L1AssessmentData.topicId === 0 ? 0 : L1AssessmentData.topicId
  );

  const [topicResponse, setTopicResponse] = useState([]);

  const [topicName, setTopicName] = useState(
    L1AssessmentSubData.topicName === " " ? " " : L1AssessmentSubData.topicName
  );
  const [basicCount, setBasicCount] = useState(
    L1AssessmentSubData.totalBasicCount === 0
      ? 0
      : L1AssessmentSubData.totalBasicCount
  );
  const [intermediateCount, setIntermediateCount] = useState(
    L1AssessmentSubData.totalIntermediateCount === 0
      ? 0
      : L1AssessmentSubData.totalIntermediateCount
  );
  const [hardCount, setHardCount] = useState(
    L1AssessmentSubData.totalHardCount === 0
      ? 0
      : L1AssessmentSubData.totalHardCount
  );
  const [totalCount, setTotalCount] = useState(
    L1AssessmentSubData.noOfQuestion === 0
      ? 0
      : L1AssessmentSubData.noOfQuestion
  );
  const [totalCountVisible, setTotalCountVisible] = useState(false);
  const [questionPick, setQuestionPick] = useState(false);

  const [inputTotal, setInputTotal] = useState(
    L1AssessmentSubData.noOfQuestion === 0
      ? ""
      : L1AssessmentSubData.noOfQuestion
  );
  const [totalError, setTotalError] = useState(false);

  const [sliderMax, setSliderMax] = useState(0);

  const [passPercentage, setPassPercentage] = useState(
    L1AssessmentData.passMark === 0 ? "" : L1AssessmentData.passMark
  );
  const [passPercentageError, setPassPercentageError] = useState(false);

  const [basic, setBasic] = useState(
    L1AssessmentData.basic === 0 ? 0 : L1AssessmentData.basic
  );
  const [intermediate, setIntermediate] = useState(
    L1AssessmentData.intermediate === 0 ? 0 : L1AssessmentData.intermediate
  );
  const [hard, setHard] = useState(
    L1AssessmentData.hard === 0 ? 0 : L1AssessmentData.intermediate
  );

  const [value, setValue] = React.useState("1");

  //redux data
  const [L1SubData, setL1SubData] = useState({
    topicName: "",
    noOfQuestion: 0,
    totalBasicCount: 0,
    totalIntermediateCount: 0,
    totalHardCount: 0,
  });

  console.log(activeTabNumber);

  const activeStep = 3;

  const navigate = useNavigate();

  // New state for the tour
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const [currentStepTwo, setCurrentStepTwo] = useState(0);
  const [isTourTwoActive, setIsTourTwoActive] = useState(false);

  const tourSteps = [
    { id: 'topic', text: 'Select a topic for the assessment. Available questions will be shown.' },
    { id: 'questionCount', text: 'Enter the number of questions. Cannot exceed the available questions.' },
    { id: 'Randomize Count', text: 'Select the Number of Complexity Count Question required' },
    { id: 'RandomizeCountButton', text: 'Generates Random Complexity Count' },
    { id: 'passPercentage', text: 'Set the pass percentage (45-90%).' },
    { id: 'submit', text: 'Click to proceed to the next step of creating the assessment.' },
    { id: 'previouStep', text: 'Click to rollback to the previous step of creating the assessment.' }
  ];

  const tourTwoSteps = [
    { id: 'topic', text: 'Select a topic for the assessment. Available questions will be shown.' },
    { id: 'subTopic', text: 'Select a Subtopic for the assessment. The Number of Questions available in the subtopic will be displayed.' },
    { id: 'Total Questions', text: 'Select the Total Number of Questions required. Cannot exceed the available questions.' },
    { id: 'passPercentage', text: 'Set the pass percentage (45-90%).' },
    { id: 'submit', text: 'Click to proceed to the next step of creating the assessment.' },
    { id: 'previouStep', text: 'Click to rollback to the previous step of creating the assessment.' }

  ];


  const [quickAssessment, setQuickAssessment] = useState({
    topicId: 0,
    numberOfQuestion: 0,
    basic: 0,
    intermediate: 0,
    hard: 0,
    passMark: 0,
    assessment: {
      assessmentId: 0,
    },
  });

  const [quickLearningAssessment, setQuickLearningAssessment] = useState({
    type: "Quick Schedule",
    assessment: {
      assessmentId: 0,
    },
  });

  //Moderate Assessment
  const levelTwoTopicName = useSelector(
    (state) => state.levelTwoReducer.topicName
  );

  const levelTwoTopicId = useSelector((state) => state.levelTwoReducer.topicId);

  const [subTopicList, setSubTopicList] = useState([]);
  const [L2TopicName, setL2TopicName] = useState(
    levelTwoTopicName === "" ? "" : levelTwoTopicName
  );
  const [L2TopicId, setL2TopicId] = useState(
    levelTwoTopicId === 0 ? 0 : levelTwoTopicId
  );
  const [totalSubTopicCount, setTotalSubTopicCount] = useState(false);

  const getTopics = async () => {
    // await axios.get("http://localhost:8090/cap/learning/topic")
    const response = await getAllTopic().then((response) => {
      setTopic(response.data);
    });
  };

  useEffect(() => {
    getTopics();
    setL1SubData({
      ...L1SubData,
      topicName: topicName,
      noOfQuestion: inputTotal,
      totalBasicCount: basic,
      totalIntermediateCount: intermediate,
      totalHardCount: hard,
    });

    setQuickAssessment({
      ...quickAssessment,
      topicId: topicId,
      numberOfQuestion: inputTotal,
      basic: basicCount,
      intermediate: intermediateCount,
      hard: hardCount,
      passMark: passPercentage,
      assessment: {
        assessmentId: 0,
      },
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("newValue: " + newValue);
    dispatch(tabNumberAction(newValue));
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    const selectedTopic = topic.find((top) => top.topicId === topicId);
    setTopicName(selectedTopic.topicName);
    setInputTotal("");
    setTotalError(false);
    setSubTopicTotalVisible(false);
    setTopicId(topicId);
    handleTopicCategory(topicId, selectedTopic.topicName);
    getSubTopicfunction(topicId);
    setQuickAssessment({ ...quickAssessment, topicId: topicId });
    setModerateAssessment({ ...moderateAssessment, topicId: topicId });

    setBasic(0);
    setIntermediate(0);
    setHard(0);
    setPassPercentage("");
    setModerateTotalError(false);
  };

  const handleL2TopicChange = (e) => {
    const topicId = e.target.value;
    console.log(topicId);
    const selectedTopic = topic.find((top) => top.topicId === topicId);
    setL2TopicName(selectedTopic.topicName);
    dispatch(changeLevelTwoTopicName(selectedTopic.topicName));
    setL2TopicId(selectedTopic.topicId);
    // setSubTopic([]);
    dispatch(changeLevelTwoSelectedSubtopicNameList([]));
    setInputTotal(" ");
    setTotalError(false);
    setSubTopicTotalVisible(false);
    console.log(topicId);
    // setTopicId(topicId);
    dispatch(changeLevelTwoTopicId(topicId));
    dispatch(changeLevelTwoSelectedSubtopicIdList([]));
    dispatch(changeLevelTwoTotal(null));
    dispatch(changeSelectedTotalQuestion(0));
    handleTopicCategory(topicId);
    getSubTopicfunction(topicId);
    setQuickAssessment({ ...quickAssessment, topicId: topicId });
    setModerateAssessment({ ...moderateAssessment, topicId: topicId });

    setBasic(0);
    setIntermediate(0);
    setHard(0);
    setModerateTotalError(false);
  };

  const handleTopicCategory = async (id, topName) => {
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

      setL1SubData({
        ...L1SubData,
        topicName: topName,
        noOfQuestion: 0,
        totalBasicCount: response.data.Basic,
        totalIntermediateCount: response.data.Intermediate,
        totalHardCount: response.data.Hard,
      });
    });
  };

  const handleTotalChange = (e) => {
    const inputTotal = e.target.value;

    if (inputTotal <= totalCount) {
      setInputTotal(inputTotal);
      setTotalError(false);
    } else {
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
    setL1SubData({ ...L1SubData, noOfQuestion: inputTotal });
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
    if (inputValue < 45 || inputValue > 100) {
      setPassPercentage(inputValue);
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
      setPassPercentage(inputValue);
      setQuickAssessment({ ...quickAssessment, passMark: inputValue });
    }
  };
  const handlel2PercentageChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue < 45 || inputValue > 100) {
      dispatch(changeLevelTwoPassPercentage(inputValue));
      setPassPercentageError(true);
    } else {
      setPassPercentageError(false);
      dispatch(changeLevelTwoPassPercentage(inputValue));
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
    dispatch(L1AssessmentAction(quickAssessment));
    dispatch(L1AssessmentSubDataAction(L1SubData));
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
        //submitQuickAssessment(quickAssessment).then((response) => {
        sessionStorage.setItem("activeStep", activeStep);
        navigate("/feedbackform");
        //});
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
    // assessment: {
    //   assessmentId: assessmentId,
    // },
    numberOfQuestion: 0,
  });
  const passPercentagel2 = useSelector(
    (state) => state.levelTwoReducer.passPercentage
  );

  // const [subTopic, setSubTopic] = useState([]);
  const subTopic = useSelector((state) => state.levelTwoReducer.subTopic);
  console.log(subTopic);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);

  const levelTwoTotalQuestionCount = useSelector(
    (state) => state.levelTwoReducer.totalQuestionCount
  );

  const [moderateTotalError, setModerateTotalError] = useState(false);

  const [subTopicId, setSubTopicId] = useState([]);

  const selectedId = useSelector((state) => state.levelTwoReducer.subTopicIds);
  console.log("selected Ids here", selectedId);

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

      console.log("subTopicCounts", subTopicCounts);

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
    console.log(names);
    setTotalSubTopicCount(false);

    setSubTopicTotalVisible(true);
    // Update subTopic state with selected names
    dispatch(changeLevelTwoSelectedSubtopicNameList(names));
    // setSubTopic(names);

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
    console.log("uniques", uniqueSubTopicObjects);
    dispatch(changeLevelTwoSelectedSubtopicIdList(uniqueSubTopicObjects));
    console.log("uniqueid", uniqueSubTopicIds);

    setSelectedSubTopic(uniqueSubTopicObjects);
    questionCount(uniqueSubTopicObjects);

    // handleModerateSubtopicCount()
    const lastSubTopicId = Array.from(uniqueSubTopicIds).pop();
    handleModerateSubtopicCount(lastSubTopicId);

    dispatch(changeLevelTwoSelectedSubtopicIdList([...uniqueSubTopicIds]));
    // Update moderateAssessment state to include only unique subtopics
    setModerateAssessment((prevState) => ({
      ...prevState,
      subTopic: Array.from(uniqueSubTopicIds).map((id) => ({
        subtopicId: id,
      })),
    }));
  };

  const questionCount = async (updatedSelectedSubTopic) => {
    console.log("hello", updatedSelectedSubTopic);
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
    // setTotalQuestionCount(totalQuestions);
    console.log(totalQuestions, "total Questions here");
    dispatch(changeSelectedTotalQuestion(totalQuestions));
  };

  const handleDeleteSubTopic = (subtopicName) => {
    // Remove the subtopic name from subTopic state
    // setSubTopic((prevSubTopic) =>
    //   prevSubTopic.filter((item) => item !== subtopicName)
    // );
    console.log(subTopic);
    console.log(subtopicName);
    const filteredNamelist = subTopic.filter((item) => item !== subtopicName);
    console.log(filteredNamelist);
    dispatch(changeLevelTwoSelectedSubtopicNameList(filteredNamelist));

    const uniqueSubTopicObjects = [];
    // Get the subtopicId to remove
    const subtopicToRemove = subTopicList.find(
      (sub) => sub.subtopicName === subtopicName
    );
    const subTopicIdToRemove = subtopicToRemove
      ? subtopicToRemove.subtopicId
      : null;
    const filteredIDlist = new Set(
      [...selectedId].filter((item) => item !== subtopicToRemove.subtopicId)
    );
    console.log("fileredlist", filteredIDlist);

    dispatch(changeLevelTwoSelectedSubtopicIdList([...filteredIDlist]));

    const updatedSelectedSubTopic = selectedSubTopic.filter(
      (sub) => sub !== subtopicToRemove && sub.subtopicId !== subTopicIdToRemove
    );
    questionCount(updatedSelectedSubTopic);

    setSelectedSubTopic(updatedSelectedSubTopic);
    // Remove the corresponding subtopicId from moderateAssessment.subTopic
    // setModerateAssessment((prevState) => ({
    //   ...prevState,
    //   subTopic: prevState.subTopic.filter(
    //     (sub) => sub.subtopicId !== subTopicIdToRemove
    //   ),
    // }));
  };

  // const [moderateInputTotal, setModerateInputTotal] = useState();
  const moderateInputTotal = useSelector(
    (state) => state.levelTwoReducer.levelTwoInputTotal
  );

  const handleModerateTotalChange = (e) => {
    const inputTotal = e.target.value;

    if (inputTotal <= levelTwoTotalQuestionCount && inputTotal > 0) {
      // setModerateInputTotal(inputTotal);
      dispatch(changeLevelTwoTotal(inputTotal));
      setModerateAssessment({
        ...moderateAssessment,
        numberOfQuestion: inputTotal,
      });
      setModerateTotalError(false);
    } else {
      dispatch(changeLevelTwoTotal(inputTotal));
      setModerateTotalError(true);
    }
  };

  const handleModeratePost = async () => {
    let errorMessage = "";

    if (!L2TopicId) {
      errorMessage = "Please Choose the Topic and add Question count.";
    } else if (!moderateInputTotal) {
      errorMessage = "Add Number of Question.";
    } else if (!passPercentagel2) {
      errorMessage = "Add Pass Percentage.";
    } else if (moderateInputTotal > levelTwoTotalQuestionCount) {
      errorMessage = "Check the Selected Questions and Total Count.";
    }

    if (errorMessage) {
      toast(errorMessage);
      return;
    }

    try {
      sessionStorage.setItem("activeStep", activeStep);
      navigate("/feedbackform");
    } catch (error) {
      console.error("Error moderating post:", error);
      toast("Unable to Post");
    }
  };

  const handleBackStep = () => {
    sessionStorage.setItem("activeStep", 1);
    navigate("/proctorstep");
  };

  const handlePrevious = () => {
    console.log("test: ", quickAssessment);
    console.log("test2: ", L1SubData);
    dispatch(L1AssessmentAction(quickAssessment));
    dispatch(L1AssessmentSubDataAction(L1SubData));
    sessionStorage.setItem("activeStep", 1);
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

  const nextStepTwo = () => {
    if (currentStepTwo < tourTwoSteps.length - 1) {
      setCurrentStepTwo(currentStepTwo + 1);
    } else {
      setIsTourTwoActive(false);
      setCurrentStepTwo(0);
    }
  };

  const prevStepTwo = () => {
    if (currentStepTwo > 0) {
      setCurrentStepTwo(currentStepTwo - 1);
    }
  };

  const endTourTwo = () => {
    setIsTourActive(false);
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="add_learning_assessment_super_parent"
    >
      <div
        className="container-fluid"
        id="Add_Learning_Assessment_Questions_Admin_stepper_bar"
      >
        <Card>
          <CardContent style={{ alignSelf: "center" }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
      </div>
      <div
        className="container-fluid"
        id="Add_Learning_Assessment_Questions_Admin_Tabs"
      >
        <Card>
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Box className="Add_Learning_Assessment_Questions_Admin_TabBox">
                <TabContext value={activeTabNumber}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Level 0" value="1" />
                      <Tab label="Level 1" value="2" />
                      <Tab label="Level 2" value="3" />
                      <Tab label="Level 3" value="4" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <LevelZeroLearningAssessmentRedux />
                  </TabPanel>
                  <TabPanel value="2">
                    <div className="Add_Learning_Assessment_Questions_Admin_topic_fields">
                      <div>
                        <Tooltiper text={tourSteps[0].text} isVisible={isTourActive && currentStep === 0}>
                          <FormControl sx={{ minWidth: 220 }} size="small">
                            <InputLabel id="demo-select-small-label">
                              Topic
                            </InputLabel>
                            <Select
                              labelId="topic-label"
                              id="topic-select-small"
                              label="Topic"
                              value={topicName}
                              renderValue={() => topicName}
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
                        </Tooltiper>
                      </div>

                      <div>
                        <Tooltiper text={tourSteps[1].text} isVisible={isTourActive && currentStep === 1}>
                          <TextField
                            label="Total Number of Questions"
                            id="outlined-size-small"
                            size="small"
                            onChange={handleTotalChange}
                            value={inputTotal}
                            error={totalError}
                            helperText={
                              totalError
                                ? "Please choose below " + totalCount
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
                      </div>
                      <div>
                        <Tooltip title="Guide Tour">
                          <HelpCenterIcon sx={{
                            transition: 'transform 0.2s', // add transition effect
                            '&:hover': {
                              cursor: 'pointer',
                              transform: 'scale(1.1)', // scale up on hover
                            },
                          }}
                            onClick={() => setIsTourActive(true)} />
                        </Tooltip>
                      </div>
                    </div>
                    <Tooltiper text={tourSteps[2].text} isVisible={isTourActive && currentStep === 2}>
                      <div className="Add_Learning_Assessment_Questions_Admin_slider_parent">
                        <div className="Add_Learning_Assessment_Questions_Admin_slider">
                          <Typography id="non-linear-slider" gutterBottom>
                            Basic:{" "}
                            {basicCount > 0 ? `${basic} (${basicCount})` : "0"}
                          </Typography>
                          <Slider
                            aria-label="Basic"
                            max={basicCount}
                            value={basic}
                            onChange={(e, newValue) =>
                              handleBasicChange(newValue)
                            }
                            valueLabelDisplay="auto"
                          />
                        </div>
                        <div className="Add_Learning_Assessment_Questions_Admin_slider">
                          <Typography id="non-linear-slider" gutterBottom>
                            Intermediate:{" "}
                            {intermediateCount > 0
                              ? `${intermediate} (${intermediateCount})`
                              : "0"}
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
                    </Tooltiper>
                    <div className="Add_Learning_Assessment_Questions_Admin_pass_field">
                      <div>
                        <Tooltiper text={tourSteps[4].text} isVisible={isTourActive && currentStep === 4}>
                          <TextField
                            sx={{
                              minWidth: 325,
                              maxWidth: 325,
                            }}
                            required
                            label="Pass Percentage"
                            id="outlined-size-small"
                            size="small"
                            value={passPercentage}
                            onChange={handlePercentageChange}
                            error={passPercentageError}
                            min="45"
                            max="90"
                            helperText={
                              passPercentageError
                                ? "Please choose below percentage between 45 - 100 "
                                : ""
                            }
                          />
                        </Tooltiper>
                      </div>
                      <div>
                        <Tooltiper text={tourSteps[3].text} isVisible={isTourActive && currentStep === 3}>
                          <Button
                            variant="contained"
                            title="Generate Random Counts"
                            label="Random Counts"
                            onClick={handleRandomCounts}
                            disabled={inputTotal > totalCount}
                          >
                            Random Counts
                            {/* <AutoAwesomeIcon /> */}
                          </Button>
                        </Tooltiper>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <div className="Add_Learning_Assessment_Questions_Admin_submit">
                        <Tooltiper text={tourSteps[6].text} isVisible={isTourActive && currentStep === 6}>
                          <Button
                            variant="contained"
                            onClick={handlePrevious}
                            sx={{
                              backgroundColor: "#27235c",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#97247e",
                              },
                            }}
                          >
                            Back
                          </Button>
                        </Tooltiper>
                      </div>
                      <div className="Add_Learning_Assessment_Questions_Admin_submit">
                        <Tooltiper text={tourSteps[5].text} isVisible={isTourActive && currentStep === 5}>
                          <Button
                            variant="contained"
                            onClick={handleQuestionSubmit}
                            sx={{
                              backgroundColor: "#27235c",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#97247e",
                              },
                            }}
                          >
                            Next
                          </Button>
                        </Tooltiper>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="3">
                    <div>
                      <div className="Add_Learning_Assessment_Questions_Admin_topics">
                        <div>
                          <TooltiperTwo text={tourTwoSteps[0].text} isVisible={isTourTwoActive && currentStepTwo === 0}>
                            <FormControl sx={{ minWidth: 220, m: 1 }} size="small">
                              <InputLabel id="demo-select-small-label">
                                Topic
                              </InputLabel>
                              <Select
                                labelId="topic-label"
                                id="topic-select-small"
                                value={L2TopicName}
                                label="Topic"
                                onChange={handleL2TopicChange}
                                renderValue={() => L2TopicName}
                                sx={{ height: 55 }}
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
                          </TooltiperTwo>
                        </div>
                        <div>
                          <TooltiperTwo text={tourTwoSteps[1].text} isVisible={isTourTwoActive && currentStepTwo === 1}>
                            <FormControl sx={{ width: 500, m: 1 }}>
                              <InputLabel>Select Sub Topics</InputLabel>
                              <Select
                                multiple
                                value={Array.isArray(subTopic) ? subTopic : []} // Ensure subTopic is an array
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
                                )}
                              >
                                {subTopicList.map((subTopic) => (
                                  <MenuItem
                                    key={subTopic.subtopicId}
                                    value={subTopic.subtopicName}
                                    disabled={subTopic.questionCount === 0} // Disable if questionCount is 0
                                  >
                                    {subTopic.subtopicName} (
                                    {subTopic.questionCount})
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {subTopicTotalVisible
                                  ? `${levelTwoTotalQuestionCount} Questions Selected`
                                  : "Choose a Sub-Topic"}
                              </FormHelperText>
                            </FormControl>
                          </TooltiperTwo>
                        </div>
                        <div style={{ display: "flex", alignItems: "start", paddingTop: "20px" }}>
                          <Tooltip title="Guide Tour">
                            <HelpCenterIcon sx={{
                              transition: 'transform 0.2s', // add transition effect
                              '&:hover': {
                                cursor: 'pointer',
                                transform: 'scale(1.1)', // scale up on hover
                              },
                            }}
                              onClick={() => setIsTourTwoActive(true)} />
                          </Tooltip>
                        </div>
                      </div>

                      <div className="Add_Learning_Assessment_Questions_Admin_form">
                        <div>
                          <TooltiperTwo text={tourTwoSteps[2].text} isVisible={isTourTwoActive && currentStepTwo === 2}>
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
                              value={
                                moderateInputTotal === null
                                  ? ""
                                  : moderateInputTotal
                              }
                              onChange={handleModerateTotalChange}
                              autoComplete="off"
                              error={moderateTotalError}
                              disabled={levelTwoTotalQuestionCount === 0}
                              helperText={
                                moderateTotalError
                                  ? `Question count shouldn't be greater than ${levelTwoTotalQuestionCount}`
                                  : ""
                              }
                              InputProps={{
                                inputProps: {
                                  min: 1, // Optional, but you mentioned a range
                                  max: 100, // Optional, but you mentioned a range
                                  step: null, // This disables the arrows
                                },
                              }}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </TooltiperTwo>
                        </div>
                        <div>
                          <TooltiperTwo text={tourTwoSteps[3].text} isVisible={isTourTwoActive && currentStepTwo === 3}>
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
                              value={passPercentagel2}
                              onChange={handlel2PercentageChange}
                              error={passPercentageError}
                              autoComplete="off"
                              min="45"
                              max="100"
                              helperText={
                                passPercentageError
                                  ? "Please choose a percentage between 45 - 100"
                                  : ""
                              }
                              InputProps={{
                                inputProps: {
                                  min: 1, // Optional, but you mentioned a range
                                  max: 100, // Optional, but you mentioned a range
                                  step: null, // This disables the arrows
                                },
                              }}
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </TooltiperTwo>
                        </div>
                      </div>
                    </div>
                    <div className="Add_Learning_Assessment_Questions_Admin_button">
                      <TooltiperTwo text={tourTwoSteps[5].text} isVisible={isTourTwoActive && currentStepTwo === 5}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#27235c",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#97247e",
                            },
                          }}
                          onClick={handleBackStep}
                        >
                          Back
                        </Button>
                      </TooltiperTwo>
                      <TooltiperTwo text={tourTwoSteps[4].text} isVisible={isTourTwoActive && currentStepTwo === 4}>
                        <Button
                          sx={{
                            backgroundColor: "#27235c",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#97247e",
                            },
                          }}
                          variant="contained"
                          onClick={handleModeratePost}
                        >
                          Next
                        </Button>
                      </TooltiperTwo>
                    </div>
                  </TabPanel>
                  <TabPanel value="4">
                    <LevelThreeLearningAssessmentRedux />
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
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

      {isTourTwoActive && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1001, borderRadius: '10px', backgroundImage: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)' }}>
        <Button sx={{ color: 'white' }} onClick={prevStepTwo} disabled={currentStepTwo === 0}>Previous</Button>
          <Button sx={{ color: 'white' }} onClick={nextStepTwo}>
            {currentStepTwo === tourTwoSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
          <Button sx={{ color: 'white' }} onClick={endTourTwo}>End Tour</Button>
        </div>
      )}

      {isTourTwoActive && (
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

export default AddLearningAssessmentQuestionAdminRedux;
