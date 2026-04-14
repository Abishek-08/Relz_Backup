import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  deleteQuestionAction,
  getAllLearningAction,
  fetchTopics,
} from "../../redux/actions/learning_assesment_actions/Action";
import { deleteQuestion } from "../../services/learning_assessment_service/View_All_Questions_Answers/DeleteService";
import {
  disableQuestion,
  enableQuestion,
} from "../../services/learning_assessment_service/View_All_Questions_Answers/DisableService";
import {
  getAllQuestionsAndAnswers,
  getQuestionsById,
} from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import "../../styles/learning_assessment_styles/GetAllLearningAssessment.css";
import { getAllCorrectOptions } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import { getAllTopics } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import { getTopicQuestions } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import { getSubTopicQuestions } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { getComplexityQuestions } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import { getQuestionTypeQuestions } from "../../services/learning_assessment_service/View_All_Questions_Answers/UpdateService";
import NoRecordImgae from "../../assets/learning-module-assets/NoRecord.webp";

function GetAllLearningAssessment() {
  const dispatch = useDispatch();
  const [questionArray, setQuestionArray] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [deleteQnsId, setDeleteQnsId] = useState(0);
  const [disableQnsId, setDisableQnsId] = useState(0);
  const [count, setCount] = useState(0);
  const [topicName, setTopicName] = useState("");
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [content, setContent] = useState("");
  const [correctOptions, setCorrectOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [selectedComplexity, setSelectedComplexity] = useState(null);
  const [, setSelectedQuestionType] = useState(null);
  const [topic, setTopic] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [complexitys, setComplexitys] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (id) => {
    setDeleteQnsId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDisableModal = () => setShowDisableModal(false);
  const handleShowDisableModal = (id) => {
    setDisableQnsId(id);
    setShowDisableModal(true);
  };

  const handleCloseOptionsModal = () => setShowOptionsModal(false);
  const handleShowOptionsModal = async (options, questionId) => {
    try {
      console.log(questionId);
      const correctAnswers = await getAllCorrectOptions(questionId);
      console.log(correctAnswers);
      setCorrectOptions(correctAnswers);
      setOptions(options);
      setShowOptionsModal(true);
    } catch (error) {
      console.error("Error fetching correct options:", error);
    }
  };

  const handleCloseQuestionModal = () => setShowQuestionModal(false);
  const handleShowQuestionModal = async (content, questionId) => {
    try {
      const questionContent = await getQuestionsById(questionId);
      setContent(questionContent);
      setShowQuestionModal(true);
    } catch (error) {
      console.error("Error fetching question", error);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteQuestion(deleteQnsId);
      dispatch(deleteQuestionAction(deleteQnsId));
      setQuestionArray((prevQuestions) =>
        prevQuestions.filter((question) => question.questionId !== deleteQnsId)
      );
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleDisable = () => {
    setShowDisableModal(false);
    disableQuestion(disableQnsId).then(() => {
      setCount((prevCount) => prevCount + 1);
    });
  };

  const handleEnable = (questionId) => {
    enableQuestion(questionId).then(() => {
      setCount((prevCount) => prevCount + 1);
    });
  };

  // Handle Topic Change Used for Topic Operations
  const handleTopicChange = async (topicId) => {
    setSelectedTopicId(topicId);
    const tempTopic = topic.find((data) => data.topicId == topicId);
    console.log("tempTopic: " + tempTopic);
    setTopicName(tempTopic === undefined ? "All" : tempTopic.topicName);
    console.log(topicId);
    if (topicId !== "All") {
      try {
        const data = await getTopicQuestions(topicId);
        setQuestionArray(data);
        dispatch(getAllLearningAction(data));
        // Extract distinct subtopics from questions array
        const uniqueSubtopics = [
          ...new Set(data.map((question) => question.subtopicId)),
        ].map((subtopicId) =>
          data.find((question) => question.subtopicId === subtopicId)
        );
        setSubtopics(uniqueSubtopics);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    } else {
      const data = await getAllQuestionsAndAnswers();
      dispatch(getAllLearningAction(data));
      setQuestionArray(data);
    }
  };

  // Handle Subtopic Change Used for Subtopic Operations
  const handleSubtopicChange = async (subId) => {
    setSelectedSubtopicId(subId);
    if (subId !== "All") {
      try {
        const data = await getSubTopicQuestions(selectedTopicId, subId);
        console.log(data);
        setQuestionArray(data);
        dispatch(getAllLearningAction(data));
        // Extract distinct subtopics from questions array
        const uniqueComplexity = [
          ...new Set(data.map((question) => question.complexity)),
        ].map((complexity) =>
          data.find((question) => question.complexity === complexity)
        );
        setComplexitys(uniqueComplexity);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    } else {
      const data = await getTopicQuestions(selectedTopicId);
      setQuestionArray(data);
      dispatch(getAllLearningAction(data));
    }
  };

  // Handle Subtopic Change Used for Complexity Operations
  const handleComplexityChange = async (complexity) => {
    setSelectedComplexity(complexity);
    if (complexity !== "All") {
      try {
        const data = await getComplexityQuestions(
          selectedTopicId,
          selectedSubtopicId,
          complexity
        );
        setQuestionArray(data);
        dispatch(getAllLearningAction(data));
        // Extract distinct subtopics from questions array
        const uniqueQuestionType = [
          ...new Set(data.map((question) => question.questionType)),
        ].map((questionType) =>
          data.find((question) => question.questionType === questionType)
        );
        setQuestionTypes(uniqueQuestionType);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    } else {
      const data = await getSubTopicQuestions(
        selectedTopicId,
        selectedSubtopicId
      );
      setQuestionArray(data);
      dispatch(getAllLearningAction(data));
    }
  };

  // Handle QuestionType Change Used for QuestionType Operations
  const handleQuestionTypeChange = async (qType) => {
    setSelectedQuestionType(qType);
    if (qType !== "All") {
      try {
        const data = await getQuestionTypeQuestions(
          selectedTopicId,
          selectedSubtopicId,
          selectedComplexity,
          qType
        );
        setQuestionArray(data);
        dispatch(getAllLearningAction(data));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    } else {
      const data = await getComplexityQuestions(
        selectedTopicId,
        selectedSubtopicId,
        selectedComplexity
      );
      setQuestionArray(data);
      dispatch(getAllLearningAction(data));
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getAllQuestionsAndAnswers();
        console.log(data);
        const topicData = await getAllTopics();
        dispatch(getAllLearningAction(data));
        dispatch(fetchTopics(topicData));
        setTopic(topicData);
        setQuestionArray(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [dispatch, count]);

  const filteredQuestions = questionArray.filter((question) =>
    question.content.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination offsets
  const indexOfLastQuestion = currentPage * rowsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - rowsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle rows per page change
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredQuestions.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleFilterClear = () => {
    setSelectedTopicId("All");
    setTopicName("All");
    setSelectedSubtopicId(null);
    setSelectedQuestionType(null);
    setSelectedComplexity(null);
    setCount(count + 1);
    //handleTopicChange("All"); // This will trigger the handleTopicChange function with "All"
  };

  return (
    <div id="learning_assessment_view_all_container">
      <h4
        id="learning_assessment_view_all_h2"
        className="text-center mt-4 mb-4"
      >
        KNOWLEDGE ASSESSMENT QUESTION BANK
      </h4>

      <div id="Get_all_Learning_Assessment_Search" className="input-group">
        <div className="form-outline" data-mdb-input-init>
          <input
            type="search"
            id="form1"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Question"
            className="form-control"
          />
        </div>
        <button
          type="button"
          id="learning_assessment_module_view_all_search_button"
          className="btn"
          data-mdb-ripple-init
        >
          <i className="fas fa-search" style={{ color: "#27235c" }}></i>
        </button>
      </div>
      <>
        <div>
          <a
            id="learning-assessment-add-ques-button-view-all-page"
            type="button"
            class="btn btn-outline-primary btn-sm"
            href="addSingleQuestion"
          >
            Add Single Question
            <i
              class="fa fa-plus"
              id="learning-assessment-view-all-plus-icon"
              aria-hidden="true"
            ></i>
          </a>
        </div>
        <div id="learning_assessment_view_all_filter">
          <Grid item xs={12}>
            {/* Topic dropdown */}
            <FormControl
              variant="outlined"
              className="learningfilter-select"
              sx={{ mr: 1, width: 150 }}
            >
              <InputLabel id="topic-filter-label">Topic</InputLabel>
              <Select
                labelId="topic-filter-label"
                id="topic-filter"
                onChange={(e) => handleTopicChange(e.target.value)}
                label="Topic"
                renderValue={() => topicName}
              >
                <MenuItem key={"All"} value={"All"}>
                  {" "}
                  All{" "}
                </MenuItem>
                {topic.map((topic) => (
                  <MenuItem key={topic.topicId} value={topic.topicId}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTopicId && selectedTopicId !== "All" && (
              <FormControl
                variant="outlined"
                className="learningfilter-select"
                sx={{ mr: 1, width: 150 }}
              >
                <InputLabel id="subtopic-filter-label">Subtopic</InputLabel>
                <Select
                  labelId="subtopic-filter-label"
                  id="subtopic-filter"
                  onChange={(e) => handleSubtopicChange(e.target.value)}
                  label="Subtopic"
                >
                  <MenuItem key={"All"} value={"All"}>
                    All
                  </MenuItem>
                  {subtopics.map((sub) => (
                    <MenuItem key={sub.subtopicId} value={sub.subtopicId}>
                      {sub.subtopicName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedSubtopicId && selectedSubtopicId !== "All" && (
              <FormControl
                variant="outlined"
                className="learningfilter-select"
                sx={{ mr: 1, width: 150 }}
              >
                <InputLabel id="subtopic-filter-label">Complexity</InputLabel>
                <Select
                  labelId="subtopic-filter-label"
                  id="subtopic-filter"
                  onChange={(e) => handleComplexityChange(e.target.value)}
                  label="Complexity"
                >
                  <MenuItem key={"All"} value={"All"}>
                    All
                  </MenuItem>
                  {complexitys.map((sub) => (
                    <MenuItem key={sub.complexity} value={sub.complexity}>
                      {sub.complexity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedComplexity && selectedComplexity !== "All" && (
              <FormControl
                variant="outlined"
                className="learningfilter-select"
                sx={{ mr: 1, width: 150 }}
              >
                <InputLabel id="subtopic-filter-label">
                  Question Type
                </InputLabel>
                <Select
                  labelId="subtopic-filter-label"
                  id="subtopic-filter"
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  label="Question Type"
                >
                  <MenuItem key={"All"} value={"All"}>
                    All
                  </MenuItem>
                  {questionTypes.map((qType) => (
                    <MenuItem
                      key={qType.questionType}
                      value={qType.questionType}
                    >
                      {qType.questionType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl
              variant="outlined"
              className="learningfilter-select"
              sx={{ mr: 1, width: 30, height: 55, pt: 1 }}
            >
              <div>
                <Tooltip title="Clear Filters" placement="top">
                  <Button
                    variant="text"
                    onClick={handleFilterClear}
                    sx={{ pb: 2 }}
                  >
                    <FilterAltOffIcon
                      style={{
                        color: "#27235c",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </Button>
                </Tooltip>
              </div>
            </FormControl>
          </Grid>
        </div>
      </>

      <div>
        {currentQuestions.length === 0 ? (
          <div id="learning-assessment-view-all-record-card">
            <div>
              <img
                src={NoRecordImgae}
                style={{ width: "200px", height: "200px" }}
              ></img>
              <h5>No Record Found</h5>
            </div>
          </div>
        ) : (
          <table
            id="learning_assessment_view_all_table"
            className="table table-hover"
          >
            <thead className="thead-dark">
              <tr>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  QNo
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Questions
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Complexity
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Topic
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Sub-Topic
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Options
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Mark
                </th>
                <th
                  scope="col"
                  id="learning_assessment_view_all_table_th"
                  className="text-center"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody id="learning_assessment_view_all_table_body">
              {currentQuestions.map((question, index) => (
                <tr key={question.questionId}>
                  <td className="text-center" id="learning_assessment_view_all_table_td">
                    {indexOfFirstQuestion + index + 1}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }} id="learning_assessment_view_all_table_td">
                    {question.content.length > 50 ? (
                      <>
                        {`${question.content.substring(0, 50)}...`}
                        <button
                          style={{ color: "#27235c" }}
                          type="button"
                          className="btn btn-link"
                          onClick={() =>
                            handleShowQuestionModal(
                              question.content,
                              question.questionId
                            )
                          }
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      question.content
                    )}
                  </td>
                  <td className="text-center" id="learning_assessment_view_all_table_td">{question.complexity}</td>
                  <td className="text-center" id="learning_assessment_view_all_table_td">{question.topicName}</td>
                  <td className="text-center" id="learning_assessment_view_all_table_td" style={{ whiteSpace: "nowrap" }}>
                    {question.subtopicName}
                  </td>
                  <td className="text-center" id="learning_assessment_view_all_table_td">
                    <Tooltip title="view options" placement="top">
                      <VisibilityIcon
                        style={{ whiteSpace: "nowrap", color: "#27235c",cursor:"pointer" }}
                        onClick={() => {
                          handleShowOptionsModal(
                            question.optionContents,
                            question.questionId
                          );
                        }}
                      />
                    </Tooltip>
                  </td>
                  <td className="text-center" id="learning_assessment_view_all_table_td">{question.mark}</td>
                  <td className="text-center" id="learning_assessment_view_all_table_td" style={{ whiteSpace: "nowrap" }}>
                    <div className="btn-group" id="action-buttons">
                      {question.isActive === "yes" ? (
                        <div>
                          <Tooltip title="Edit Question" placement="top">
                            <Link
                              to={`/SingleQuestionUpdate/${question.questionId}`}
                              className="btn btn-outline-secondary btn-sm ms-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                />
                              </svg>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Delete Question" placement="top">
                            <button
                              title="Delete"
                              className="btn btn-outline-danger btn-sm ms-2"
                              onClick={() =>
                                handleShowDeleteModal(question.questionId)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash3"
                                viewBox="0 0 16 16"
                              >
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                              </svg>
                            </button>
                          </Tooltip>
                          <Tooltip title="Disable Question" placement="top">
                            <button
                              className="btn btn-outline-warning btn-sm ms-2"
                              onClick={() =>
                                handleShowDisableModal(question.questionId)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-slash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      ) : (
                        <div>
                          <Tooltip title="Enable Question" placement="top">
                            <button
                              className="btn btn-success btn-sm ms-2"
                              onClick={() => handleEnable(question.questionId)}
                              title="Enable"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="text-center mt-4 mb-4">
        <ul className="pagination" id="learning-assessment-pagination">
          <li
            className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            id="learning-assessment-pagination"
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
              style={{ backgroundColor: "#27235c" }}
            >
              <Tooltip title="PREVIOUS" placement="left">
                <ArrowBackIosNewSharpIcon />
              </Tooltip>
            </button>
          </li>
          {pageNumbers.map((number) => {
            if (number === 1) {
              return (
                <li
                  key={number}
                  className={`page-item ${
                    number === currentPage ? "active" : ""
                  }`}
                  id="learning-assessment-pagination"
                >
                  <button
                    id="learning_assessment_module_view_all_search_button_box"
                    onClick={() => paginate(number)}
                    className="page-link"
                  >
                    {number}
                  </button>
                </li>
              );
            }
            if (number - currentPage === 1 && number !== 1) {
              return (
                <li key={number} className="page-item">
                  <span className="page-link">...</span>
                </li>
              );
            }
            if (number >= currentPage - 2 && number <= currentPage + 2) {
              return (
                <li
                  key={number}
                  className={`page-item ${
                    number === currentPage ? "active" : ""
                  }`}
                  id="learning-assessment-pagination"
                >
                  <button
                    id="learning_assessment_module_view_all_search_button_box"
                    onClick={() => paginate(number)}
                    className="page-link"
                  >
                    {number}
                  </button>
                </li>
              );
            }
            return null;
          })}
          <li
            className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
              style={{ backgroundColor: "#27235c" }}
              disabled={currentPage === pageNumbers.length}
            >
              <Tooltip title="NEXT" placement="right">
                <ArrowForwardIosSharpIcon />
              </Tooltip>
            </button>
          </li>
        </ul>

        {/* Rows per page selector */}
        <div className="d-flex justify-content-end">
          <Tooltip title="ROW SELECTOR" placement="top">
            <FormControl
              className="rowsPerPage"
              variant="outlined"
              sx={{
                mr: 1,
                width: 120,
                marginTop: -8,
              }}
            >
              <InputLabel id="rowsPerPage-label">Rows per page:</InputLabel>
              <Select
                labelId="rowsPerPage-label"
                id="rowsPerPage-select"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Rows per page"
                autoWidth
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </div>
      </div>

      {/* Show Question Content */}
      <Modal
        show={showQuestionModal}
        onHide={handleCloseQuestionModal}
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title style={{fontWeight:'bold'}}>Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseQuestionModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Question Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}
      backdrop="static"
       centered>
        <Modal.Header >
          <Modal.Title style={{fontWeight:'bold'}}>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Disable Question Modal */}
      <Modal show={showDisableModal} onHide={handleCloseDisableModal}
      backdrop="static"
      centered>
        <Modal.Header >
          <Modal.Title style={{fontWeight:'bold'}}>Disable Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to disable this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDisableModal}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleDisable}>
            Disable
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Options Modal */}
      <Modal show={showOptionsModal} onHide={handleCloseOptionsModal} 
      backdrop="static"
      centered>
        <Modal.Header >
          <Modal.Title style={{fontWeight:'bold'}}>Question Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            {options.map((option, index) => (
              <li
                key={index}
                className={
                  correctOptions.includes(option)
                    ? "learning_assessment_text_success"
                    : ""
                }
              >
                {option}
              </li>
            ))}
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOptionsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GetAllLearningAssessment;
