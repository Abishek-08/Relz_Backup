import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LuDatabaseBackup } from "react-icons/lu";
import { useSelector } from "react-redux";
import {
  runCodeSkeleton,
  runCustomInput,
} from "../../../services/skill_assessment_services/assessment_view_services/AssessmentViewService";
import "../../../styles/skill_assessment_styles/assessment_view_styles/CodingAssessmentPage.css";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";
import CodeEditor from "./CodeEditor";
import CustomRunCodeTerminal from "./CustomRunCodeTerminal";
import LanguageSelectComponent from "./LanguageSelectComponent";
import RefreshAlert from "./RefreshAlert";
import RunCodeTerminal from "./RunCodeTerminal";

/**
 * @author sanjay.subramani
 * @since 06-07-2024
 * @version 1.0
 */

/**
 * @author vinolisha v,dharshsun.s
 * @since 12-07-2024
 * @version 1.0
 */

/**
 *
 * @author Sanjay khanna, Srinivasan S
 * @since 24-08-2024
 * @version 2.0
 */

/**
 *
 * @author Prem M
 * @since 10-09-2024
 * @version 3.0
 */
const CodingAssessmentPage = ({ showRefreshPopup, handleCustomInputNext }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [refreshPopup, setRefreshPopup] = useState(false);
  const [notepadPopup, setNotepadPopup] = useState(false);
  const [codeHistoryPopup, setCodeHistoryPopup] = useState(false);
  const [themePopup, setThemePopup] = useState(false);
  const [skeletonPopup, setSkeletonPopup] = useState(false);
  const [runCodePopup, setRunCodePopup] = useState(false);
  const [customInputPopup, setCustomInputPopup] = useState(false);

  const [notepadOpen, setNotepadOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const [codeHistory, setCodeHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const question = useSelector((state) => state.code);
  const skeleton = useSelector((state) => state.langSkeleton);
  const questionId = question.questionId;
  const currentCode = localStorage.getItem(
    question.questionId + "_" + skeleton.languageName
  );
  const [codeSkeleton, setCodeSkeleton] = useState(currentCode);

  const [showTerminal, setShowTerminal] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loadingTerminal, setLoadingTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(null);
  const [checkboxFlag, setCheckBoxFlag] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState(null);
  const [saveCount, setSaveCount] = useState(0);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const { isFullscreen, enterFullscreen } = useFullScreen();//Proctoring Purpose enter into FullScreen Mode

  useEffect(() => {
    if (showRefreshPopup) {
      setRefreshPopup(true);
    } else {
      setRefreshPopup(false);
    }
  }, [showRefreshPopup]);

  useEffect(() => {
    setCheckBoxFlag(checkboxFlag);
    setCustomInput("");
    setCustomOutput(null);
    setTerminalOutput(null);
    setShowTerminal(false);
    setCodeSkeleton(currentCode);
  }, [currentCode, checkboxFlag]);

  const handleRefresh = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    setRefreshFlag(true);
    setShowTerminal(false);
    setCheckBoxFlag(false);
    setThemePopup(false);
    setSkeletonPopup(false);
    setRunCodePopup(false);
    setCustomInputPopup(false);
    setRefreshPopup(false);
    setNotepadPopup(false);
    setCodeHistoryPopup(false);
  };

  const handleRunCode = () => {
    setLoadingTerminal(true);
    if (checkboxFlag) {
      const formData = new FormData();
      formData.append("inputs", customInput);
      formData.append("code", codeSkeleton);
      formData.append("language", skeleton.languageName);

      if (isFullscreen || !isFullscreen) {
        enterFullscreen();
      }

      runCustomInput(formData)
        .then((res) => {
          setCustomOutput(res.data.toString());
        })
        .catch((error) => {
          console.error("Error sending code:", error);
          setTerminalOutput({
            error: "An error occurred while running the code.",
          });
        })
        .finally(() => {
          setLoadingTerminal(false);
        });
    } else {
      setShowTerminal(true);
      const formData = new FormData();
      formData.append("code", codeSkeleton);
      formData.append("questionId", question.questionId);
      formData.append("language", skeleton.languageName);

      if (isFullscreen || !isFullscreen) {
        enterFullscreen();
      }
      runCodeSkeleton(formData)
        .then((response) => {
          setTerminalOutput(response.data);
          localStorage.setItem(
            question.questionId + "_" + skeleton.languageName + "_run",
            JSON.stringify(response.data)
          );
        })
        .catch((error) => {
          console.error("Error sending code:", error);
          setTerminalOutput({
            error: "An error occurred while running the code.",
          });
        })
        .finally(() => {
          setLoadingTerminal(false);
        });
    }
  };

  const toggleTheme = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleCheckBox = () => {
    setCheckBoxFlag(!checkboxFlag);
  };

  const handleNextRefresh = () => {
    setRefreshPopup(false);
    setNotepadPopup(true);
  };

  const handleNotepad = () => {
    setNotepadPopup(false);
    setCodeHistoryPopup(true);
  };

  const handleCodeHistory = () => {
    setCodeHistoryPopup(false);
    setThemePopup(true);
  };

  const handleThemePopupNext = () => {
    setThemePopup(false);
    setSkeletonPopup(true);
  };

  const skeletonPopupNext = () => {
    setSkeletonPopup(false);
    setRunCodePopup(true);
  };

  const runCodePopupNext = () => {
    setRunCodePopup(false);
    setCustomInputPopup(true);
  };

  const onCustomInputNextClick = () => {
    if (typeof handleCustomInputNext === "function") {
      handleCustomInputNext();
      setRefreshPopup(false);
    }
    setCustomInputPopup(false);
  };

  const handleClose = () => {
    setNotepadOpen(false);
  };

  const handleSave = () => {
    // Save note content to localStorage
    localStorage.setItem("codeNotes", noteContent);
    setNotepadOpen(false);
  };

  // Update code history and save count when question changes
  useEffect(() => {
    const storedHistory =
      JSON.parse(
        localStorage.getItem(
          `codeHistory_${questionId}_${skeleton.languageName}`
        )
      ) || [];
    setCodeHistory(storedHistory);

    const savedCount =
      localStorage.getItem(
        `saveCount_${questionId}_${skeleton.languageName}`
      ) || 0;
    setSaveCount(Number(savedCount));
  }, [questionId, skeleton]);

  const handleCodeHistoryMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCodeHistoryMenuClose = () => {
    setAnchorEl(null);
  };

  // Update code history when question changes
  useEffect(() => {
    setCodeSkeleton(
      localStorage.getItem(questionId + "_" + skeleton.languageName) ||
      skeleton.codeSkeleton
    );

    const storedHistory =
      JSON.parse(
        localStorage.getItem(
          `codeHistory_${questionId}_${skeleton.languageName}`
        )
      ) || [];
    setCodeHistory(storedHistory);
  }, [questionId, skeleton]);

  const handleSaveCodeHistory = () => {
    if (saveCount < 3) {
      const updatedHistory = [...codeHistory, codeSkeleton];
      setCodeHistory(updatedHistory);
      localStorage.setItem(
        `codeHistory_${questionId}_${skeleton.languageName}`,
        JSON.stringify(updatedHistory)
      );

      const newSaveCount = saveCount + 1;
      setSaveCount(newSaveCount);
      localStorage.setItem(
        `saveCount_${questionId}_${skeleton.languageName}`,
        newSaveCount
      );

      handleCodeHistoryMenuClose();
    } else {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 3000);
      setAlertDialogOpen(true);
    }
  };

  const handleRestoreCode = (index) => {
    setCodeSkeleton(codeHistory[index]);
    localStorage.setItem(
      questionId + "_" + skeleton.languageName,
      codeHistory[index]
    );
    handleCodeHistoryMenuClose();
  };

  const handleCloseAlertDialog = () => {
    setAlertDialogOpen(false);
  };

  const getLineCount = () => {
    return codeSkeleton.split("\n").length;
  };

  return (
    <div>
      <Container maxWidth={"xl"}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          id="codingassessment-page-container"
        >
          <Grid item xs={6} id="skill-module-top">
            <LanguageSelectComponent />
          </Grid>
          <Grid item xs={5} display={"flex"} justifyContent={"space-evenly"}>
            <Tooltip title="Refresh code" placement="bottom">
              <IconButton
                variant="contained"
                id="skill_module_refresh_btn"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open Notepad" placement="bottom">
              <IconButton
                variant="contained"
                id="skill_module_notepad_btn"
                onClick={() => setNotepadOpen(true)}
              >
                <SpeakerNotesOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save History" placement="bottom">
              <IconButton
                variant="contained"
                id="skill_module_history_btn"
                onClick={handleCodeHistoryMenuOpen}
              >
                <LuDatabaseBackup />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCodeHistoryMenuClose}
            >
              <MenuItem onClick={handleSaveCodeHistory} id="save-code-history">
                Save Code History
              </MenuItem>
              {codeHistory.map((_, index) => (
                <MenuItem key={index} onClick={() => handleRestoreCode(index)}>
                  Restore Response {index + 1}
                </MenuItem>
              ))}
            </Menu>
            <Dialog
              open={alertDialogOpen}
              onClose={handleCloseAlertDialog}
              maxWidth="xs"
              fullWidth
              className={blinking ? "blinking" : ""}
            >
              <DialogTitle id="code-save-title">
                Save Limit Reached !!!
              </DialogTitle>
              <DialogContent id="code-save-content">
                <p>
                  Sorry!!! You have reached the maximum save limit of 3 times.
                </p>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseAlertDialog}
                  id="code-save-modal-btn"
                >
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
            <Tooltip title="Change Theme" placement="bottom">
              <IconButton
                variant="contained"
                id="skill_module_theme_btn"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid
            item
            xs={12}
            mt={1}
            height={"50vh"}
            className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl"
          >
            <CodeEditor
              value={codeSkeleton}
              setValue={setCodeSkeleton}
              theme={theme}
            />
            <Typography
              sx={{ mt: 1, color: "text.secondary" }}
              id="code-total-lines"
            >
              Total Lines: {getLineCount()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              id="skill_module_run_btn"
              onClick={handleRunCode}
            >
              Run code
            </Button>
            <FormControlLabel
              id="skill-module-custom-input"
              label={"Test against custom input"}
              sx={{ mt: 2, ml: 2 }}
              control={
                <Checkbox
                  color="default"
                  checked={checkboxFlag}
                  onChange={handleCheckBox}
                />
              }
            />
          </Grid>
        </Grid>
        {refreshFlag &&
          !refreshPopup &&
          !themePopup &&
          !notepadPopup &&
          !codeHistoryPopup &&
          !skeletonPopup &&
          !runCodePopup &&
          !customInputPopup && (
            <RefreshAlert
              flag={refreshFlag}
              setFlag={setRefreshFlag}
              question={question}
            />
          )}
        {showTerminal && (
          <RunCodeTerminal
            loading={loadingTerminal}
            output={terminalOutput}
            theme={theme}
          />
        )}
        {checkboxFlag && (
          <CustomRunCodeTerminal
            loading={loadingTerminal}
            theme={theme}
            setCustomInput={setCustomInput}
            setCustomOutput={setCustomOutput}
            customInput={customInput}
            customOutput={customOutput}
          />
        )}
        {refreshPopup && (
          <Box sx={{ position: "fixed", top: "12%", right: "10%", width: 225 }}>
            {/* Arrow */}
            <Box
              sx={{
                position: "absolute",
                top: -10,
                left: "51%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              sx={{
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 2 }}
                >
                  Attention: Refresh Code
                </Typography>
                <Typography>
                  This will reset the code in the editor to the original problem
                  statement.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={handleNextRefresh}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {notepadPopup && (
          <Box sx={{ position: "fixed", top: "12%", right: "1%", width: 225 }}>
            <Box
              sx={{
                position: "absolute",
                top: -10,
                left: "21%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              sx={{
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
                position: "relative",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}
                >
                  Attention: Notepad
                </Typography>
                <Typography>You can add notes here..</Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={handleNotepad}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {codeHistoryPopup && (
          <Box sx={{ position: "fixed", top: "12%", right: "1%", width: 200 }}>
            <Box
              sx={{
                position: "absolute",
                top: -10,
                left: "42%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              sx={{
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
                position: "relative",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}
                >
                  Attention: Save Code History
                </Typography>
                <Typography>
                  You can save your important code response by clicking here.
                  But you can save up to 3 responses only.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={handleCodeHistory}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {themePopup && (
          <Box sx={{ position: "fixed", top: "12%", right: "1%", width: 200 }}>
            <Box
              sx={{
                position: "absolute",
                top: -10,
                left: "74%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              style={{
                position: "fixed",
                top: "12%",
                right: "1%",
                width: 225,
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 2 }}
                >
                  Attention: Change Theme
                </Typography>
                <Typography>
                  You can always go back to the Dark Theme by clicking here.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={handleThemePopupNext}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {skeletonPopup && (
          <Box sx={{ position: "fixed", top: "28%", right: "20%", width: 225 }}>
            <Box
              sx={{
                position: "absolute",
                top: -24,
                left: "30%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              style={{
                position: "fixed",
                top: "26%",
                right: "20%",
                width: 225,
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 2 }}
                >
                  Attention: Skeleton
                </Typography>
                <Typography>Your code Skeleton</Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={skeletonPopupNext}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {runCodePopup && (
          <Box sx={{ position: "fixed", top: "72%", right: "33%", width: 225 }}>
            <Box
              sx={{
                position: "absolute",
                top: -24,
                left: "30%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              style={{
                position: "fixed",
                top: "70%",
                right: "33%",
                width: 225,
                height: "27vh",
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
                bottom: "10px",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 1 }}
                >
                  Attention: Run Code
                </Typography>
                <Typography>
                  Your code is ready to be run. Click the button below to
                  execute it.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={runCodePopupNext}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        {customInputPopup && (
          <Box sx={{ position: "fixed", top: "72%", right: "33%", width: 225 }}>
            <Box
              sx={{
                position: "absolute",
                top: -24,
                left: "100%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.9)",
              }}
            />
            <Card
              style={{
                position: "fixed",
                top: "70%",
                right: "23%",
                width: 240,
                height: "27vh",
                backgroundColor: "rgba(0,0,0,0.9)",
                fontSize: "12px",
                color: "white",
                boxShadow: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                zIndex: 10,
                bottom: "10px",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "bold", mb: 2 }}
                >
                  Attention: Custom Input
                </Typography>
                <Typography>
                  You have chosen to test your code against custom input.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "transparent",
                  }}
                  onClick={onCustomInputNextClick}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
      <Dialog
        open={notepadOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
            bgcolor: "#ffffff",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <DialogTitle id="code-note-title">
          <Typography>Code Notes</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <TextField
          id="Code-notepad"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Write your notes here..."
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: 2,
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              padding: "12px",
            },
          }}
        />

        <Button id="notepad-button" onClick={handleSave}>
          Save
        </Button>
      </Dialog>
    </div>
  );
};

export default CodingAssessmentPage;
