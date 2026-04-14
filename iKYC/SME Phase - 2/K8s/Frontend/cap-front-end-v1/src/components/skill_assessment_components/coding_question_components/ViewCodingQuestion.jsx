import { Editor } from "@monaco-editor/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { getCodingQuestion } from "../../../services/skill_assessment_services/coding_question_services/CodingQuestionService";
import "../../../styles/skill_assessment_styles/coding_question_styles/View.css";

/**
 * @author Vinolisha V - 12126, Prem M
 * @version 2.0
 * @since 04.09.2024
 */

const ViewCodingQuestion = (props) => {
  const [data, setData] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    getCodingQuestion(props.id)
      .then((res) => {
        setData(res.data);
        if (res.data.codingQuestionFiles.length > 0) {
          setSelectedLanguage(res.data.codingQuestionFiles[0].language.languageName);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.id]);

  const handleClose = () => {
    props.setFlag(false);
  };

  const handleLanguageChange = (languageName) => {
    setSelectedLanguage(languageName);
  };


  const filteredFiles = data.codingQuestionFiles?.find(
    (file) => file.language.languageName === selectedLanguage
  );

  /**
   * This component contains the view part of uploaded zipfiles which is respect to the languages select and available.
   */
  return (
    <Dialog open={props.flag} sx={{ color: grey }} maxWidth={"lg"} fullWidth>
      <DialogContent sx={{ p: 0, display: 'flex', height: '80vh' }}>
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 200,
              height: '100%',

              padding: 2,
              backgroundColor: '#f5f5f5',
              overflowY: 'auto',
            }}
          >
            <List>
              {data.codingQuestionFiles?.map((file) => (
                <ListItem
                  button
                  key={file.language.languageId}
                  onClick={() => handleLanguageChange(file.language.languageName)}
                  sx={{
                    backgroundColor: selectedLanguage === file.language.languageName ? blueGrey[100] : 'transparent',
                    '&:hover': {
                      backgroundColor: grey[50],
                    },
                  }}
                >
                  <ListItemText primary={file.language.languageName} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              marginLeft: '200px',
              padding: 2,
              overflowY: 'auto',
              height: '100%',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CardHeader />
                <DialogTitle><b>{data.questionTitle} Question Files</b></DialogTitle>
              </Grid>

              <Grid item xs={12}>
                <Card id="code-viewtitle">
                  <CardHeader title={"Code Skeleton"} />
                  <CardContent>
                    <Editor
                      height={"40vh"}
                      language={selectedLanguage?.split(/(\d+)/)[0].toLowerCase()}
                      theme="vs-dark"
                      options={{ readOnly: true }}
                      value={filteredFiles?.codeSkeleton || ""}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card id="code-viewtitle">
                  <CardHeader title={"Test Case File"} />
                  <CardContent>
                    <Editor
                      height={"50vh"}
                      language={"java"}
                      theme="vs-dark"
                      options={{ readOnly: true }}
                      value={filteredFiles?.testCaseFile || ""}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card id="code-viewtitle">
                  <CardHeader title={"Sample Test Case"} />
                  <CardContent>
                    <Editor
                      height={"50vh"}
                      language={"java"}
                      theme="vs-dark"
                      options={{ readOnly: true }}
                      value={filteredFiles?.dummyCaseFile || ""}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card id="code-viewtitle">
                  <CardHeader title={"Test Case XML"} />
                  <CardContent>
                    <Editor
                      height={"50vh"}
                      language="xml"
                      theme="vs-dark"
                      options={{ readOnly: true }}
                      value={filteredFiles?.testCaseXml || ""}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button onClick={handleClose} id="closeCode-btn">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCodingQuestion;
