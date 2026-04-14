import React, { useEffect, useState } from "react";
import LearningAssessmentEngineMain from "../../components/learningassessment_module_components/learningassessmentengine/LearningAssessmentEngineMain";
import KnowledgeAssessmentNavbar from "../../components/learningassessment_module_components/learningassessmentengine/KnowledgeAssessmentNavbar";
import { Grid } from "@mui/material";
import "../../styles/learning_assessment_styles/LearningAssessmentEngineMain.css";
import useIdleTimer from "../../components/user_module_components/Proctoring/useIdleTimer";
import IdleTimeModel from "../../components/user_module_components/Proctoring/IdleTimeModel";

const LearningAssessmentEngineView = () => {
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevents the context menu from appearing
  };

  useEffect(() => {
    // Handler for keyboard events
    const handleKeyDown = (event) => {
      // Check if Ctrl + P is pressed
      if (
        (event.ctrlKey && event.key === "p") ||
        (event.key === "s" && event.shiftKey && event.metaKey) ||
        event.key === "F10" ||
        (event.metaKey && event.key === "v")
      ) {
        event.preventDefault(); // Prevent the default action
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useIdleTimer(120000, setOpen); // Pass setOpen directly

  return (
    <div 
    onContextMenu={handleContextMenu}
    >
      <IdleTimeModel open={open} onClose={handleClose} />
      <Grid item xs={12} className="top-panel">
        <div className="knowledge-fixed-navbar">
          <KnowledgeAssessmentNavbar />
        </div>
      </Grid>
      <div>
        <LearningAssessmentEngineMain />
      </div>
    </div>
  );
};

export default LearningAssessmentEngineView;
