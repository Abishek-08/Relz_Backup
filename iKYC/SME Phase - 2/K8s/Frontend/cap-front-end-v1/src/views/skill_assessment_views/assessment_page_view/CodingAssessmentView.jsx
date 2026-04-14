import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeAssessmentNavbar from "../../../components/skill_assessment_components/assessment_view_components/CodeAssessmentNavbar";
import CodingAssessmentPage from "../../../components/skill_assessment_components/assessment_view_components/CodingAssessmentPage";
import LoadQuestion from "../../../components/skill_assessment_components/assessment_view_components/LoadQuestion";
import SkillAssessmentNavbar from "../../../components/skill_assessment_components/assessment_view_components/SkillAssessmentNavbar";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ViolationModal from "../../../components/user_module_components/Proctoring/ViolationModal";
import useCopyPaste from "../../../components/user_module_components/Proctoring/useCopyPaste";
import useFullScreen from "../../../components/user_module_components/Proctoring/useFullScreen";
import useIdleTimer from "../../../components/user_module_components/Proctoring/useIdleTimer";
import useTabSwitchCounter from "../../../components/user_module_components/Proctoring/useTabSwitchCounter";
import { setAllowedViolations } from "../../../redux/actions/user_module_actions/ProctoringAction";
import { updateUserStatus } from "../../../services/admin_module_services/UserService";
import { getProctoring } from "../../../services/user_module_service/Proctoring";
import "../../../styles/skill_assessment_styles/coding_question_styles/CodingAssessmentView.css";
import IdleTimeModel from "../../../components/user_module_components/Proctoring/IdleTimeModel";

/**
 * @author sanjay.subramani
 * @since 06-07-2024
 * @version 1.0
 */

/**
 * @author vinolisha.vijayakumar
 * @since 12-07-2024
 * @version 1.0
 */

const CodingAssessmentView = () => {
  //Proctoring
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullScreen();

  const [isHelpActive, setHelpActive] = useState(false);
  const [isHelpLocked, setHelpLocked] = useState(false); // New state to lock/unlock the help switch
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showRefPopup, setShowRefPopup] = useState(false);
  const [showFinishPopup, setShowFinishPopup] = useState(false);

  /*idle time alert model starts*/
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useIdleTimer(120000, setOpen); // Pass setOpen directly

  /*idle time alert model starts*/

  /* default proctoring right click , ctrl+p, printScreen, win+shift+s restriction */

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
        event.key === "F10"
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

  /* default proctouring ends here */

  const navigate = useNavigate();

  //proctoring
  // useEffect(() => {
  //   initializeProctoring(navigate);
  //   return () => {
  //     cleanupProctoring();
  //   };
  // }, [navigate]);

  const dispatch = useDispatch();
  const [isCountingActive, setIsCountingActive] = useState(false);
  const [isCopyActive, setIsCopyActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useTabSwitchCounter(isCountingActive, setModalOpen);
  useCopyPaste(isCopyActive, setModalOpen);

  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
  );
  const maxViolationCount = useSelector(
    (state) => state.proctoring?.allowedViolations ?? 0
  );
  const user = useSelector((state) => state.profileDetails.profileDetails);

  //Proctoring
  useEffect(() => {
    const loadProctoring = async () => {
      const assessmentData = JSON.parse(
        localStorage.getItem("assessmentData") || "{}"
      );
      if (assessmentData.assessmentId) {
        await getProctoring(assessmentData.assessmentId)
          .then((res) => {
            // console.log(res);
            if (res.violationCount || res.copyPasteWarning) {
              localStorage.setItem("proctoringEnable", true);
            } else {
              localStorage.setItem("proctoringEnable", false);
            }
            dispatch(setAllowedViolations(res.violationCount));
            setIsCountingActive(res.tabSwitchingWarning);
            setIsCopyActive(res.copyPasteWarning);
          })
          .catch(() => {
            localStorage.setItem("proctoringEnable", false);
            console.log("Error in fetching proctoring data");
          });
      }
    };
    loadProctoring();
  }, [dispatch, modalOpen]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (modalOpen) {
    if (
      maxViolationCount > 0 &&
      switchCount + copyPasteCount >= maxViolationCount
    ) {
      handleCloseModal();
      let timerInterval;
      Swal.fire({
        title: "Violation Limit Exceeded!",
        html: "You have exceeded the maximum allowed violations. You will be redirected shortly. <b></b>",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getHtmlContainer().querySelector("b");
          if (timer) {
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft() || 0}`;
            }, 2000);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("The Assessment will be closed in");
        }
      });
      sessionStorage.setItem("submitted", true);
      setTimeout(() => {
        console.log(user);
        updateUserStatus(user.userId, "INACTIVE").then((res) => {
          localStorage.setItem("abruptStop", true);
          if (isFullscreen || !isFullscreen) {
            enterFullscreen();
            setTimeout(() => {
              exitFullscreen();
            }, 1000);
            navigate("/attemptstatus");
          }
        });
      }, 500);
    }
  }
  //ends here

  const handleNextClick = () => {
    setHelpActive(false);
    setShowTimePopup(true);
  };

  const handleNextRefreshPopup = () => {
    setShowTimePopup(false);
    setShowRefPopup(true);
  };

  const handleCustomInputNext = () => {
    setShowRefPopup(false); // Hide the refresh popup if visible
    setShowFinishPopup(true); // Show the finish assessment popup
  };

  const handleCloseFinishPopup = (confirm) => {
    setShowFinishPopup(false);
    if (confirm) {
      setHelpActive(false); // Reset help state
      setHelpLocked(false); // Unlock the help switch
    }
  };

  const handleHelpToggle = (event) => {
    if (isHelpLocked) return; // Prevent toggling if help is locked
    const helpState = event.target.checked;
    setHelpActive(helpState); // Update parent state
    if (helpState) {
      setHelpLocked(true); // Lock the switch if turned on
    }
  };

  if (
    sessionStorage.getItem("loading") !== null ||
    sessionStorage.getItem("resultWaited") !== null
  ) {
    window.history.forward();
    return "";
  } else {
    return (
      <div
        onContextMenu={handleContextMenu}
        className="coding-assessment-container-view"
      >
        <IdleTimeModel open={open} onClose={handleClose} />
        <ViolationModal open={modalOpen} onClose={handleCloseModal} />
        <Grid item xs={12} className="top-panel">
          <div className="fixed-navbar">
            <SkillAssessmentNavbar
              showTimePopup={showTimePopup}
              onNextPopup={handleNextRefreshPopup}
              showFinishPopup={showFinishPopup}
              onClosePopup={handleCloseFinishPopup}
            />
          </div>
        </Grid>

        <div className="bottom-panel">
          <Grid item xs={1} className="left-panel">
            <CodeAssessmentNavbar
              onHelpToggle={handleHelpToggle}
              isHelpLocked={isHelpLocked}
            />
          </Grid>
          <div className="splitter-line"></div>

          <Grid item xs={4} className="left1-panel">
            <LoadQuestion
              isHelpActive={isHelpActive}
              onNext={handleNextClick}
            />
          </Grid>

          <Grid item xs={3} className="center-panel">
            {/* Other content */}
          </Grid>

          <Grid item xs={4} className="right-panel">
            <CodingAssessmentPage
              showRefreshPopup={showRefPopup}
              handleCustomInputNext={handleCustomInputNext}
            />
          </Grid>
        </div>

        <ToastContainer />
      </div>
    );
  }
};

export default CodingAssessmentView;
