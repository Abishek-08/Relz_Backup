import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";

const RefreshAlert = ({ flag, setFlag, question }) => {
  
  //Getting Current Code Skeleton
  const currentSkeleton = useSelector(state => state.langSkeleton);

  //Proctoring
  const { isFullscreen, enterFullscreen } = useFullScreen();

  //Handle the Close button
  const handleClose = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    setFlag(false);
  };

  //Handle the Confirm Button
  const handleConfirm = () => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    question.codingQuestionSkeletonDtos.forEach(data => {
      if (data.languageName === currentSkeleton.languageName) {
        localStorage.setItem(question.questionId + "_" + currentSkeleton.languageName, currentSkeleton.codeSkeleton);
      }
      return;
    })

    setFlag(false);
  };

  return (
    <Dialog open={flag} onClose={handleClose}>
      <DialogTitle>
        <Alert severity="warning" color="error">
          <Typography variant="h6">
            Warning!! - Required Confirmation
          </Typography>
        </Alert>
      </DialogTitle>
      <DialogContent>
        <strong> Are you sure you want to reload this code? </strong> <br />
        This will reload the code and any changes you have made will be lost.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus id="skill_module_cancel_btn">
          no
        </Button>
        <Button id="skill_module_confirm_btn" onClick={handleConfirm}>
          yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefreshAlert;
