import React, { useEffect, useState } from 'react';
import { getAllAssessmentName, getAssessmentUserDetails, getUserDetailReport } from '../../services/learning_assessment_service/LearningDetailedReportAdminSideService';
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Typography, Avatar, CardHeader, Card, Button, Modal } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import "../../styles/learning_assessment_styles/LearningDetailReportAdminSide.css";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Tooltip from "@mui/material/Tooltip";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import * as XLSX from 'xlsx';

const LearningDetailReportAdminSide = () => {
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [assessmentId, setAssessmentId] = useState('');
  const [isAssessmentNameSelected, setIsAssessmentNameSelected] = useState(false);
  const [userName, setUserName] = useState('');
  const [assessmentUserDetails, setAssessmentUserDetails] = useState([]);
  const [userId, setUserId] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [detailedReports, setDetailedReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionsModalContent, setOptionsModalContent] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionModalContent, setQuestionModalContent] = useState('');

  useEffect(() => {
    callForGetAllAssessmentName();
  }, []);

  const callForGetAllAssessmentName = async () => {
    const assessmentDetailsResponse = await getAllAssessmentName();
    setAssessmentDetails(assessmentDetailsResponse.data);
  };

  const setAssessmentNameDeatil = (assessmentId) => {
    setIsAssessmentNameSelected(true);
    setAssessmentId(assessmentId);
    setUserId('');
    callForGetAllAssessmentUserName(assessmentId);
  };

  const setUserDetail = (userId) => {
    setUserId(userId);
    setUserSelected(true);
    callForGetDetailReport(assessmentId, userId);
  };

  const callForGetAllAssessmentUserName = async (assessmentId) => {
    const assessmentUsersDetails = await getAssessmentUserDetails(assessmentId);
    setAssessmentUserDetails(assessmentUsersDetails.data);
  };

  const callForGetDetailReport = async (assessmentId, userId) => {
    const detailedReportResponse = await getUserDetailReport(assessmentId, userId);
    setDetailedReport(detailedReportResponse.data);
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const paginatedData = detailedReports.slice(
    (currentPage - 1) * rowsPerPage,
    (currentPage - 1) * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(detailedReports.length / rowsPerPage);

  const getVisiblePages = () => {
    let pages = [];
    if (totalPages <= 2) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push('...');
      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  const setOptionsNull = () => {
    setAssessmentId('');
    setUserId('');
    setUserSelected(false);
    setIsAssessmentNameSelected(false);
  };

  const exportToExcel = () => {
    const reportsWithSno = detailedReports.map((report, index) => ({ sno: index + 1, ...report }));
    const ws = XLSX.utils.json_to_sheet(reportsWithSno);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detailed Report');
    XLSX.writeFile(wb, `${userName}.xlsx`);
  };

  return (
    <div>
      <div>
        <Card id="learning-report-uppercard" elevation={3} sx={{ height: "20%", marginTop: "7%", marginLeft: "10%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }} id="learning-report-title">
                <ReceiptLongIcon />
              </Avatar>
            }
            title={
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography id="learning-report-title" variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  KNOWLEDGE DETAILED REPORT
                </Typography>
                {userSelected &&
                  <Button variant="contained" id='learning-adminsidereport-download-report' onClick={exportToExcel} sx={{ mt: 1 }}>
                    Download Report <FileDownloadIcon />
                  </Button>
                }
              </Box>
            }
            sx={{ pb: 0, paddingLeft: "35%" }}
          />
          <Grid container spacing={3} sx={{ mb: 2, ml: 5 }}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={5}>
                  <FormControl id="learning-report-assessment-select" fullWidth variant="outlined" sx={{ mt: 3 }}>
                    <InputLabel id="learning-report-assessment-label" sx={{ '&.MuiInputLabel-shrink': { transform: 'translate(14px, -30px) scale(1)' } }}>
                      Select Assessment Name
                    </InputLabel>
                    <Select
                      labelId="assessment-label"
                      id="learning-report-assessment-select"
                      onChange={(e) => {
                        setAssessmentNameDeatil(e.target.value)
                        setUserName(e.target.text);
                      }}
                      value={assessmentId}

                      label="Select Assessment"
                      required
                      sx={{ textAlign: 'left', border: '1px solid white !important', '& .MuiOutlinedInput-notchedOutline': { legend: { width: 'auto' } } }}
                    >
                      {assessmentDetails.map((assessment, index) => (
                        <MenuItem key={index} value={assessment.schedulingId}>
                          {assessment.assessment.assessmentName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {isAssessmentNameSelected &&
                  <Grid item xs={5}>
                    <FormControl id="learning-report-assessment-select" fullWidth variant="outlined" sx={{ mt: 3 }}>
                      <InputLabel id="learning-report-assessment-label" sx={{ '&.MuiInputLabel-shrink': { transform: 'translate(14px, -30px) scale(1)' } }}>
                        Select User
                      </InputLabel>
                      <Select
                        labelId="user-label"
                        id="learning-report-assessment-select"
                        onChange={(e) => {
                          const selectedUser = assessmentUserDetails.find((assessment) => assessment.userId === e.target.value);
                          setUserDetail(e.target.value);
                          setUserName(selectedUser.userName);
                        }}
                        value={userId}
                        label="Select Candidate"
                        required
                        sx={{ textAlign: 'left', border: '1px solid white !important' }}
                      >
                        {assessmentUserDetails.map((assessment, index) => (
                          <MenuItem key={index} value={assessment.userId}>
                            {assessment.userName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                }
                <Grid item xs={2}>
                  {isAssessmentNameSelected &&
                    <Tooltip title="Clear Options" placement="right" style={{ backgroundColor: "#7393B3", borderRadius: '10%' }}>
                      <FilterAltOffIcon id='learning-adminreport-clearIcon' onClick={() => setOptionsNull()} />
                    </Tooltip>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </div>
      <Card id="learning-report-tablecard" elevation={3} sx={{ height: "auto", marginTop: "7%", marginLeft: "5%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div>
          {userSelected ?
            <>
              <TableContainer component={Paper} id="learning-admin-report-table" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead id="learning-adminreport-tablehead">
                    <TableRow>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Topic
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Subtopic
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Question
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Question Type
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Complexity
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Option Given
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Selected Answers
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Evaluation Mark
                      </TableCell>
                      <TableCell id="learning-adminreport-tablehead" align="center" style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: "nowrap" }}>
                        Question Mark
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((question, index) => (
                      <TableRow key={question.questionId} hover>
                        <TableCell align="center" style={{ fontSize: 14 }}>
                          {question.topicName}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                          {question.subtopicName}
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {question.question.length > 50 ? (
                              <>
                                {`${question.question.substring(0, 50)}...`}
                                <button type="button" className="btn btn-link" onClick={() => openQuestionModal(question.question)}>
                                  Read More
                                </button>
                              </>
                            ) : (
                              question.question
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
                          <Button variant="outlined" size="small" onClick={() => openOptionsModal(question.optionGiven.split(';'))}>
                            <label style={{ marginRight: '1%', marginBottom: "1%" }}><VisibilityIcon /></label> Options
                          </Button>
                        </TableCell>
                        <TableCell align="center" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                          {question.selectedAnswers}

                          {question.evaluationMark === 1 ? (
                            <CheckIcon style={{ color: "green" }} />
                          ) : (question.evaluationMark !== 1 && question.evaluationMark !== 0) ? (
                            <CheckIcon style={{ color: "Yellow" }} />
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
                  aria-describedby="options-modal-description"
                >
                  <div id="learning-adminreport-options-modal">
                    <h2 id="learning-adminreport-options-modal-title" style={{ marginBottom: '10px' }}>Given Options</h2>
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
                  aria-describedby="question-modal-description"
                >
                  <div id='learning-adminreport-readmore-modal'>
                    <h2 id="learning-adminreport-readmore-modal-heading">Full Question</h2>
                    <p id="learning-adminreport-readmore-modal-content">{questionModalContent}</p>
                  </div>
                </Modal>
                <div className="text-center mt-4 mb-4">
                  <ul className="pagination" id="learning-assessment-pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} id="learning-assessment-pagination">
                      <button id='learning-adminreport-pagination-btn' className="page-link" style={{ backgroundColor:"darkblue" }}  onClick={() => paginate(currentPage - 1)}>
                        <Tooltip title="PREVIOUS" placement="left">
                          <ArrowBackIosNewSharpIcon />
                        </Tooltip>
                      </button>
                    </li>
                    {visiblePages.map((number, index) => (
                      <li key={index} className={`page-item ${number === currentPage ? "active" : ""}`} id="learning-assessment-pagination">
                        {number === '...' ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button id="learning_assessment_module_view_all_search_button_box" onClick={() => paginate(number)} className="page-link">
                            {number}
                          </button>
                        )}
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`} id="learning-assessment-pagination">
                      <button id='learning-adminreport-pagination-btn' className="page-link" style={{ backgroundColor:"darkblue" }} onClick={() => paginate(currentPage + 1)}>
                        <Tooltip title="NEXT" placement="right">
                          <ArrowForwardIosSharpIcon />
                        </Tooltip>
                      </button>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-end">
                    <Tooltip title="ROW SELECTOR" placement="right">
                      <FormControl className="rowsPerPage" variant="outlined" sx={{ mr: 1, width: 120, marginTop: -8 }}>
                        <InputLabel id="rowsPerPage-label">Rows per page:</InputLabel>
                        <Select labelId="rowsPerPage-label" id="rowsPerPage-select" value={rowsPerPage} onChange={handleChangeRowsPerPage} label="Rows per page" autoWidth>
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
            : (
              <div style={{ backgroundColor: 'white' }}></div>
            )
          }
        </div>
      </Card>
      {!userSelected &&
        <div style={{ backgroundColor: 'white' }}>
          <div id='learning-adminreport-image-text-div'>
            <div id='learning-adminreport-image'></div>
            <div id='learning-adminreport-image-text'>
              <b style={{ whiteSpace: "nowrap" }}><span style={{ color: 'red' }}><WarningAmberIcon style={{ color: 'orange', marginRight: '5px', marginBottom: '2px' }} /></span>To view the detailed report, select <span style={{ color: '#27235c' }}>assessment name</span> and <span style={{ color: '#27235c' }}>user</span> in top menu</b>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default LearningDetailReportAdminSide;
