import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState, useEffect } from 'react';

const steps = [
    'Create Assessment',
    'Select Proctoring',
    'Select Questions',
    'Feedback Form',
    'Schedule Assessment'
];

export default function AdminHorizontalLinearAlternativeLabelStepper() {
    const [activeStep, setActiveStep] = useState(Number(sessionStorage.getItem("activeStep")) || 0);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "activeStep") {
                setActiveStep(Number(e.newValue) || 0);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
