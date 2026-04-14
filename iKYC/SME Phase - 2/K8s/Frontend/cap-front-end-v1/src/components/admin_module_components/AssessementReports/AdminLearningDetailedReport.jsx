import React, { useEffect, useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Avatar,
  CardHeader,
  Card,
  Button,
  Modal,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import "../../../styles/admin_module_styles/DetailedReport.css";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Tooltip from "@mui/material/Tooltip";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { getAdminUserDetailReport } from "../../../services/admin_module_services/BatchReportService";
import AdminNavbar from "../AdminNavbar";
import { useNavigate } from "react-router-dom";

const AdminLearningDetailedReport = () => {
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [isAssessmentNameSelected, setIsAssessmentNameSelected] =
    useState(false);
  const [assessmentUserDetails, setAssessmentUserDetails] = useState([]);
  const [userId, setUserId] = useState("");
  const [userSelected, setUserSelected] = useState(false);
  const [detailedReports, setDetailedReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionsModalContent, setOptionsModalContent] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionModalContent, setQuestionModalContent] = useState("");
  const [name, setName] = useState("");
  const data = JSON.parse(sessionStorage.getItem("data"));
 

  useEffect(() => {
    callForGetDetailReport();
  }, []);

  const callForGetDetailReport = async () => {
    const userId = data.id;
    const schedulingId = data.ScheduledId;

    console.log("data", data);
    const detailedReportResponse = await getAdminUserDetailReport(
      schedulingId,
      userId
    );
    setDetailedReport(detailedReportResponse.data);
  };
  console.log(detailedReports);
  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleClickPrevious = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const openOptionsModal = (options) => {
    setOptionsModalContent(options);
    setShowOptionsModal(true);
  };

  const closeOptionsModal = () => {
    setShowOptionsModal(false);
  };

  const openQuestionModal = (question) => {
    setQuestionModalContent(question);
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
  };

  // const paginatedData = detailedReports.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const navigate = useNavigate();

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
  };

  const paginatedData = detailedReports.slice(
    (currentPage - 1) * rowsPerPage,
    (currentPage - 1) * rowsPerPage + rowsPerPage
  );

  const pageNumbers = Array.from(
    { length: Math.ceil(detailedReports.length / rowsPerPage) },
    (_, i) => i + 1
  );

  const setOptionsNull = () => {
    setAssessmentId("");
    setUserId("");
    setUserSelected(false);
    setIsAssessmentNameSelected(false);
  };

  const exportToExcel = () => {
    const reportsWithSno = detailedReports.map((report, index) => ({
      S_NO: index + 1,
      ...report,
    }));
    const ws = XLSX.utils.json_to_sheet(reportsWithSno);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detailed Report");
    XLSX.writeFile(wb, `${data.Name}_Detailed_Report.xlsx`);
  };
  const goBack = () => {
    // window.history.back();
    navigate(-1)
  };
  return (
    <div className="container-fluid d-flex m-0 p-0">
      <div>
        <AdminNavbar />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowX: "hidden",
          scrollbarWidth: "none",
          height: "100%",
          width: "100%",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "6%",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}>
          <Card
            id="learning-report-uppercard"
            elevation={3}
            sx={{
              height: "140px",
              padding: "10px",
              width: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}>
            <CardHeader
              title={
                <Box
                  // display="flex"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center">
                  <Typography
                    id="learning-report-title"
                    // variant="h5"
                    sx={{ color: "white", fontWeight: "500" }}>
                    Knowledge Assessment Detailed Report
                  </Typography>
                  <br></br>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      justifyItems: "",
                    }}>
                    <div>
                      {" "}
                      <Typography
                        id="learning-report-title"
                        variant="h5"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          justifyContent: "flex-start",
                        }}>
                        Name:{data.Name}
                      </Typography>
                    </div>
                    <div>
                      {" "}
                      <Typography
                        id="learning-report-title"
                        variant="h5"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          justifyContent: "flex-start",
                        }}>
                        Score:{data.Score}
                      </Typography>
                    </div>
                    <div>
                      {" "}
                      <Typography
                        id="learning-report-title"
                        variant="h5"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          justifyContent: "flex-start",
                        }}>
                        Result:{data.Result}
                      </Typography>
                    </div>
                  </div>
                </Box>
              }
            />

            <Grid container spacing={3} sx={{ mb: 2, ml: 5 }}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={5}>
                    <FormControl
                      id="learning-report-assessment-select"
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3 }}></FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "10px",
            alignItems: "center",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            style={{ padding: "10px" }}>
            Download Report <FileDownloadIcon />
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: "10px", padding: "10px" }}
            endIcon={<ReplyIcon />}
            // href="/knowledgeAssessmentreport"
            onClick={goBack}
            >
            Back
          </Button>
        </div>
        <div
          style={{
            // paddingRight: "50px",
            // paddingLeft: "10px",
            backgroundColor: "white",
            maxWidth: "1300px",
            // paddingRight: "-10%",
            width: "100%",
          }}>
          {/* <Card
            id="learning-report-tablecard"
            elevation={3}
            sx={{
              height: "auto",
              // width: "89%",
              marginTop: "1%",
              marginLeft: "1%",
              // paddingRight:""
              // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          > */}
          <div
            style={{
              width: "100%",
              maxWidth: "1800px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflowX: "hidden",
              scrollbarWidth: "none",
              alignContent: "center",
              marginLeft: "20px",
            }}>
            <>
              <TableContainer
                id="learning-admin-report-table"
                style={{
                  maxHeight: "auto",
                  overflowY: "auto",
                  width: "100%",
                  maxWidth: "auto",
                }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead id="learning-adminreport-tablehead">
                    <TableRow>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        // align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                        }}>
                        Topic
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Subtopic
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Question
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Question Type
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Complexity
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Option Given
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Selected Answers
                      </TableCell>
                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Evaluation Mark
                      </TableCell>

                      <TableCell
                        id="learning-adminreport-tablehead"
                        align="center"
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          whiteSpace: "nowrap",
                        }}>
                        Question Mark
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(paginatedData) &&
                      paginatedData.map((question, index) => (
                        <TableRow key={question.questionId} hover>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.topicName}
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.subtopicName}
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}>
                              <span
                                style={{
                                  maxWidth: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>
                                {question.question.length > 10
                                  ? `${question.question.substring(0, 15)}... `
                                  : question.question}
                              </span>
                              {question.question.length > 10 && (
                                <Button
                                  variant="text"
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    openQuestionModal(question.question)
                                  }
                                  style={{ marginLeft: "10px" }}>
                                  Read More
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.questionType}
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.complexity}
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                openOptionsModal(
                                  question.optionGiven.split(";")
                                )
                              }>
                              <label
                                style={{
                                  marginRight: "1%",
                                  marginBottom: "1%",
                                }}>
                                <VisibilityIcon />
                              </label>{" "}
                              Options
                            </Button>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              marginRight: "1%",
                            }}>
                            {question.selectedAnswers}{" "}
                            {question.evaluationMark === 1 ? (
                              <CheckIcon style={{ color: "green" }} />
                            ) : (
                              <ClearIcon style={{ color: "red" }} />
                            )}
                          </TableCell>
                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.evaluationMark}
                          </TableCell>

                          <TableCell align="center" style={{ fontSize: 14 }}>
                            {question.questionMark}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <Modal
                  open={showOptionsModal}
                  onClose={closeOptionsModal}
                  aria-labelledby="options-modal-title"
                  aria-describedby="options-modal-description">
                  <div id="learning-adminreport-options-modal">
                    <h2
                      id="learning-adminreport-options-modal-title"
                      style={{ marginBottom: "10px" }}>
                      Given Options
                    </h2>
                    <ol>
                      {optionsModalContent.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ol>
                  </div>
                </Modal>
                <Modal
                  open={showQuestionModal}
                  onClose={closeQuestionModal}
                  aria-labelledby="question-modal-title"
                  aria-describedby="question-modal-description">
                  <div id="learning-adminreport-readmore-modal">
                    <h2 id="learning-adminreport-readmore-modal-heading">
                      Full Question
                    </h2>
                    <p id="learning-adminreport-readmore-modal-content">
                      {questionModalContent}
                    </p>
                  </div>
                </Modal>
                <div className="text-center mt-4 mb-4">
                  <ul
                    className="pagination"
                    id="learning-assessment-pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                      id="learning-assessment-pagination">
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}>
                        <Tooltip title="PREVIOUS" placement="left">
                          <ArrowBackIosNewSharpIcon />
                        </Tooltip>
                      </button>
                    </li>
                    {pageNumbers.map((number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          number === currentPage ? "active" : ""
                        }`}
                        id="learning-assessment-pagination">
                        <button
                          id="learning_assessment_module_view_all_search_button_box"
                          onClick={() => paginate(number)}
                          className="page-link">
                          {number}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === pageNumbers.length ? "disabled" : ""
                      }`}
                      id="learning-assessment-pagination">
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}>
                        <Tooltip title="NEXT" placement="right">
                          <ArrowForwardIosSharpIcon />
                        </Tooltip>
                      </button>
                    </li>
                  </ul>

                  {/* Rows per page selector */}
                  <div className="d-flex justify-content-end">
                    <Tooltip title="ROW SELECTOR" placement="right">
                      <FormControl
                        className="rowsPerPage"
                        variant="outlined"
                        sx={{ mr: 1, width: 120, marginTop: -8 }}>
                        <InputLabel id="rowsPerPage-label">
                          Rows per page:
                        </InputLabel>
                        <Select
                          labelId="rowsPerPage-label"
                          id="rowsPerPage-select"
                          value={rowsPerPage}
                          onChange={handleChangeRowsPerPage}
                          label="Rows per page"
                          autoWidth>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </div>
                </div>
              </TableContainer>
            </>

            <div style={{ backgroundColor: "white" }}></div>
          </div>
          {/* </Card> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLearningDetailedReport;
