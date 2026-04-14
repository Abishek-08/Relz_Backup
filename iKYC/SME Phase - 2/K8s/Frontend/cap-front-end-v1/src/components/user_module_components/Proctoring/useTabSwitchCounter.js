import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementTabSwitch } from "../../../redux/actions/user_module_actions/ProctoringAction";
import { useNavigate } from "react-router-dom";

const useTabSwitchCounter = (isActive, setModalOpen) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
  );
  const maxViolationCount = useSelector(
    (state) => state.proctoring?.allowedViolations ?? 0
  );

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (maxViolationCount > switchCount + copyPasteCount) {
          setModalOpen(true); // Show modal when violation occurs
          dispatch(incrementTabSwitch());
        } else {
          console.log("preview page");
          if (localStorage.getItem("isSkillAssessment") === "true") {
            setModalOpen(false);
            navigate("/codingassessmentpage");
          } else {
            navigate("/preview");
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    dispatch,
    isActive,
    navigate,
    maxViolationCount,
    switchCount,
    setModalOpen,
    copyPasteCount,
  ]);

  return switchCount;
};

export default useTabSwitchCounter;
