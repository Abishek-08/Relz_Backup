import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSkillReport } from "../../../../services/skill_assessment_services/assessment_report_services/CodeAssessmentReport";
import { Editor } from "@monaco-editor/react";
import { Container, Row, Col } from "react-bootstrap";
import { 
  Card, CardContent, Typography, Box, List, ListItem, ListItemButton, 
  ListItemText, Chip, Paper, ThemeProvider, createTheme
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";


 /**

 * @author kirubakaran.b
 * @since 24-07-2024
 * @version 2.0
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#25235c",
    },
    secondary: {
      main: "#6c757d",
    },
  },
});

const SubmissionSkill = () => {
  const [questions, setQuestions] = useState({
    codingQuestions: [],
    skillResults: [],
  });
  const [selectedQuestion, setSelectedQuestion] = useState({
    code: "",
    testResults: [],
  });
  const { attemptId } = useParams();
  const [selectedQuestionTitle, setSelectedQuestionTitle] = useState("");

  useEffect(() => {
    getSkillReport(attemptId)
      .then((res) => {
        console.log(res.data);
        setQuestions(res.data);
        if (res.data.skillResults.length > 0) {
          setSelectedQuestion(res.data.skillResults[0]);
          setSelectedQuestionTitle(
            res.data.skillResults[0].codingQuestion.questionTitle
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching skill assessments:", error.message);
      });
  }, [attemptId]);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setSelectedQuestionTitle(question.codingQuestion.questionTitle);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container fluid className="p-5" style={{ height: "100vh", overflow: "hidden" }}>
        <Row style={{ height: "100%" }}>
          <Col md={2}>
            <Paper elevation={3} className="p-3 mt-5">
              <Typography variant="h6" gutterBottom>
                Questions
              </Typography>
              <List>
                {questions.skillResults.map((question, index) => (
                  <ListItem key={question.codingQuestion.questionId} disablePadding>
                    <ListItemButton
                      selected={question === selectedQuestion}
                      onClick={() => handleQuestionClick(question)}
                    >
                      <ListItemText primary={`Q ${index + 1}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Col>
          <Col md={7}>
            <Paper elevation={3} className="mt-5 p-3" style={{ overflowY: "auto" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h5" color="primary" ml={2}>
                    Question Title: {selectedQuestionTitle}
                </Typography>
              </Box>
              <Editor
                height="70vh"
                theme="vs-white"
                language="java"
                value={selectedQuestion.code}
                options={{ readOnly: true }}
              />
            </Paper>
          </Col>
          <Col md={3}>
            <Paper elevation={3} className="p-3 mt-4" style={{ height: "100%", overflowY: "auto" }}>
              {selectedQuestion && selectedQuestion.testResults && (
                selectedQuestion.testResults.length > 0 ? (
                  selectedQuestion.testResults.map((testCase, index) => (
                    <Card key={testCase.testResultId} className="mb-2">
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between" height={"14px"} >
                          <Typography variant="subtitle1" style={{fontSize:"18px"}}>
                             <LockIcon/> Test case {index + 1}
                          </Typography>
                          {testCase.status === "pass" ? (
                            <Chip
                              icon={<CheckCircleOutlineIcon />}
                              label="Passed"
                              color="success"
                              variant="outlined"
                            />
                          ) : (
                            <Chip
                              icon={<CloseIcon />}
                              label="Failed"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No test results available for this question.
                  </Typography>
                )
              )}
            </Paper>
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  );
};

export default SubmissionSkill;
