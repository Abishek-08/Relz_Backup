import React, { useState } from "react";
import AdminNavbar from "../AdminNavbar";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "../../../styles/admin_module_styles/proctoring.css";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProgressBar } from "react-bootstrap";
import "../../../styles/admin_module_styles/skill_assessment_schedule_admin/CreateSkillAssessmentAdmin.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { addProctoring } from "../../../services/admin_module_services/SchedulingService";


/**
 * @author ranjitha.rajaram
 * @version 4.0
 * @since 18-07-2024
 */
const CreateLearningProctor = () => {
  const assessment = JSON.parse(sessionStorage.getItem("assessment"));
  const assessmentId = assessment?.assessmentId;
  const assessmentName = assessment?.assessmentName;
  const activeStep = 2;

  const [cameraProctoring, setCameraProctoring] = useState(false);
  const [audioProctoring, setAudioProctoring] = useState(false);
  const [copyPasteWarning, setCopyPasteWarning] = useState(false);
  const [tabSwitchingWarning, setTabSwitchingWarning] = useState(false);
  const [violationCount, setViolationCount] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleCameraProctorChange = (e) => {
    const value = e.target.value === "Enable";
    setCameraProctoring(value);
    if (!value) {
      setViolationCount("");
    }
  };

  const handleAudioProctorChange = (e) => {
    const value = e.target.value === "Enable";
    setAudioProctoring(value);
    if (!value) {
      setViolationCount("");
    }
  };

  const handleCopyPasteWarningChange = (e) => {
    const value = e.target.value === "Enable";
    setCopyPasteWarning(value);
    if (!value) {
      setViolationCount("");
    }
  };

  const handleTabSwitchingWarningChange = (e) => {
    const value = e.target.value === "Enable";
    setTabSwitchingWarning(value);
    if (!value) {
      setViolationCount("");
    }
  };

  const handleViolationCountChange = (e) => {
    setViolationCount(e.target.value);
  };

  const handleNext = async () => {
    if (
      (cameraProctoring ||
        audioProctoring ||
        copyPasteWarning ||
        tabSwitchingWarning) &&
      !violationCount
    ) {
      setSubmitError(true);
    } else if (
      !cameraProctoring &&
      !audioProctoring &&
      !copyPasteWarning &&
      !tabSwitchingWarning
    ) {
      setOpenConfirmDialog(true);
    } else {
      setSubmitError(false);
      try {
        const proctoringData = {
          cameraProctoring,
          audioProctoring,
          copyPasteWarning,
          tabSwitchingWarning,
          violationCount: parseInt(violationCount) || 0,
          assessment: { assessmentId },
        };
        await addProctoring(proctoringData);
        sessionStorage.setItem("activeStep", activeStep);
        toast.success("Proctoring details saved successfully!");
        navigate("/AddLearningAssessmentQuestionAdmin");
      } catch (error) {
        console.error("Error adding proctoring details:", error);
        toast.error(
          "Failed to save proctoring details. Please try again later."
        );
      }
    }
  };

  const handleConfirm = async () => {
    setOpenConfirmDialog(false);
    try {
      const proctoringData = {
        cameraProctoring: cameraProctoring || false,
        audioProctoring: audioProctoring || false,
        copyPasteWarning: copyPasteWarning || false,
        tabSwitchingWarning: tabSwitchingWarning || false,
        violationCount: (cameraProctoring || audioProctoring || copyPasteWarning || tabSwitchingWarning) ? (parseInt(violationCount) || 0) : 0,
        assessment: { assessmentId },
      };

      await addProctoring(proctoringData);
      sessionStorage.setItem("activeStep", activeStep);
      navigate("/AddLearningAssessmentQuestionAdmin");
    } catch (error) {
      console.error("Error navigating to next step:", error);
    }
  };

  const handleCancel = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <div className="container-fluid d-flex m-0 p-0">
      <AdminNavbar />
      <ToastContainer />
      <div className="Create_Skill_Assessment_Admin_Parent">
        <div className="Create_Skill_Assessment_Admin_Stepper">
          <AdminHorizontalLinearAlternativeLabelStepper />
        </div>
        <div className="Create_Skill_Assessment_Admin_Title">
          <TextField
            sx={{ minWidth: 270, maxWidth: 270 }}
            required
            id="outlined-required"
            value={assessmentName}
            disabled
          />
        </div>
        <div className="Create_Skill_Assessment_Admin_Radio_Parent">
          <div className="Create_Skill_Assessment_Admin_Radio">
            <FormControl>
              <FormLabel >Camera Proctoring</FormLabel>
              <RadioGroup
                row
                name="cameraProctor"
                value={cameraProctoring ? "Enable" : "Disable"}
                onChange={handleCameraProctorChange}>
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
          <div className="Create_Skill_Assessment_Admin_Radio">
            <FormControl>
              <FormLabel>Audio Proctoring</FormLabel>
              <RadioGroup
                row
                name="audioProctor"
                value={audioProctoring ? "Enable" : "Disable"}
                onChange={handleAudioProctorChange}>
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
          <div className="Create_Skill_Assessment_Admin_Radio">
            <FormControl>
              <FormLabel>Copy & Paste Warning</FormLabel>
              <RadioGroup
                row
                name="copyPasteWarning"
                value={copyPasteWarning ? "Enable" : "Disable"}
                onChange={handleCopyPasteWarningChange}>
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
          <div className="Create_Skill_Assessment_Admin_Radio">
            <FormControl>
              <FormLabel>Tab Switching Warning</FormLabel>
              <RadioGroup
                row
                name="tabSwitchingWarning"
                value={tabSwitchingWarning ? "Enable" : "Disable"}
                onChange={handleTabSwitchingWarningChange}>
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
        </div>
        {(cameraProctoring ||
          audioProctoring ||
          copyPasteWarning ||
          tabSwitchingWarning) && (
          <div className="Create_Skill_Assessment_Admin_Title">
            <TextField
              sx={{ minWidth: 270, maxWidth: 270 }}
              required
              id="outlined-required"
              label="Enter Violation Count"
              type="number"
              value={violationCount}
              onChange={handleViolationCountChange}
            />
          
          </div>
        )}
        <div className="Create_Skill_Assessment_Admin_submit_warning">
          {submitError && <p> ** Please fill the Violation Count **</p>}
        </div>
        <div>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </div>
        <Dialog
          open={openConfirmDialog}
          onClose={handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Confirm No Proctoring
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to go with no proctoring?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleConfirm} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateLearningProctor;
