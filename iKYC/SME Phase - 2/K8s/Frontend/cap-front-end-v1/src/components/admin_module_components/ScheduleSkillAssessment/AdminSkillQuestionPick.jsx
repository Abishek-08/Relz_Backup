import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { TextField } from '@mui/material';
import { MenuItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import { addQuestionRequest, deleteQuestion, getCategoryList, getLanguageList, getQuestions, validateCategoryQuestionCount, validateLangaugeQuestionCount, validateQuestionCount } from '../../../services/admin_module_services/AdminSkillAssessmentService';
import { Alert } from '@mui/material';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { ToastContainer, toast } from 'react-toastify';
import AdminSkillAssessmentQuestionPick from '../../../styles/admin_module_styles/skill_assessment_schedule_admin/AdminSkillAssessmentQuestionPick.css';
import { useNavigate } from 'react-router-dom';

const AdminSkillQuestionPick = () => {
    // Tabs Switch and its states
    const [value, setValue] = useState('one');

    // Skill Assessment Id from Session
    const skillAssessment = JSON.parse(sessionStorage.getItem("skillAssessment"));

    const skillAssessmentId = skillAssessment.skillAssessmentId;

    // Total Questions and its State
    const [totalQuestions, setTotalQuestions] = useState(null);
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
            skillAssessmentId: skillAssessmentId,
        },
        category: {
            categoryId: 0,
        },
    });

    //Use Navigate hook

    const navigate = useNavigate();

    // Load Language List on Component Mount
    useEffect(() => {
        const fetchLanguageList = async () => {
            try {
                const response = await getLanguageList();
                setLanguageList(response.data);
            } catch (error) {
                console.error('Error fetching language list:', error);
            }
        };

        fetchLanguageList();
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
        setCountError(false)

        if (input === null || input === '') {
            setTotalQuestions(null);
            setTotalQuestionsError(false);
        } else if (/^[1-9]$|^10$/.test(input)) {
            // Valid input (1-10)
            setTotalQuestions(parseInt(input, 10));
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

            await categoryListLoader(languageId);
        } catch (error) {
            console.error('Error validating language question count:', error);
        }
    };

    // Load Category List for a Language
    const categoryListLoader = async (languageId) => {
        try {
            const response = await getCategoryList(languageId);
            setCategoryList(response.data);
        } catch (error) {
            console.error('Error fetching category list:', error);
        }
    };

    // Handle Category Change
    const handleCategoryChange = async (event) => {
        const categoryId = event.target.value;
        setCategoryValue(categoryId);

        setComplexityCountVisible(false)
        setCountError(false)

        setRequest({
            ...request,
            category: { ...request.category, categoryId: categoryId },
        });

        const selectedCategory = categoryList.find(
            (cate) => cate.categoryId === parseInt(categoryId, 10)
        );
        setCategoryName(selectedCategory.categoryName);

        try {
            const response = await validateCategoryQuestionCount(languageId, categoryId);
            setCategoryQuestionCount(response.data);
            setCategoryCountVisible(true);
            setCountDisable(true); // Disable the Question count field when its category is changed
            setCount(null); // Reset the Count field when category is changed
        } catch (error) {
            console.error('Error validating category question count:', error);
        }
    };

    // Handle Complexity Change
    const handleComplexityChange = async (event) => {
        const complexity = event.target.value;
        setComplexityValue(complexity);
        setCountError(false)
        // Reset count when complexity changes
        setCount(null);

        setRequest({
            ...request,
            level: complexity,
            skillassessment: {
                ...request.skillassessment,
                skillAssessmentId: skillAssessmentId,
            },
        });

        try {
            const response = await validateQuestionCount(languageId, categoryValue, complexity);
            setComplexityCount(response.data);
            setComplexityCountVisible(true);
            setCountDisable(false);
        } catch (error) {
            console.error('Error validating question count:', error);
        }
    };


    // Handle Count Change
    const handleCountChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue <= complexityCount && inputValue > 0 && /^[1-9]$|^10$/.test(inputValue)) {
            setCount(inputValue);
            setRequest({
                ...request,
                count: inputValue,
            });
            setCountError(false);
            setAddButtonVisible(true)


        } else {
            // When inputValue is greater than complexityCount or invalid
            setCountError(true);
            setAddButtonVisible(true); // Assuming this controls visibility of an add button
            setAddButtonVisible(false);

            // Set the count to the maximum available if it exceeds complexityCount
            if (inputValue > complexityCount) {
                setCount(complexityCount);
                setRequest({
                    ...request,
                    count: complexityCount,
                });
            } else {
                setCount(inputValue);
                setRequest({
                    ...request,
                    count: inputValue,
                });
            }
        }
    };

    //Verify Question

    const getQuestionData = async () => {
        try {
            const response = await getQuestions(skillAssessmentId);
            const questionData = response.data;
            setQuestionListData(questionData);
            console.log(response.data)

            let totalCount = 0;

            for (let i = 0; i < questionData.length; i++) {
                totalCount += questionData[i].count;
            }

            // console.log("Total Count from DB:", totalCount);

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

            // Check if totalCountToAdd is less than or equal to totalQuestions
            if (totalCountToAdd <= totalQuestions) {
                // Proceed with adding the question request
                const response = await addQuestionRequest(request);
                // Handle success scenario if needed

                getQuestionData();
                setCount(null) //to clear the input field so that previous states input cannot be posted.
                setAddButtonVisible(false)

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
                })
            }

            return; // Do not proceed with the submission

        } catch (error) {
            console.error("Error submitting question:", error);
            // Handle error scenario if needed
        }
    };


    //Delete Questions
    const deleteQuestionrequest = async (requestId) => {
        await deleteQuestion(requestId);

        const response = await getQuestions(skillAssessmentId);
        const updatedQuestionData = response.data;
        setQuestionListData(updatedQuestionData);
    };

    //Validate whether posting question is matching upto the count
    const validatePostingCount = async () => {
        
        try {
            // Fetch existing questions data
            const questionData = await getQuestionData();
            console.log(questionListData)
            // Find if there's an existing question matching the current request
            const foundObject = questionListData.find(
                (object) =>
                    // object.category.language.langaugeName === request.category.language.langaugeName &&
                    object.category.categoryId === request.category.categoryId &&
                    object.level === request.level
            );

            if (foundObject) {
                // If a matching question is found, check if adding `request.count` exceeds available questions
                const addedCount = foundObject.count + +request.count;
                console.log("foundobject count", foundObject.count);
                console.log("request count", request.count)
                console.log('addedCount', addedCount)
                console.log("complexityCount", complexityCount)
                if (addedCount > complexityCount) {
                    // Display error if adding exceeds available questions
                    toast.error("Required question count exceeds available questions in this category", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
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

        console.log("database count" , databaseCount);
        console.log("count", totalQuestions)
        // Calculate the total count to be added

        if(databaseCount == totalQuestions) {
            sessionStorage.setItem("activeStep", activeStep);
            navigate("/assessmentscheduling")
        }
        else{
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
    }



    // Render Component
    return (
        <div className='Skill_assessment_question_pick_admin_parent'>
            <div className='Skill_assessment_question_pick_admin_tab'>
                <div className='Skill_assessment_question_pick_total_field'>
                    {/* Total Questions Input */}
                    <div>
                        <Box sx={{ minWidth: 270, minHeight: 100, maxHeight: 100, maxWidth: 270  }}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-required"
                                    label="Total Question"
                                    type="number"
                                    value={totalQuestions}
                                    placeholder="[1-10]"
                                    onChange={totalChange}
                                    error={totalQuestionsError}
                                    autoComplete="off"
                                    helperText={
                                        totalQuestionsError
                                            ? 'Total should be between 1-10'
                                            : 'Total Questions required'
                                    }
                                />
                            </FormControl>
                        </Box>
                    </div>
                </div>

                <div className='Skill_assessment_question_pick_category_field'>

                    {/* Language Dropdown */}
                    <div>
                        <Box sx={{ minWidth: 120, minHeight: 100, maxHeight: 100, maxWidth: 120 }}>
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
                                        <MenuItem key={lang.languageId} value={lang.languageId}>
                                            {lang.languageName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {languageCountVisible ? `${languageQuestionCount} Questions Available` : "Choose a Language"}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <Box sx={{ minWidth: 120, maxWidth: 120 }}>
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
                                        <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {categoryCountVisible ? `${categoryQuestionCount} Questions Available` : "Choose a category"}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </div>

                    {/* Complexity Dropdown */}
                    <div>
                        <Box sx={{ minWidth: 120, maxWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="complexity-label">Complexity</InputLabel>
                                <Select
                                    labelId="complexity-label"
                                    id="complexity-select"
                                    value={complexityValue}
                                    label="Select Complexity"
                                    onChange={handleComplexityChange}
                                    disabled={complexityDisable}
                                >
                                    <MenuItem value={"Easy"}>Easy</MenuItem>
                                    <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                                    <MenuItem value={"Hard"}>Hard</MenuItem>
                                </Select>
                                <FormHelperText>
                                    {complexityCountVisible ? `${complexityCount} Questions Available` : "Choose a complexity"}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </div>

                    {/* Count Input */}
                    <div>
                        <Box sx={{ minWidth: 220, minHeight: 100, maxHeight: 100, maxWidth: 220  }}>
                            <FormControl fullWidth>
                                <TextField
                                    sx={{ minWidth: 270, maxWidth: 270 }}
                                    required
                                    id="outlined-required"
                                    type="number"
                                    label="Count Required"
                                    autoComplete="off"
                                    onChange={handleCountChange}
                                    error={countError}
                                    disabled={countDisable}
                                    value={count !== null ? count : ''}
                                />
                                <FormHelperText>
                                    {countError ? `There are ${complexityCount} questions available in the required category` : "Number of questions required in this category"}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </div>
                </div>

                <div className='Skill_assessment_question_pick_add_button'>
                   
                        <div>
                            <Fab onClick={validatePostingCount} variant="extended" disabled = {!addButtonVisible} size="small" color="primary">
                                Add Question
                            </Fab>
                        </div>

                </div>

                <div className="Skill_assessment_question_pick_admin_question_list">
                    {questionListData.map((question) => (
                        <ListItem
                            key={question.requestId} // Ensure each list item has a unique key
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => deleteQuestionrequest(question.requestId)}
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
                                primary={`${question.category.language.languageName} - ${question.category.categoryName}`}
                                secondary={`${question.level} - ${question.count}`}
                            />
                        </ListItem>
                    ))}
                </div>
                <div className="Skill_assessment_question_pick_admin_next_button">
                    <Button variant="contained" onClick={handleNavigation} color="primary" >Next</Button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminSkillQuestionPick;
