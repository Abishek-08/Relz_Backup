import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkBatchNameExists,
  createAssessment,
} from "../../../services/admin_module_services/AdminService";
import AdminHorizontalLinearAlternativeLabelStepper from "../ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper";
import {
  changeValue,
  changeAssessment,
  changeAssessmentName,
} from "../../../redux/actions/admin_module_actions/CreateAssessment";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import AdminNavbar from "../AdminNavbar";
import { useSelector, useDispatch } from "react-redux";
import "../../../styles/admin_module_styles/createassessment.css";

function CreateAssessmentRedux() {
  const [error, setError] = useState({});
  const [showNameError, setShowNameError] = useState(false);

  // Redux state
  const value = useSelector((state) => state.createassessment.value);
  const assessment = useSelector((state) => state.createassessment.assessment);
  const assessmentName = useSelector(
    (state) => state.createassessment.assessmentName
  );

  // Redux dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeStep = 1;

  // Handlers for Redux state
  const handleChange = (event) => {
    dispatch(changeAssessment(event.target.value));
    setError((prevError) => ({ ...prevError, assessment: "" })); // Clear assessment error when selecting a value
  };

  const handleAssessmentNameChange = (event) => {
    dispatch(changeAssessmentName(event.target.value));
    setShowNameError(false); // Reset showNameError when assessment name changes
    setError((prevError) => ({ ...prevError, assessmentName: "" })); // Clear assessment name error when typing
  };

  const handleValueChange = (value) => {
    dispatch(changeValue(value));
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  };

  const handleBlur = () => {
    if (assessmentName) {
      checkBatchNameExists(assessmentName)
        .then(() => {
          setShowNameError(true);
        })
        .catch(() => {
          setShowNameError(false);
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      assessmentName: assessmentName,
      instruction: value,
    };

    // Validation
    let hasError = false;
    const newError = {};

    if (!assessmentName) {
      newError.assessmentName = "Please enter assessment name";
      hasError = true;
    }

    if (!assessment) {
      newError.assessment = "Please select assessment type";
      hasError = true;
    }

    if (!value) {
      newError.instruction = "Please Enter Instruction";
      hasError = true;
    }

    setError(newError);

    if (showNameError) {
      toast.error("Assessment name already exists");
      return;
    }

    // If no errors, proceed with POST request
    if (!hasError) {
      // createAssessment(data)
      toast.success("Assessment created successfully!");
      if (assessment === "10") {
        sessionStorage.setItem("activeStep", activeStep);
        navigate("/proctorstep");
      } else if (assessment === "20") {
        sessionStorage.setItem("activeStep", activeStep);
        navigate("/proctorstep");
      }
    }
  };

  return (
    <div className="container-fluid m-0 p-0" id="admin_createAssessment_base">
      <ToastContainer />
      
      <div className="container-fluid" id="admin_createAssessment_body">
      <Card>
          <CardContent style={{ alignSelf: "center",  }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
        <Card sx={{marginTop: "2.5%"}}>
          <CardContent>
            <div id="admin_createAssessment_content">
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <div className="admin_createAssessment_inputField">
                    <TextField
                      id="admin_createAssessment_textbox1"
                      label="Assessment Name"
                      placeholder="Enter Assessment Name"
                      variant="outlined"
                      autoComplete="off"
                      required
                      value={assessmentName}
                      onChange={handleAssessmentNameChange}
                      error={!!error.assessmentName || showNameError}
                      helperText={
                        error.assessmentName ||
                        (showNameError && "Assessment Name Already Exists")
                      }
                      onBlur={handleBlur}
                      fullWidth // Add this line
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            width: "100%",
                          },
                        },
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    id="admin_createAssessment_select"
                    error={!!error.assessment}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={assessment}
                        onChange={handleChange}
                        required
                        displayEmpty
                        fullWidth // Add this line
                        sx={{
                          "&:focus": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        <MenuItem value="">Select Assessment Type</MenuItem>
                        <MenuItem value="10">Skill Assessment</MenuItem>
                        <MenuItem value="20">Knowledge Assessment</MenuItem>
                      </Select>
                    </div>
                    {error.assessment && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ marginLeft: 2 }}
                      >
                        {error.assessment}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </div>

            <div className="mx-auto" id="admin_createAssessment_body2">
              <Typography
                id="assessmentdescription-head"
                sx={{
                  marginBottom: "10px",
                }}
              >
                Assessment Instruction
              </Typography>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={handleValueChange}
                modules={modules}
              />
              {error.instruction && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {error.instruction}
                </Typography>
              )}
            </div>

            <div id="admin_createAssessment_submitButton_parent">
              <Button
                id="admin_createAssessment_submitButton"
                variant="text"
                onClick={handleSubmit}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#27235c",
                  color: "white",                  
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateAssessmentRedux;
