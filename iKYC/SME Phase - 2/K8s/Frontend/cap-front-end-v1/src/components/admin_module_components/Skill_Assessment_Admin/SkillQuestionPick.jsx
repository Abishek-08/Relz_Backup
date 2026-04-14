import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { TextField } from "@mui/material";
import { MenuItem, Grid, Card, CardContent } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import {
  addQuestionRequest,
  deleteQuestion,
  getCategoryList,
  getLanguageList,
  getQuestions,
  validateCategoryQuestionCount,
  validateLangaugeQuestionCount,
  validateQuestionCount,
} from "../../../services/admin_module_services/AdminSkillAssessmentService";
import { Alert } from "@mui/material";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { ToastContainer, toast } from "react-toastify";
import AdminSkillAssessmentQuestionPick from "../../../styles/admin_module_styles/skill_assessment_schedule_admin/AdminSkillAssessmentQuestionPick.css";
import { useNavigate } from "react-router-dom";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import {
  changeSkillTotalCount,
  deleteSkillQuestion,
  skillPickedQuestions,
} from "../../../redux/actions/admin_module_actions/CreateAssessment";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";

const SkillQuestionPick = () => {
  // Tabs Switch and its states
  const [value, setValue] = useState("one");

  const dispatch = useDispatch();

  // Skill Assessment Id from Session
  // const skillAssessment = JSON.parse(sessionStorage.getItem("skillAssessment"));

  // const skillAssessmentId = skillAssessment.skillAssessmentId;

  // Total Questions and its State
  // const [totalQuestions, setTotalQuestions] = useState(null);
  const totalQuestions = useSelector(
    (state) => state.skillQuestionPick.totalQuestions
  );

  const response = useSelector((state) => state.skillQuestionPick.request);

  useEffect(() => {
    if (response) {
      setQuestionListData(response);
    }
  }, [response]);

  const [totalQuestionsError, setTotalQuestionsError] = useState(false);

  // Language and its states
  const [languageList, setLanguageList] = useState([]);
  const [languageId, setLanguageId] = useState(null);
  const [languageName, setLanguageName] = useState(null);
  const [languageQuestionCount, setLanguageQuestionCount] = useState(null);
  const [languageCountVisible, setLanguageCountVisible] = useState(false);
  const [languageDisable, setLanguageDisable] = useState(true);

  // Category and its states
  const [categoryList, setCategoryList] = useState([]);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [categoryQuestionCount, setCategoryQuestionCount] = useState(null);
  const [categoryCountVisible, setCategoryCountVisible] = useState(false);
  const [categoryDisable, setCategoryDisable] = useState(true);

  // Complexity and its States
  const [complexityValue, setComplexityValue] = useState(null);
  const [complexityCount, setComplexityCount] = useState(null);
  const [complexityCountVisible, setComplexityCountVisible] = useState(false);
  const [complexityDisable, setComplexityDisable] = useState(true);

  // Count and its States
  const [count, setCount] = useState(null); // Changed to null to clear the input
  const [countError, setCountError] = useState(false);
  const [countDisable, setCountDisable] = useState(true);

  // Add Button and Its States
  const [addButtonVisible, setAddButtonVisible] = useState(false);

  // Warning and its states

  const [countExceedWarning, setCountExceedWarning] = useState(false);

  // Added Question List

  const [questionListData, setQuestionListData] = useState([]);

  // Active Step for Admin Stepper Component
  const activeStep = 3;

  // Request Json Structure
  const [request, setRequest] = useState({
    level: "",
    count: 1,
    skillassessment: {
      skillAssessmentId: null,
    },
    category: {
      categoryId: null,
      categoryName: null,
      languageName: null,
    },
  });

  //Use Navigate hook

  const navigate = useNavigate();

  // Load Language List on Component Mount
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await getCategoryList();
        setCategoryList(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching Category list:", error);
      }
    };

    fetchCategoryList();
  }, []);

  useEffect(() => {
    if (totalQuestions != null) {
      setLanguageDisable(false);
      setCategoryDisable(false);
      setComplexityDisable(false);
    }
  }, []);

  // Total Questions and Validation Function
  const totalChange = (e) => {
    let input = e.target.value;

    // Disable all fields for proper flow
    setLanguageDisable(true);
    setCategoryDisable(true);
    setComplexityDisable(true);
    setCountDisable(true);
    setCategoryValue(null);
    setCategoryCountVisible(false);
    setComplexityCountVisible(false);
    setCountError(false);

    if (input === null || input === "") {
      // setTotalQuestions(null);
      dispatch(changeSkillTotalCount(null));
      setTotalQuestionsError(false);
    } else if (/^[1-9]$|^10$/.test(input)) {
      // Valid input (1-10)
      dispatch(changeSkillTotalCount(parseInt(input, 10)));
      console.log(parseInt(input, 10));
      // (parseInt(input, 10));
      setTotalQuestionsError(false);

      setLanguageDisable(false);
      setCategoryDisable(false);
      setComplexityDisable(false);
      setComplexityValue(null);
    } else {
      // Invalid input
      setTotalQuestionsError(true);
    }
  };

  // Handle Language Change
  const handleLanguageChange = async (event) => {
    const languageId = event.target.value;
    setLanguageId(languageId);

    try {
      const response = await validateLangaugeQuestionCount(languageId);
      setLanguageQuestionCount(response.data);
      setLanguageCountVisible(true);

      const selectedLanguage = languageList.find(
        (lang) => lang.languageId === languageId
      );
      setLanguageName(selectedLanguage.languageName);

      setRequest({
        ...request,
        category: {
          ...request.category,
          languageName: selectedLanguage.languageName,
        },
      });

      await categoryListLoader(languageId);
    } catch (error) {
      console.error("Error validating language question count:", error);
    }
  };

  // Load Category List for a Language
  const categoryListLoader = async (languageId) => {
    try {
      const response = await getCategoryList(languageId);
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  // Handle Category Change
  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setCategoryValue(categoryId);

    // Update visibility and error state
    setCountError(false);
    setComplexityValue(null);
    setComplexityCountVisible(false);
    setComplexityDisable(false);
    setComplexityCount(null);

    // Find the selected category
    const selectedCategory = categoryList.find(
      (cate) => cate.categoryId === parseInt(categoryId, 10)
    );

    if (selectedCategory) {
      // Update the request state with category details
      setRequest((prevRequest) => ({
        ...prevRequest,
        category: {
          ...prevRequest.category,
          categoryId: categoryId,
          categoryName: selectedCategory.categoryName,
        },
      }));

      // Set additional state based on the selected category
      setCategoryName(selectedCategory.categoryName);

      try {
        // Fetch the question count based on the selected category
        const response = await validateCategoryQuestionCount(
          categoryId
        );
        setCategoryQuestionCount(response.data);
        setCategoryCountVisible(true);
        setCountDisable(true); // Disable the Question count field when its category is changed
        setCount(null); // Reset the Count field when category is changed
      } catch (error) {
        console.error("Error validating category question count:", error);
      }
    } else {
      console.error("Selected category not found in the list");
    }
  };

  // Handle Complexity Change
  const handleComplexityChange = async (event) => {
    const complexity = event.target.value;
    setComplexityValue(complexity);
    setCountError(false);
    // Reset count when complexity changes
    setCount(null);

    setRequest({
      ...request,
      level: complexity,
      skillassessment: {
        ...request.skillassessment,
        skillAssessmentId: null,
      },
    });
    console.log(categoryValue);

    try {
      const response = await validateQuestionCount(
        languageId,
        categoryValue,
        complexity
      );
      setComplexityCount(response.data);
      setComplexityCountVisible(true);
      setCountDisable(false);
    } catch (error) {
      console.error("Error validating question count:", error);
    }
  };

  const deleteQuestionRequest = (requestId) => {
    dispatch(deleteSkillQuestion(requestId));
  };

  // Handle Count Change
  const handleCountChange = (event) => {
    const inputValue = event.target.value;

    if (
      inputValue <= complexityCount &&
      inputValue > 0 &&
      /^[1-9]$|^10$/.test(inputValue)
    ) {
      setCount(inputValue);
      setRequest({
        ...request,
        count: inputValue,
      });
      console.log(request);
      setCountError(false);
      setAddButtonVisible(true);
    } else {
      // When inputValue is greater than complexityCount or invalid
      setCountError(true);
      setAddButtonVisible(true); // Assuming this controls visibility of an add button
      setAddButtonVisible(false);
      setCount(inputValue);
      setRequest({
        ...request,
        count: inputValue,
      });

      // Set the count to the maximum available if it exceeds complexityCount
      if (inputValue > complexityCount) {
        setCount(inputValue);
        setCountError(true);
        setRequest({
          ...request,
          count: inputValue,
        });

        console.log(request);
      } else {
        setCount(inputValue);
        setRequest({
          ...request,
          count: inputValue,
        });
        console.log("request", request);
      }
    }
  };

  //Verify Question

  const getQuestionData = async () => {
    try {
      // const response = await getQuestions(skillAssessmentId);
      // const questionData = response.data;
      setQuestionListData(response);
      // console.log(response.data)

      let totalCount = 0;

      for (let i = 0; i < response.length; i++) {
        totalCount += parseInt(response[i].count, 10);
      }

      console.log("Total Count from DB:", totalCount);

      return totalCount;
    } catch (error) {
      console.error("Error fetching question data:", error);
      throw error; // Propagate the error for handling elsewhere if needed
    }
  };

  //Post Question to Database

  const submitQuestion = async () => {
    try {
      // Get the total count from the database
      const databaseCount = await getQuestionData();

      // Calculate the total count to be added
      const totalCountToAdd = databaseCount + +count;
      console.log(totalCountToAdd);
      // Check if totalCountToAdd is less than or equal to totalQuestions
      if (totalCountToAdd <= totalQuestions) {
        // Proceed with adding the question request
        // const response = await addQuestionRequest(request);
        // Handle success scenario if needed

        dispatch(skillPickedQuestions(request));

        getQuestionData();
        setCount(null); //to clear the input field so that previous states input cannot be posted.
        setAddButtonVisible(false);
      } else {
        toast.error("Total Count exceeds", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      return; // Do not proceed with the submission
    } catch (error) {
      console.error("Error submitting question:", error);
      // Handle error scenario if needed
    }
  };

  //Validate whether posting question is matching upto the count
  const validatePostingCount = async () => {
    try {
      // Fetch existing questions data
      const questionData = await getQuestionData();
      console.log(questionListData);
      // Find if there's an existing question matching the current request
      const foundObject = questionListData.find(
        (object) =>
          // object.category.language.langaugeName === request.category.language.langaugeName &&
          object.category.categoryId === request.category.categoryId &&
          object.level === request.level &&
          object.category.categoryName === request.category.categoryName
      );

      if (foundObject) {
        // If a matching question is found, check if adding `request.count` exceeds available questions
        const addedCount =
          parseInt(foundObject.count) + parseInt(request.count, 10);
        console.log("foundobject count", foundObject.count);
        console.log("request count", request.count);
        console.log("addedCount", addedCount);
        console.log("complexityCount", complexityCount);
        if (addedCount > complexityCount) {
          // Display error if adding exceeds available questions
          toast.error(
            "Required question count exceeds available questions in this category",
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
        } else {
          // Otherwise, proceed with submitting the question
          await submitQuestion();
        }
      } else {
        // If no matching question found, proceed with submitting the question
        await submitQuestion();
      }
    } catch (error) {
      console.error("Error validating or submitting question:", error);
      // Handle error scenario if needed
    }
  };

  //Handle navigation to next page

  const handleNavigation = async () => {
    const databaseCount = await getQuestionData();

    console.log("database count", databaseCount);
    console.log("count", totalQuestions);
    // Calculate the total count to be added

    if (databaseCount == totalQuestions) {
      sessionStorage.setItem("activeStep", activeStep);
      navigate("/feedbackform");
    } else {
      toast.error("Add Questions matching the total count", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleBack = () => {
    const decreaseActiveStep = 1;
    sessionStorage.setItem("activeStep", decreaseActiveStep);
    navigate("/proctorstep");
  };

  // Render Component
  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="Skill_assessment_question_pick_admin_parent"
    >
      <div className="container-fluid" id="skill_question_pick_Admin_Stepper">
        <Card>
          <CardContent style={{ alignSelf: "center" }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
      </div>
      <div
        className="container-fluid"
        id="Skill_assessment_question_pick_admin_tab"
      >
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <div className="Skill_assessment_question_pick_total_field">
                  {/* Total Questions Input */}
                  <div>
                    <Box
                      sx={{
                        minWidth: 270,
                        minHeight: 100,
                        maxHeight: 100,
                        maxWidth: 270,
                      }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          id="outlined-required"
                          label="Total Question"
                          defaultValue={totalQuestions}
                          placeholder="[1-10]"
                          onChange={totalChange}
                          error={totalQuestionsError}
                          autoComplete="off"
                          helperText={
                            totalQuestionsError
                              ? "Total should be between 1-10"
                              : "Total Questions required"
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
                      </FormControl>
                    </Box>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <div className="Skill_assessment_question_pick_category_field">
                {/* Language Dropdown */}
                {/* <Grid item xs={12}>
                  <div>
                    <Box
                      sx={{
                        minWidth: 150,
                        minHeight: 100,
                        maxHeight: 100,
                        maxWidth: 150,
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                          labelId="language-label"
                          id="language-select"
                          value={languageId}
                          label="Select Language"
                          onChange={handleLanguageChange}
                          disabled={languageDisable}
                        >
                          {languageList.map((lang) => (
                            <MenuItem
                              key={lang.languageId}
                              value={lang.languageId}
                            >
                              {lang.languageName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {languageCountVisible
                            ? `${languageQuestionCount} Questions Available`
                            : "Choose a Language"}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  </div>
                </Grid> */}

                {/* Category Dropdown */}
                <Grid item xs={12}>
                  <div>
                    <Box sx={{ minWidth: 150, maxWidth: 150 }}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category-select"
                          value={categoryValue}
                          label="Select Category"
                          onChange={handleCategoryChange}
                          disabled={categoryDisable}
                        >
                          {categoryList.map((cat) => (
                            <MenuItem
                              key={cat.categoryId}
                              value={cat.categoryId}
                            >
                              {cat.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {categoryCountVisible
                            ? `${categoryQuestionCount} Questions Available`
                            : "Choose a category"}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  </div>
                </Grid>

                {/* Complexity Dropdown */}
                <Grid item xs={12}>
                  <div>
                    <Box sx={{ minWidth: 150, maxWidth: 150 }}>
                      <FormControl fullWidth>
                        <InputLabel id="complexity-label">
                          Complexity
                        </InputLabel>
                        <Select
                          labelId="complexity-label"
                          id="complexity-select"
                          value={complexityValue}
                          label="Select Complexity"
                          onChange={handleComplexityChange}
                          disabled={complexityDisable}
                        >
                          <MenuItem value={"Easy"}>Easy</MenuItem>
                          <MenuItem value={"Intermediate"}>
                            Intermediate
                          </MenuItem>
                          <MenuItem value={"Hard"}>Hard</MenuItem>
                        </Select>
                        <FormHelperText>
                          {complexityCountVisible
                            ? `${complexityCount} Questions Available`
                            : "Choose a complexity"}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  </div>
                </Grid>

                {/* Count Input */}
                <Grid item xs={12}>
                  <div>
                    <Box sx={{ minWidth: 270, maxWidth: 270 }}>
                      <FormControl fullWidth>
                        <TextField
                          sx={{ minWidth: 270, maxWidth: 270 }}
                          required
                          id="outlined-required"
                          label="Count Required"
                          autoComplete="off"
                          onChange={handleCountChange}
                          error={countError}
                          disabled={countDisable}
                          value={count !== null ? count : ""}
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
                          {countError
                            ? `There are ${complexityCount} questions available in the required category`
                            : "Number of questions required in this category"}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  </div>
                </Grid>

                <Grid item xs={12} sx={{ width: "100px" }}>
                  <div className="Skill_assessment_question_pick_add_button">
                    <div>
                      <Fab
                        onClick={validatePostingCount}
                        variant="extended"
                        disabled={!addButtonVisible}
                        size="small"
                        color="primary"
                        sx={{ width: "100px", fontWeight: "400" }}
                      >
                        Add
                      </Fab>
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>

            <div className="Skill_assessment_question_pick_admin_question_list">
              {questionListData.map((question) => (
                <ListItem
                  key={question.requestId} // Ensure each list item has a unique key
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteQuestionRequest(question)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ maxWidth: 300 }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <QuestionAnswerIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${question.category.categoryName}`}
                    secondary={`${question.level} - ${question.count} `}
                  />
                </ListItem>
              ))}
              <List></List>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="Skill_assessment_question_pick_admin_next_button">
                <Button
                  variant="contained"
                  onClick={handleBack}
                  color="primary"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#27235c",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#97247e",
                    },
                  }}
                >
                  Back
                </Button>
              </div>
              <div className="Skill_assessment_question_pick_admin_next_button">
                <Button
                  variant="contained"
                  onClick={handleNavigation}
                  color="primary"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#27235c",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#97247e",
                    },
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SkillQuestionPick;
