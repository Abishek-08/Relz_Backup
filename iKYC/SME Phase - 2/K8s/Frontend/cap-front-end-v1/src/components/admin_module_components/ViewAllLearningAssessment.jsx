import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "../../styles/admin_module_styles/AdminLearningAssessment/ViewAllLearningAssessment.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import Button from "@mui/material/Button";
import nodatafound from "../../assets/admin-module-assets/no-data-found.jpg";
import { getAllL0KnowledgeAssessment, getAllL1KnowledgeAssessment, getAllL2KnowledgeAssessment } from "../../services/admin_module_services/LearningAssessmentService";
 
const BoldTab = styled(Tab)(({ theme }) => ({
  fontWeight: "bold",
  color: "#27235c",
  textAlign: "center",
}));
 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#27235c",
  color: theme.palette.common.white,
  // fontSize: 14,
  // fontWeight: 'bold',
}));
 
export default function ViewAllLearningAssessment() {
  const [value, setValue] = React.useState("1");
 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  const [LevelZeroLearningAssessments, setLevelZeroLearningAssessments] =
    React.useState([]);
 
  const [quickLearningAssessments, setQuickLearningAssessments] =
    React.useState([]);
 
  const [moderateLearningAssessments, setModerateLearningAssessments] =
    React.useState([]);
 
  React.useEffect(() => {
    getAllL0KnowledgeAssessment()
      .then((response) => {
        setLevelZeroLearningAssessments(response.data); // Assuming data structure is an array of objects
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  React.useEffect(() => {
   
      getAllL1KnowledgeAssessment()
      .then((response) => {
        setQuickLearningAssessments(response.data); // Assuming data structure is an array of objects
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  React.useEffect(() => {
    getAllL2KnowledgeAssessment()
      .then((response) => {
        setModerateLearningAssessments(response.data); // Assuming data structure is an array of objects
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
 
  return (
    <div className="container-fluid d-flex m-0 p-0">
      <AdminNavbar />
      <div id="View_All_learning" className="d-flex">
        <div className="View_All_learning_tab_Parent">
          <Box className="View_All_learning_tab_Box">
            <TabContext value={value}>
              <Box
                sx={{ borderBottom: 1, borderColor: "divider" }}
                id="View_All_Learning_Heading"
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <BoldTab label="L0 Learning Assessment" value="1" id="admin_module_L0"/>
                  <BoldTab label="L1 Learning Assessment" value="2" id="admin_module_L0"/>
                  <BoldTab label="L2 Learning Assessment" value="3" id="admin_module_L0"/>                  
 
                </TabList>
              </Box>
              <TabPanel value="1">
                {LevelZeroLearningAssessments.length === 0 ? (
                  <div>
                    <img
                      src={nodatafound}
                      alt="No Data Found"
                      className="admin_viewallassessment_no-data-found"
                    />
                    <h4 id="admin_viewassessment_h4">No Data Found</h4>
                    <h5 id="admin_viewassessment_marquee">
                      Click Below to Add Assessment
                    </h5>
                    <div className="admin_viewallassessment_button">
                      <Button
                        variant="text"
                        href="/createassessment"
                        sx={{
                          mt: 3,
                          mb: 2,
                          color: "white",
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                            color: "white",
                          },
                        }}
                      >
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">
                            Assessment Name
                          </StyledTableCell>
                          {/* <StyledTableCell align="center">Topic Name</StyledTableCell> */}
                          <StyledTableCell align="center">
                            Number of Questions
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Pass Mark
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {LevelZeroLearningAssessments.map((row, index) => (
                          <TableRow key={row.levelZeroLearningAssessmentId}>
                            <TableCell align="center">
                              {row.assessment.assessmentName}
                            </TableCell>
                            {/* <TableCell align="center">{row.topic.topicName}</TableCell> */}
                            <TableCell align="center">
                              {row.numberOfQuestion}
                            </TableCell>
                            <TableCell align="center">{row.passMark}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
              <TabPanel value="2">
                {quickLearningAssessments.length === 0 ? (
                  <div>
                    <img
                      src={nodatafound}
                      alt="No Data Found"
                      className="admin_viewallassessment_no-data-found"
                    />
                    <h4 id="admin_viewassessment_h4">No Data Found</h4>
                    <h5 id="admin_viewassessment_marquee">
                      Click Below to Add Assessment
                    </h5>
                    <div className="admin_viewallassessment_button">
                      <Button
                        variant="text"
                        href="/createassessment"
                        sx={{
                          mt: 3,
                          mb: 2,
                          color: "white",
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                            color: "white",
                          },
                        }}
                      >
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
                      <TableHead>
                        <TableRow>
                          {/* <StyledTableCell align="center">S.No.</StyledTableCell> */}
                          <StyledTableCell align="center">
                            Assessment Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Basic
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Intermediate
                          </StyledTableCell>
                          <StyledTableCell align="center">Hard</StyledTableCell>
                          <StyledTableCell align="center">
                            Number of Questions
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Pass Mark
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {quickLearningAssessments.map((row, index) => (
                          <TableRow key={row.quickLearningAssessmentId}>
                            {/* <TableCell align="center">{index + 1}</TableCell> */}
                            <TableCell align="center">
                              {row.assessment.assessmentName}
                            </TableCell>
                            <TableCell align="center">{row.basic}</TableCell>
                            <TableCell align="center">
                              {row.intermediate}
                            </TableCell>
                            <TableCell align="center">{row.hard}</TableCell>
                            <TableCell align="center">
                              {row.numberOfQuestion}
                            </TableCell>
                            <TableCell align="center">{row.passMark}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
              <TabPanel value="3">
                {moderateLearningAssessments.length === 0 ? (
                  <div>
                    <img
                      src={nodatafound}
                      alt="No Data Found"
                      className="admin_viewallassessment_no-data-found"
                    />
                    <h4 id="admin_viewassessment_h4">No Data Found</h4>
                    <h5 id="admin_viewassessment_marquee">
                      Click Below to Add Assessment
                    </h5>
                    <div className="admin_viewallassessment_button">
                      <Button
                        variant="text"
                        href="/createassessment"
                        sx={{
                          mt: 3,
                          mb: 2,
                          color: "white",
                          backgroundColor: "#27235c",
                          "&:hover": {
                            backgroundColor: "#97247e",
                            color: "white",
                          },
                        }}
                      >
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-label="moderate learning assessment table"
                    >
                      <TableHead>
                        <TableRow>
                          {/* <StyledTableCell align="center">S.No.</StyledTableCell> */}
                          <StyledTableCell align="center">
                            Assessment Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Subtopic Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Topic Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Number of Questions
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Pass Mark
                          </StyledTableCell>
                          {/* <TableCell align="center"><strong>Instruction</strong></TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {moderateLearningAssessments.map((row, index) => (
                          <TableRow key={row.moderateLearningAssessmentId}>
                            {/* <TableCell align="center">{index + 1}</TableCell> */}
                            <TableCell align="center">
                              {row.assessment.assessmentName}
                            </TableCell>
                            <TableCell align="center">
                              {row.subTopic
                                .map((sub) => sub.subtopicName)
                                .join(", ")}
                            </TableCell>
                            <TableCell align="center">
                              {row.subTopic[0].topic.topicName}
                            </TableCell>
                            <TableCell align="center">
                              {row.numberOfQuestion}
                            </TableCell>
                            <TableCell align="center">{row.passMark}</TableCell>
                            {/* <TableCell align="center" dangerouslySetInnerHTML={{ __html: row.assessment.instruction }} /> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
}
