import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementCopyPaste } from "../../../redux/actions/user_module_actions/ProctoringAction"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

function useCopyPaste(isActive, setModalOpen) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const copyPasteCount = useSelector(
    (state) => state.proctoring?.copyPaste ?? 0
  );
  const switchCount = useSelector((state) => state.proctoring?.tabSwitch ?? 0);
  const allowedViolations = useSelector(
    (state) => state.proctoring.allowedViolations
  );

  useEffect(() => {
    if (!isActive) return; // Exit if the hook is not active

    const disableKeyCombinations = (e) => {
      if (
        (e.ctrlKey && e.key === "v") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "x")
      ) {
        e.preventDefault();

        if (allowedViolations > copyPasteCount + switchCount) {
          dispatch(incrementCopyPaste());
          setModalOpen(true); // Open the modal when copy-paste action is detected
        } else {
          setModalOpen(true); // Optionally open the modal if violation limit is exceeded
          if (localStorage.getItem("isSkillAssessment") === "true") {
            setModalOpen(false);
            navigate("/codingassessmentpage");
          } else {
            navigate("/preview");
          }
        }
      }
    };

    window.addEventListener("keydown", disableKeyCombinations);

    return () => {
      window.removeEventListener("keydown", disableKeyCombinations);
    };
  }, [
    isActive,
    copyPasteCount,
    allowedViolations,
    dispatch,
    setModalOpen,
    switchCount,
    navigate,
  ]);

  return copyPasteCount;
}

export default useCopyPaste;
