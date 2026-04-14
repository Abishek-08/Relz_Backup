import { Button, Grid, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkBatchNameExists, createAssessment } from '../../services/admin_module_services/AdminService';
import "../../styles/admin_module_styles/createassessment.css";
import AdminNavbar from './AdminNavbar';
import AdminHorizontalLinearAlternativeLabelStepper from './ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper';

export default function CreateAssessment() {
    const [value, setValue] = useState('');
    const [assessment, setAssessment] = useState('');
    const [assessmentName, setAssessmentName] = useState('');
    const [error, setError] = useState({});
    const [showNameError, setShowNameError] = useState(false);

    const navigate = useNavigate();

    const activeStep = 1;

    const handleChange = (event) => {
        setAssessment(event.target.value);
        setError(prevError => ({ ...prevError, assessment: '' })); // Clear assessment error when selecting a value
    };

    const handleAssessmentNameChange = (event) => {
        const { value } = event.target;
        setAssessmentName(value);
        setShowNameError(false); // Reset showNameError when assessment name changes
        setError(prevError => ({ ...prevError, assessmentName: '' })); // Clear assessment name error when typing
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
            // axios.get(`http://localhost:8090/cap/admin/assessmentname/${assessmentName}`)
            checkBatchNameExists(assessmentName)
                .then(() => {
                    setShowNameError(true);
                })
                .catch(() => {
                    setShowNameError(false);
                });
        }
    };

    const  handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            assessmentName: assessmentName,
            instruction: value,
        };

        // Validation
        let hasError = false;
        const newError = {};

        if (!assessmentName) {
            newError.assessmentName = 'Please enter assessment name';
            hasError = true;
        }

        if (!assessment) {
            newError.assessment = 'Please select assessment type';
            hasError = true;
        }

        if (!value) {
            newError.instruction = 'Please Enter Instruction';
            hasError = true;
        }

        setError(newError);

        if (showNameError) {
            toast.error('Assessment name already exists');
            return;
        }

        // If no errors, proceed with POST request
        if (!hasError) {
            // axios.post('http://localhost:8090/cap/admin/assessment', data)
            createAssessment(data)
                .then((response) => {
                    sessionStorage.setItem('assessment', JSON.stringify(response.data));
                    toast.success('Assessment created successfully!');
                    if (assessment === '10') {
                        sessionStorage.setItem('activeStep', activeStep)
                       navigate("/createskillassessment")
                    } else if (assessment === '20') {
                        sessionStorage.setItem('activeStep', activeStep)
                        window.location.href = '/learningProctor';
                    }
                })
                .catch((error) => {
                    toast.error('Error creating assessment');
                    console.error(error);
                });
        }
    };

    return (
        <div className="container-fluid-flex m-0 p-0" id='admin_createAssessment_base'>
            <AdminNavbar />
            <ToastContainer />
            <div className="container-fluid" id='admin_createAssessment_body'>
                <div>
                    <AdminHorizontalLinearAlternativeLabelStepper />
                </div>

                <div id="admin_createAssessment_content">
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                            {/* <Typography id="assessmentdescription-head" style={{ marginLeft: 124 }}>
                                Assessment Name
                            </Typography> */}
                            <div  className='admin_createAssessment_inputField'>
                            <TextField
                                id='admin_createAssessment_textbox1'
                               
                                label='Assessment Name'
                                placeholder='Enter Assessment Name'
                                variant="outlined"
                                autoComplete='off'
                                required
                                value={assessmentName}
                                onChange={handleAssessmentNameChange}
                                error={!!error.assessmentName || showNameError}
                                helperText={error.assessmentName || (showNameError && "Assessment Name Already Exists")}
                                onBlur={handleBlur}
                                sx={{

                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            
                                            width: 380,
                                        },
                                        // '&:hover fieldset': {
                                        //     // borderColor: '#524F7D',
                                        //     // boxShadow: '0px 0px 10px #AC5098',
                                        // },
                                        // '&.Mui-focused fieldset': {
                                        //     borderColor: '#0f62fe',
                                        //     borderWidth: 1,
                                        //     // boxShadow: '0px 0px 10px #AC5098',
                                        // },
                                        width:370,
                                        // paddingLeft: 1,
                                        // cursor: 'text',
                                        // marginLeft: 15, // Adjusted margin-left for the input field
                                    },
                                    // '& .MuiOutlinedInput-input': {
                                    //     fontSize: 18, // Adjusted font size
                                    //     fontFamily: "sans-serif", // Custom font style
                                    //     width: 350,
                                    // },
                                    // '& .MuiFormHelperText-root': {
                                    //     marginLeft: 15, // Adjusted margin-left for the error message
                                    //     marginTop: 2,

                                    // },
                                }}
                            />
                            </div>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl
                                fullWidth
                                id="admin_createAssessment_select"
                                error={!!error.assessment}
                                // sx={{
                                //     '& .MuiOutlinedInput-root': {
                                //         '& fieldset': {
                                //             borderColor: '#524F7D',
                                //             borderWidth: 1,
                                //             width: 380,
                                //         },
                                //         '&:hover fieldset': {
                                //             borderColor: '#524F7D',
                                //             // boxShadow: '0px 0px 10px #AC5098',
                                //             width: 380,
                                //         },
                                //         '&.Mui-focused fieldset': {
                                //             borderColor: '#0f62fe',
                                //             borderWidth: 1,
                                //             // boxShadow: '0px 0px 10px #AC5098',
                                //             width: 380,
                                //         },
                                //         paddingLeft: 1,
                                //         cursor: 'pointer',
                                //     },
                                //     '& .MuiSelect-select': {
                                //         fontSize: 16, // Adjusted font size
                                //         width: 380,
                                //     },
                                //     '& .MuiInputLabel-root': {
                                //         transform: 'translate(0, 1.5px) scale(0.75)', // Adjust label position
                                //         color: '#524F7D', // Adjust label color
                                //         width: 380,
                                //     },
                                // }}
                            >
                                <div style={{ marginBottom: 20 }}>
                                    {/* <Typography id="assessmentdescription-head" style={{ marginLeft: 172 }}>
                                        Assessment Type
                                    </Typography> */}
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={assessment}
                                        onChange={handleChange}
                                        required
                                        displayEmpty // Ensure placeholder shows up when no value is selected
                                        sx={{
                                            '&:focus': {
                                                backgroundColor: 'transparent', // Remove background color on focus

                                            },
                                            width: 380,
                                            marginLeft: 21,
                                        }}
                                    >
                                        <MenuItem value="" >
                                            Select Assessment Type
                                        </MenuItem>
                                        <MenuItem value="10" >Skill Assessment</MenuItem>
                                        <MenuItem value="20" >Knowledge Assessment</MenuItem>
                                    </Select>
                                </div>
                                {error.assessment && (
                                    <Typography variant="caption" color="error" sx={{ marginLeft: 24.5 }}>
                                        {error.assessment}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>

                <div className="mx-auto" id='admin_createAssessment_body2'>
                    <Typography id="assessmentdescription-head" >
                        Assessment Instruction
                    </Typography>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        
                    />
                    {error.instruction && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {error.instruction}
                        </Typography>
                    )}


                </div>

                <Button
                    id='admin_createAssessment_submitButton'
                    variant='text'
                    onClick={handleSubmit}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#27235c',
                        '&:hover': {
                            backgroundColor: '#97247e',
                        }
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
