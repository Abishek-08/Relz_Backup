import React, { useState } from "react";
import AdminNavbar from "../AdminNavbar";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "../../../styles/admin_module_styles/skill_assessment_schedule_admin/CreateSkillAssessmentAdmin.css";
import {
  addLearningProctoring,
  addSkillProctoring,
} from "../../../services/admin_module_services/AdminLearningAssessmentService";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import { useDispatch, useSelector, UseSelector } from "react-redux";
import { UseDispatch } from "react-redux";
import proctorReducer from "../../../redux/reducers/admin_module_reducers/SkillProctorReducer";
import {
  changeAudioProctor,
  changeCameraProctor,
  changeCopyPasteProctor,
  changeTabSwitchProctor,
  changeValue,
  changeViolationCount,
} from "../../../redux/actions/admin_module_actions/CreateAssessment";

const ProctorSkill = () => {
  const activeStep = 2;

  const cameraProctoring = useSelector(
    (state) => state.proctorReducer.cameraProctoring
  );
  const audioProctoring = useSelector(
    (state) => state.proctorReducer.audioProctoring
  );
  const copyPasteWarning = useSelector(
    (state) => state.proctorReducer.copyPasteWarning
  );
  const tabSwitchingWarning = useSelector(
    (state) => state.proctorReducer.tabSwitchingWarning
  );
  const violationCount = useSelector(
    (state) => state.proctorReducer.violationCount
  );
  const value = useSelector((state) => state.createassessment.assessment);

  console.log(cameraProctoring);
  console.log(violationCount);
  const [submitError, setSubmitError] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [skillId, setSkillId] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleCameraProctorChange = (e) => {
    const value = e.target.value === "Enable";
    dispatch(changeCameraProctor(value));
    // setCameraProctoring(value);
    if (!value) {
      dispatch(changeViolationCount(""));
      // setViolationCount("");
    }
  };

  const assessmentNames = useSelector(
    (state) => state.createassessment.assessmentName
  );
  console.log(assessmentNames);

  const handleAudioProctorChange = (e) => {
    const value = e.target.value === "Enable";
    dispatch(changeAudioProctor(value));
    // setAudioProctoring(value);
    if (!value) {
      dispatch(changeViolationCount(""));
      // setViolationCount("");
    }
  };

  const handleCopyPasteWarningChange = (e) => {
    const value = e.target.value === "Enable";
    dispatch(changeCopyPasteProctor(value));
    // setCopyPasteWarning(value);
    if (!value) {
      dispatch(changeViolationCount(""));
      // setViolationCount("");
    }
  };

  const handleTabSwitchingWarningChange = (e) => {
    const value = e.target.value === "Enable";
    dispatch(changeTabSwitchProctor(value));
    // setTabSwitchingWarning(value);
    if (!value) {
      dispatch(changeViolationCount(""));
      // setViolationCount("");
    }
  };

  const handleViolationCountChange = (e) => {
    console.log(e.target.value);
    dispatch(changeViolationCount(e.target.value));
  };

  const handleNext = async () => {
    let hasError = false;
    if (
      (cameraProctoring ||
        audioProctoring ||
        copyPasteWarning ||
        tabSwitchingWarning) &&
      !violationCount
    ) {
      setSubmitError(true);
      hasError = true;
    } else {
      setSubmitError(false);
    }

    if (!hasError) {
      if (
        !cameraProctoring &&
        !audioProctoring &&
        !copyPasteWarning &&
        !tabSwitchingWarning
      ) {
        setOpenConfirmDialog(true);
      } else {
        try {
          toast.success(
            "Skill assessment and proctoring details saved successfully!"
          );
          sessionStorage.setItem("activeStep", activeStep);
          if (value === "10") {
            navigate("/skillquestionpickstep");
          } else {
            navigate("/knowledgequestionpickstep");
          }
        } catch (error) {
          toast.error("Failed to save details. Please try again later.");
        }
      }
    }
  };

  const handleConfirm = async () => {
    sessionStorage.setItem("activeStep", activeStep);
    dispatch(changeAudioProctor(false));
    dispatch(changeCameraProctor(false));
    dispatch(changeCopyPasteProctor(false));
    dispatch(changeTabSwitchProctor(false));
    if (value === "10") {
      navigate("/skillquestionpickstep");
    } else {
      navigate("/knowledgequestionpickstep");
    }
  };

  const handleBack = () => {
    const decreaseActiveStep = 0;
    navigate("/createassessmentstep");
    sessionStorage.setItem("activeStep", decreaseActiveStep);
  };

  const handleCancel = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <div
      className="container-fluid d-flex m-0 p-0"
      id="admin_proctor_super_parent"
    >
      <div
        className="container-fluid"
        id="Create_Skill_Assessment_Admin_Stepper"
      >
        <Card>
          <CardContent style={{ alignSelf: "center" }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
      </div>
      <div
        className="container-fluid"
        id="Create_Skill_Assessment_Admin_Parent"
      >
        <Card style={{ width: "100%" }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <div className="Create_Skill_Assessment_Admin_Assessment_Title">
                  <p>{assessmentNames.toUpperCase()}</p>
                </div>
              </Grid>
              <div className="Create_Skill_Assessment_Admin_Radio_Parent">
                <Grid item xs={12} md={2}>
                  <div className="Create_Skill_Assessment_Admin_Radio">
                    <FormControl>
                      <FormLabel>Camera Proctoring</FormLabel>
                      <RadioGroup
                        row
                        name="cameraProctor"
                        value={cameraProctoring ? "Enable" : "Disable"}
                        onChange={handleCameraProctorChange}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <div className="Create_Skill_Assessment_Admin_Radio">
                    <FormControl>
                      <FormLabel>Audio Proctoring</FormLabel>
                      <RadioGroup
                        row
                        name="audioProctor"
                        value={audioProctoring ? "Enable" : "Disable"}
                        onChange={handleAudioProctorChange}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <div className="Create_Skill_Assessment_Admin_Radio">
                    <FormControl>
                      <FormLabel>Copy & Paste Warning</FormLabel>
                      <RadioGroup
                        row
                        name="copyPasteWarning"
                        value={copyPasteWarning ? "Enable" : "Disable"}
                        onChange={handleCopyPasteWarningChange}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <div className="Create_Skill_Assessment_Admin_Radio">
                    <FormControl>
                      <FormLabel>Tab Switching Warning</FormLabel>
                      <RadioGroup
                        row
                        name="tabSwitchingWarning"
                        value={tabSwitchingWarning ? "Enable" : "Disable"}
                        onChange={handleTabSwitchingWarningChange}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
              </div>

              {(cameraProctoring ||
                audioProctoring ||
                copyPasteWarning ||
                tabSwitchingWarning) && (
                <Grid item xs={12} md={12}>
                  <div className="Create_Skill_Assessment_Admin_Violation_count">
                    <TextField
                      sx={{ minWidth: 270, maxWidth: 270 }}
                      required
                      id="outlined-required"
                      label="Enter Violation Count"
                      defaultValue={violationCount}
                      onChange={(e) => handleViolationCountChange(e)}
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
                  </div>
                </Grid>
              )}
              <Grid item xs={12} md={12}>
                <div className="Create_Skill_Assessment_Admin_submit_warning">
                  {submitError && <p> Please fill the Violation Count </p>}
                </div>
                <div
                  id="create_skill_assessment_handle_step_button"
                  style={{ display: "flex", rowGap: "50px" }}
                >
                  <div>
                    <Button
                      id="admin_createAssessment_submitButton"
                      variant="text"
                      onClick={handleBack}
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
                  <div>
                    <Button
                      id="admin_createAssessment_submitButton"
                      variant="text"
                      onClick={handleNext}
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
              </Grid>
              <Dialog
                open={openConfirmDialog}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Confirm No Proctoring
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to proceed without enabling any
                    proctoring?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleConfirm} autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProctorSkill;
