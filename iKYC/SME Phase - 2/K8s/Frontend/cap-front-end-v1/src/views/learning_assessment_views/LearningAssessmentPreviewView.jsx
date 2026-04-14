import React, { useEffect } from "react";
import LearningEnginePreview from "../../components/learningassessment_module_components/learningassessmentengine/LearningEnginePreview";
import KnowledgeAssessmentNavbar from "../../components/learningassessment_module_components/learningassessmentengine/KnowledgeAssessmentNavbar";
import "../../styles/learning_assessment_styles/LearningAssessmentEngineMain.css";

import { Grid } from "@mui/material";
const LearningAssessmentPreviewView = () => {
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
        (event.metaKey && event.key === "v") ||
        (event.ctrlKey && event.key === "v") ||
        (event.ctrlKey && event.key === "c") ||
        (event.ctrlKey && event.key === "x")
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

  return (
    <div onContextMenu={handleContextMenu}>
      <Grid>
        <div className="knowledge-fixed-navbar">
          <KnowledgeAssessmentNavbar />
        </div>
      </Grid>
      <div>
        <LearningEnginePreview />
      </div>
    </div>
  );
};

export default LearningAssessmentPreviewView;
