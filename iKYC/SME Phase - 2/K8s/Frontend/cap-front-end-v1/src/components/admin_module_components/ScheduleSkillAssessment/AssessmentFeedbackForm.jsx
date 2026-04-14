import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/admin_module_styles/skill_assessment_schedule_admin/AssessmentFeedbackForm.css';
import { Card, CardContent, Menu, MenuItem, Box, Button, Input, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled, alpha } from '@mui/material/styles';
import AdminHorizontalLinearAlternativeLabelStepper from './AdminHorizontalLinearAlternativeLabelStepper';
import { changeFormFields } from '../../../redux/actions/admin_module_actions/CreateAssessment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ToastContainer, toast } from "react-toastify";
import {
  updateFieldAttributeName,
  updateFieldOption,
  addOption,
  removeOption,
  updateFieldType,
  updateVisibility
} from '../../../redux/actions/admin_module_actions/CreateAssessment';
import Feedbackimage from '../../../assets/admin-module-assets/Assessment Loading.gif';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'center',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'center',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: {
      topLeft: 0,
      bottomLeft: 0,
      topRight: 5,
      bottomRight: 5,
    },
    backgroundColor: "#1976d2",
    color: "white",
    minWidth: 180,
    marginLeft: -5,
    color: 'rgb(55, 65, 81)',
    height: '37px',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
      display: 'flex',
      flexDirection: 'row',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 12,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

const AssessmentFeedbackForm = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [noFormConfirmation, setNoFormConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const assessmentType = useSelector((state) => state.createassessment.assessment)
  const fields = useSelector((state) => state.fieldsReducer.fields);
  const visibility = useSelector((state) => state.fieldsReducer.visibility);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  

  const handleAddField = (type) => {
    const newField = { attributeName: '', attributeType: type, options: [] };
    dispatch({
      type: 'ADD_FIELD',
      payload: newField
    });
    dispatch(updateVisibility(fields.length, type === 'MSQ'));
    setAnchorEl(false);
  };

  const handleAddSSQField = (type) => {
    const newField = { attributeName: '', attributeType: type, options: [] };
    dispatch({
      type: 'ADD_FIELD',
      payload: newField
    });
    dispatch(updateVisibility(fields.length, type === 'SSQ'));
    setAnchorEl(false);
  };

  const handleAddYesOrNoField = (type) => {
    const newField = { attributeName: '', attributeType: type };
    dispatch({
      type: 'ADD_FIELD',
      payload: newField
    });
    dispatch(updateVisibility(fields.length, type === 'YES OR NO'));
    setAnchorEl(false);
  };

  const handleRemoveField = (index) => {
    dispatch({
      type: 'REMOVE_FIELD',
      payload: index
    });
    dispatch(updateVisibility(index, false));
  };

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    dispatch(updateFieldAttributeName(index, value));
  };

  const handleOptionChange = (fieldIndex, optionIndex, event, questionvalue) => {
    const { value } = event.target;
    const questionType = questionvalue.split(',')[0].trim();
    dispatch(updateFieldOption(fieldIndex, optionIndex, value, questionType));
  };

  const handleAddOption = (index) => {
    dispatch(addOption(index));
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    dispatch(removeOption(fieldIndex, optionIndex));
  };

  const handleTypeChange = (index, newType) => {
    dispatch(updateFieldType(index, newType));
    dispatch(updateVisibility(index, newType === 'MSQ'));
  };

  const validateFields = () => {
    return fields.every((field) => {
      const fieldType = field.attributeType.split(',')[0].trim();
      return fieldType !== 'SSQ' && fieldType !== 'MSQ' ? true : field.options.length >= 2;
    });
  };

  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [fields, boxRef]);

  const formResponse = () => {
    if (fields === null || fields.length === 0) {
      setNoFormConfirmation(true);
    } else if (!fields.every((field) => field.attributeName.trim() !== '')) {
      toast.error("Fill the Question field");
    } else if (validateFields()) {
      handleNextButtonClick();
    } else {
      toast.error("Each question must have at least two options.");
    }
  };

  const handlePrevious = () => {
    if (!fields.every((field) => field.attributeName.trim() !== '')) {
      toast.error("Fill the Question field");
    } else if (validateFields()) {
      sessionStorage.setItem("activeStep", 2);
      dispatch(changeFormFields(fields));
      if (assessmentType === "10") {
        navigate('/skillquestionpickstep');
      } else if (assessmentType === "20") {
        navigate('/knowledgequestionpickstep');
      }
    } else {
      toast.error("Each question must have at least two options.");
    }
  };


  const handleNextButtonClick = () => {
    sessionStorage.setItem("activeStep", 4);
    dispatch(changeFormFields(fields))
    if (assessmentType === "10") {
      navigate('/skillassessmentschedulestep')
    }
    else if (assessmentType === "20") {
      navigate('/knowledgeschedulestep')
    }
  }
  return (
    <div className="container-fluid m-0 p-0" id="admin_assessment_form">
      <div className="container-fluid" id="admin_assessment_stepper">
        <Card>
          <CardContent style={{ alignSelf: "center" }}>
            <AdminHorizontalLinearAlternativeLabelStepper />
          </CardContent>
        </Card>
      </div>
      <div className="container-fluid" id="admin_assessment_body">
        <Card sx={{ height: "450px", padding: "1%" }}>
          <CardContent>
            <Box>

              <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="text"
                disableElevation
                onClick={handleClick}
                endIcon={<ArrowForwardIosIcon />}
              >
                Add New Question
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleAddField('PLAIN TEXT')} disableRipple sx={{ color: "white", maxHeight: 25, marginRight: 2 }}>
                  <EditIcon />
                  Text
                </MenuItem>
                <MenuItem onClick={() => handleAddSSQField('SSQ')} disableRipple sx={{ color: "white", maxHeight: 25 }}>
                  <FileCopyIcon />
                  Single Select
                </MenuItem>
                <MenuItem onClick={() => handleAddField('MSQ')} disableRipple sx={{ color: "white", maxHeight: 25 }}>
                  <FileCopyIcon />
                  Multi Select
                </MenuItem>
                <MenuItem onClick={() => handleAddField('YES OR NO')} disableRipple sx={{ color: "white", maxHeight: 25 }}>
                  <FileCopyIcon />
                  Yes or No
                </MenuItem>
              </StyledMenu>
            </Box>

            {
              fields.length === 0 ? (
                <Box sx = {{textAlign: "center"}}>
                  <img src={Feedbackimage} alt="No Field is Selected" style={{ height: '300px', width: '300px' }} />
                </Box>
              )
                :
                (
                  <Box 
                  ref={boxRef}
                  sx={{
                    height: "300px",
                    overflowY: "auto",
                    overflow: "scroll",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                      width: "5px",
                      height: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#ccc",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#aaa",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#eee",
                    },
                  }}
                  >{
                      fields.map((field, index) => (
                        <Box key={index} style={{ display: 'block', margin: '10px', position: 'relative', backgroundColor: "#FAFAFA", padding: "10px", borderRadius: "15px", color: "#B5B5B5" }}>
                          <Input
                            placeholder={`Question ${index + 1}`}
                            value={field.attributeName}
                            onChange={(event) => handleInputChange(index, event)}
                            style={{ display: 'block', marginRight: '40px' }}
                          />
                          <IconButton
                            onClick={() => handleRemoveField(index)}
                            style={{ position: 'absolute', right: 0, top: 0 }}
                          >
                            <CloseIcon />
                          </IconButton>

                          {visibility[index] && (
                            <Box mt={2} sx={{ display: 'flex', alignItems: 'center', flexDirection: "row", height: "auto" }}>
                              {field.options.map((option, optionIndex) => (
                                <Box key={optionIndex} style={{ display: 'flex', alignItems: 'center', flexDirection: "row", marginBottom: '8px', marginRight: "10px" }}>
                                  <Input
                                    label={`Option ${optionIndex + 1}`}
                                    value={option}
                                    onChange={(event) => handleOptionChange(index, optionIndex, event, field.attributeType)}

                                  />
                                  <IconButton onClick={() => handleRemoveOption(index, optionIndex)} >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Box>
                              ))}
                              <Button
                                variant="text"
                                color="primary"
                                onClick={() => handleAddOption(index)}
                                startIcon={<AddIcon />}
                                disabled={field.options.length >= 4}
                              >
                                Option
                              </Button>
                            </Box>
                          )}
                        </Box>
                      ))}
                              
                  </Box>

                )}
            <Box style={{ display: "flex", justifyContent: "space-around", marginTop: "1%" }}>
              <div>
                <Button
                  sx={{
                    backgroundColor: "#27235c",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#97247e",
                    },
                  }}
                  variant="contained"
                  onClick={handlePrevious}
                >
                  Back
                </Button>
              </div>
              <div>
                <Button
                  sx={{
                    backgroundColor: "#27235c",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#97247e",
                    },
                  }}
                  variant="contained"
                  onClick={formResponse}
                >
                  Next
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={noFormConfirmation}
        onClose={() => setNoFormConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <WarningRoundedIcon /> Proceeding without Feedback Form
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are submitting the assessment without a feedback form. This means you won't receive additional comments from respondents.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setNoFormConfirmation(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleNextButtonClick()}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default AssessmentFeedbackForm;