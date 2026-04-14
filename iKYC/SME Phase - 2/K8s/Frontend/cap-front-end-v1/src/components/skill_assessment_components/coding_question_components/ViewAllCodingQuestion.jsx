import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import SourceRoundedIcon from "@mui/icons-material/SourceRounded";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { toWords } from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FilterByCategoryQuestion,
  FilterByLevelQuestion,
  Question,
} from "../../../redux/actions/skill_assessment_actions/coding_question_actions/ViewCodeAction";
import {
  filterByCategory,
  filterByLevel,
  getAllCodingQuestion,
} from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import "../../../styles/skill_assessment_styles/coding_question_styles/ViewQuestionStyle.css";
import DeleteCodingQuestion from "./DeleteCodingQuestion";
import UpdateCodingQuestion from "./UpdateCodingQuestion";
import ViewCodingDescription from "./ViewCodingDescription";
import ViewCodingQuestion from "./ViewCodingQuestion";

/**
 *
 *  @author Vinolisha V ,Prem M
 *  @version  2.0
*   @since  04-09-2024
 * 
 */

const ViewAllCodingQuestion = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questionred.question);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestion, setFilteredQuestion] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [rowsPerPageOptions] = useState([5, 10, 25]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateItemId, setUpdateItemId] = useState(0);
  const [viewItemId, setViewItemId] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDescriptionDialogOpen, setViewDescriptionDialogOpen] =
    useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    getAllCodingQuestion()
      .then((response) => {
        dispatch(Question(response.data));
        const uniqueCategories = [];
        const uniqueLevels = [];

        response.data.forEach((obj) => {
          if (
            obj.category &&
            !uniqueCategories.some(
              (cat) => cat.categoryName === obj.category.categoryName
            )
          ) {
            uniqueCategories.push(obj.category);
          }
          if (obj.level && !uniqueLevels.includes(obj.level)) {
            uniqueLevels.push(obj.level);
          }
        });

        setCategoryOptions(uniqueCategories);
        setLevelOptions(uniqueLevels);
        setFilteredQuestion(response.data);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (questions) {
      setFilteredQuestion(questions);
    }
  }, [questions]);

  /*
   * handle search for search the Question by Question Title
   */
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.trim() !== "") {
      const filtered = questions.filter((question) =>
        question.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuestion(filtered);
    } else {
      setFilteredQuestion(questions);
    }
  };

  const handleCancelSearch = () => {
    setSearchTerm("");
    setFilteredQuestion(questions);
  };

  /*
   * Filter by Category and Levels for the user end
   */
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    setSelectedLevel("");

    if (selectedCategory !== "All") {
      filterByCategory(selectedCategory)
        .then((res) => {
          dispatch(FilterByCategoryQuestion(res.data));

          const uniqueLevels = [];
          res.data.forEach((obj) => {
            if (obj.level && !uniqueLevels.includes(obj.level)) {
              uniqueLevels.push(obj.level);
            }
          });
          setLevelOptions(uniqueLevels);


          setFilteredQuestion(res.data);
        })
        .catch((err) => {
          console.error("Error filtering by category:", err);
        });
    } else {

      getAllCodingQuestion()
        .then((response) => {
          dispatch(Question(response.data));
          setLevelOptions([]);
        })
        .catch((err) => {
          console.error("Error fetching all questions:", err);
        });
    }
  };

  const handleLevelChange = (event) => {
    const selectedLevel = event.target.value;
    setSelectedLevel(selectedLevel);
    if (selectedLevel !== "All") {
      filterByLevel(selectedCategory, selectedLevel)
        .then((res) => {
          dispatch(FilterByLevelQuestion(res.data));
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      filterByCategory(selectedCategory)
        .then((res) => {
          dispatch(FilterByCategoryQuestion(res.data));
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialogOpen(true);
    setDeleteItemId(id);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestion.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleUpdateClick = (id) => {
    setUpdateDialogOpen(true);
    setUpdateItemId(id);
  };

  const handleViewClick = (id) => {
    setViewDialogOpen(true);
    setViewItemId(id);
  };

  const handleViewCategoryClick = (id) => {
    setViewDescriptionDialogOpen(true);
    setViewItemId(id);
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/addcodingquestion");
  };

  /*
   * Speech recognisiation for voice search by Question Title.
   */
  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let speechResult = event.results[0][0].transcript;
      speechResult = speechResult.replace(/\.$/, "");
      speechResult = speechResult.replace(/\b\d+\b/g, (match) =>
        toWords(parseInt(match, 10))
      );

      setSearchTerm(speechResult);
      handleSearchChange({ target: { value: speechResult } });
    };

    recognition.start();
  };

  /**
   * This components conatins the overall CRUD operations of the view page
   */
  return (
    <Container maxWidth={"xl"} sx={{ my: 5 }}>
      <h2
        style={{ textAlign: "center", marginTop: "2%", marginBottom: "2%" }}
        className="code-head"
        data-testid="questionheadercheck"
      >
        Manage Skill Questions
      </h2>
      <div id="fixed-container">
        <Tooltip title="Add New Question" placement="top-start">
          <Button
            id="codeadd-question_button"
            onClick={handleNavigate}
            sx={{ fontSize: "12px" }}
          >
            Add Question
          </Button>
        </Tooltip>
        <FormControl
          variant="outlined"
          id="Code-filter-select"
          style={{ minWidth: 120, height: 40 }}
        >
          <InputLabel
            id="rows-per-page-label"
            style={{ fontSize: "0.875rem", lineHeight: 1.5 }}
          >
            Rows per Page
          </InputLabel>
          <Select
            labelId="rows-per-page-label"
            id="rows-per-page-select"
            value={itemsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Rows per Page"
            disabled={currentItems.length < 5}
            style={{
              height: 40,
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            flex: "1",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          <FormControl
            variant="outlined"
            className="Codefilter-select"
            sx={{
              mr: 1,
            }}
          >
            <InputLabel
              id="category-filter-label"
              sx={{ fontSize: "0.875rem", lineHeight: 1.5 }}
            >
              Filter by Category
            </InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
              sx={{
                height: 45,
                "& .MuiSelect-select": {
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  top: 2,
                },
              }}
            >
              <MenuItem key={"All"} value={"All"}>
                All
              </MenuItem>
              {categoryOptions.map((option) => (
                <MenuItem key={option.categoryId} value={option.categoryId}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategory && selectedCategory !== "All" && (
            <FormControl
              variant="outlined"
              className="Codefilter-select"
              sx={{
                mr: 1,
              }}
            >
              <InputLabel
                id="level-filter-label"
                sx={{ fontSize: "0.875rem", lineHeight: 1.5 }}
              >
                Filter by Level
              </InputLabel>
              <Select
                labelId="level-filter-label"
                id="level-filter"
                value={selectedLevel}
                onChange={handleLevelChange}
                label="Level"
                sx={{
                  height: 45,
                  "& .MuiSelect-select": {
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    top: 2,
                  },
                }}
              >
                <MenuItem key={"All"} value={"All"}>
                  All
                </MenuItem>
                {levelOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <Box
          sx={{ position: "relative", display: "inline-flex" }}
          id="code-search-box"
        >
          <input
            id="code-search-input"
            type="text"
            placeholder="Search Question Title"
            value={searchTerm}
            onChange={(e) => {
              handleSearchChange(e);
            }}
            style={{ paddingLeft: "3rem", paddingRight: "2.5rem" }}
          />
          <IconButton
            sx={{
              position: "absolute",
              left: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => {
              if (isListening) {
                setIsListening(false);
                recognitionRef.current.stop();
              } else {
                startListening();
              }
            }}
          >
            {isListening ? (
              <MicIcon color="primary" />
            ) : (
              <MicOffIcon color="action" />
            )}
          </IconButton>
          {searchTerm.trim() !== "" && (
            <IconButton
              sx={{
                position: "absolute",
                right: "1.0rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={handleCancelSearch}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </div>

      <TableContainer id="code-table" className="table-responsive">
        <Table
          sx={{ tableLayout: "fixed" }}
          id="code-tablebox"
          stickyHeader
          aria-label="sticky table"
          className="table"
        >
          <TableHead className="code-tablehead">
            <TableRow>
              <TableCell id="codetable-cell">Question No</TableCell>
              <TableCell id="codetable-cell">Question Title</TableCell>
              <TableCell id="codetable-cell">Category</TableCell>
              <TableCell id="codetable-cell">Level</TableCell>
              <TableCell id="codetable-cell-action-header">
                View Description
              </TableCell>
              <TableCell id="codetable-cell-action-header">
                View Files
              </TableCell>

              <TableCell id="codetable-cell-action-header">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((question, index) => {
                const questionNumber = indexOfFirstItem + index + 1;
                return (
                  <TableRow key={index} id="code-table-row">
                    <TableCell id="code-table-cell">{questionNumber}</TableCell>
                    <TableCell id="code-table-cell">
                      {question.questionTitle}
                    </TableCell>
                    <TableCell id="code-table-cell">
                      {question.category.categoryName}
                    </TableCell>
                    <TableCell id="code-table-cell">{question.level}</TableCell>

                    <TableCell id="code-table-cell-button">
                      <Tooltip
                        title="Detailed Question View"
                        placement="bottom-start"
                      >
                        <IconButton
                          variant="contained"
                          color="dark"
                          onClick={() =>
                            handleViewCategoryClick(question.questionId)
                          }
                        >
                          <RemoveRedEyeOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell id="code-table-cell-button">
                      <Tooltip
                        title="Question files View"
                        placement="bottom-start"
                      >
                        <IconButton
                          variant="contained"
                          onClick={() => handleViewClick(question.questionId)}
                        >
                          <SourceRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell id="code-table-cell-button">
                      <Tooltip title="Update Question" placement="bottom-start">
                        <IconButton
                          variant="contained"
                          id="updatecode-question"
                          onClick={() => handleUpdateClick(question.questionId)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Deletion Question"
                        placement="bottom-start"
                      >
                        <IconButton
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(question.questionId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow id="code-table-row">
                <TableCell colSpan={6} align="center" id="code-table-cell">
                  <h6>
                    <b>No record found</b>
                  </h6>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        id="code-pagination"
        count={Math.ceil(filteredQuestion.length / itemsPerPage)}
        page={currentPage}
        onChange={handleChangePage}
        variant="text"
        shape="rounded"
        color="primary"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "20px",
          "& .MuiPaginationItem-root": {
            borderRadius: "50%",
            margin: "0 4px",
          },
          "& .Mui-selected": {
            color: "white",
            backgroundColor: "#042557",
          },
        }}
      />

      {deleteDialogOpen && (
        <DeleteCodingQuestion
          flag={deleteDialogOpen}
          id={deleteItemId}
          setFlag={setDeleteDialogOpen}
        />
      )}
      {updateDialogOpen && (
        <UpdateCodingQuestion
          flag={updateDialogOpen}
          id={updateItemId}
          setFlag={setUpdateDialogOpen}
        />
      )}
      {viewDialogOpen && (
        <ViewCodingQuestion
          flag={viewDialogOpen}
          id={viewItemId}
          setFlag={setViewDialogOpen}
        />
      )}
      {viewDescriptionDialogOpen && (
        <ViewCodingDescription
          flag={viewDescriptionDialogOpen}
          id={viewItemId}
          setFlag={setViewDescriptionDialogOpen}
        />
      )}
    </Container>
  );
};

export default ViewAllCodingQuestion;
