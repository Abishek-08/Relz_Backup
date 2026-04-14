 /**
 * @author Sb Abishek
 * @since 17-07-2024
 * @version 1.0
 */
 
import { toast } from 'react-toastify';
import { getProctoring } from '../../../services/user_module_service/Proctoring';
import Swal from 'sweetalert2';
 
 
 let violationCount = 0;
 let copyHandler, pasteHandler, blurHandler;
 
 const handleViolation = (navigate) => {
  toast.warning("Violation detected!");
 
  violationCount += 1;

  console.log("Violation detected");
 
  const maxViolationCount = parseInt(
    localStorage.getItem("maxViolationCount"),
    10
  );
 
  console.log(`Violation Count: ${violationCount}`);
  console.log(`Max Violation Count: ${maxViolationCount}`);

  if (violationCount > maxViolationCount) {
    let timerInterval;
    Swal.fire({
      title: "Violation Limit Exceeded!",
      html: "You have exceeded the maximum allowed violations. You will be redirected shortly. <b></b>",
      icon: "error",
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getHtmlContainer().querySelector("b");
        if (timer) {
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft() || 0}`;
          }, 5000);
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
      window.location.href = "/attemptstatus";
    }, 5000);
  }
};
 
const createCopyHandler = (navigate) => (event) => {
  if (!event.defaultPrevented) {
    event.preventDefault();
    handleViolation(navigate);
  }
};
 
const createPasteHandler = (navigate) => (event) => {
  if (!event.defaultPrevented) {
    event.preventDefault();
    handleViolation(navigate);
  }
};
 
const createBlurHandler = (navigate) => () => {
  handleViolation(navigate);
};
 
const disableKeyCombinations = (e) => {
  if ((e.ctrlKey && e.key === "v") || (e.ctrlKey && e.key === "c")) {
    e.preventDefault();
    window.alert("Cannot copy and cannot paste");
  }
};
 
export const initializeProctoring = (navigate) => {
  const fetchProctoringConfig = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("assessmentData"));
      const assessmentId = storedData ? storedData.assessmentId : null;
 
      if (!assessmentId) {
        throw new Error("Assessment ID not found in localStorage");
      }
 
      const response = await getProctoring(assessmentId);
      const proctoringConfig = response;
      setProctoringConfig(proctoringConfig, navigate);
    } catch (error) {
      console.error("Error fetching proctoring configuration:", error);
      toast.error(
        "Failed to fetch proctoring configuration. Please try again later."
      );
    }
  };
 
  const setProctoringConfig = (config, navigate) => {
    if (config.copyPasteWarning) {
      copyHandler = createCopyHandler(navigate);
      pasteHandler = createPasteHandler(navigate);
      document.addEventListener("copy", copyHandler);
      document.addEventListener("paste", pasteHandler);
      window.addEventListener("keydown", disableKeyCombinations);
    }
    if (config.tabSwitchingWarning) {
      blurHandler = createBlurHandler(navigate);
      window.addEventListener("blur", blurHandler);
    }
    localStorage.setItem("maxViolationCount", config.violationCount);
  };
 
  fetchProctoringConfig();
};
 
export const cleanupProctoring = () => {
  if (copyHandler) {
    document.removeEventListener("copy", copyHandler);
  }
  if (pasteHandler) {
    document.removeEventListener("paste", pasteHandler);
  }
  if (blurHandler) {
    window.removeEventListener("blur", blurHandler);
  }
  window.removeEventListener("keydown", disableKeyCombinations);
  localStorage.removeItem("violationCount");
  localStorage.removeItem("maxViolationCount");
};