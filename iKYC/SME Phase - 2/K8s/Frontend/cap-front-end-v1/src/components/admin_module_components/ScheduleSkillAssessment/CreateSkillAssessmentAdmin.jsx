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
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
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
import {  addSkillProctoring } from "../../../services/admin_module_services/AdminSkillAssessmentService";
import { addProctoring } from "../../../services/admin_module_services/SchedulingService";

/**
 * @author ranjitha.rajaram
 * @version 4.0
 * @since 18-07-2024
 */

const CreateSkillAssessmentAdmin = () => {
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [skillId, setSkillId] = useState(null); 
  const navigate = useNavigate();

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
          const skillAssessmentData = {
            assessment: {
              assessmentId,
              assessmentName,
            },
          };
          const proctoringData = {
            cameraProctoring,
            audioProctoring,
            copyPasteWarning,
            tabSwitchingWarning,
            violationCount: parseInt(violationCount) || 0,
            assessment: { assessmentId },
          };

          const requests = [];
          requests.push(
            await addSkillProctoring(skillAssessmentData)
          );
          sessionStorage.setItem("activeStep", activeStep);
          if (
            cameraProctoring ||
            audioProctoring ||
            copyPasteWarning ||
            tabSwitchingWarning
          ) {
            requests.push(
              await addProctoring(proctoringData)
            );
          }
          const [skillAssessmentResponse, ...responses] = await Promise.all(
            requests
          );

          sessionStorage.setItem(
            "skillAssessment",
            JSON.stringify(skillAssessmentResponse.data)
          );
          toast.success(
            "Skill assessment and proctoring details saved successfully!"
          );
          navigate("/adminaddskillquestion");
        } catch (error) {
          console.error(
            "Error adding skill assessment and proctoring details:",
            error
          );
          toast.error("Failed to save details. Please try again later.");
        }
      }
    }
  };

  const handleConfirm = async () => {
    setOpenConfirmDialog(false);
    try {
      const skillAssessmentData = {
        assessment: {
          assessmentId,
          assessmentName,
        },
      };
  
     const skillAssessmentResponse= await addSkillProctoring(skillAssessmentData);
      sessionStorage.setItem(
        "skillAssessment",
        JSON.stringify(skillAssessmentResponse.data)
      );
      toast.success("Skill assessment saved successfully!");
  
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
      navigate("/adminaddskillquestion");
    } catch (error) {
      console.error("Error adding skill assessment:", error);
      toast.error("Failed to save skill assessment. Please try again later.");
    }
  };
  

  const handleCancel = () => {
    setOpenConfirmDialog(false);
  };


  return (
    <div className="container-fluid d-flex m-0 p-0">
      <AdminNavbar />
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
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm No Proctoring
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to proceed without enabling any proctoring?
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
      <ToastContainer />
    </div>
  );
};

export default CreateSkillAssessmentAdmin;
