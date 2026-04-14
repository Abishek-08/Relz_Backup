import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import CloseIcon from '@mui/icons-material/Close'; 
import Tooltip from '@mui/material/Tooltip'; 
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import "../../../styles/skill_assessment_styles/coding_question_styles/CodingAssessmentTimeOut.css";

/**
 *
 * @author Srinivasan.S
 * @since 05-07-2024
 */

/**
 * 
 * @author Vinolisha.v - 12126
 * @since 09-08-2024
 */

function CodeAssessmentTimeOut({ duration, startTime }) {
  // State to control visibility of the timer
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  // State to show warning when 10 minutes are left
  const [show10MinWarning, setShow10MinWarning] = useState(false);
  // State to show warning when 5 minutes are left
  const [show5MinWarning, setShow5MinWarning] = useState(false);

  // Calculate the expiry time based on the start time and duration
  const expiryTime = parseInt(startTime) + 1000 * 60 * duration;

  const navigate = useNavigate();

  // Effect to handle timeout for warnings
  useEffect(() => {
    let timeout10Min;
    let timeout5Min;

    if (show10MinWarning) {
      // Hide the 10-minute warning after 30 seconds
      timeout10Min = setTimeout(() => setShow10MinWarning(false), 30000); 
    }

    if (show5MinWarning) {
      // Hide the 5-minute warning after 30 seconds
      timeout5Min = setTimeout(() => setShow5MinWarning(false), 30000); 
    }

    return () => {
      // Cleanup timeouts on component unmount
      clearTimeout(timeout10Min);
      clearTimeout(timeout5Min);
    };
  }, [show10MinWarning, show5MinWarning]);
  
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // When the countdown completes, navigate to the attempt status page
      sessionStorage.setItem("TimesUp", true);
      navigate('/attemptstatus');
    } else {
      // Calculate the remaining time in seconds
      const currentTime = Date.now();
      const elapsedTimeInSeconds = Math.max(
        0,
        Math.floor((expiryTime - currentTime) / 1000)
      );

      // Determine if less than 10 minutes are remaining
      const isLessThan10Minutes = elapsedTimeInSeconds < 600;

      // Show 10-minute warning if 10 minutes are left and warning is not already shown
      if (elapsedTimeInSeconds === 600 && !show10MinWarning) {
        setShow10MinWarning(true);
      }
      // Show 5-minute warning if 5 minutes are left and warning is not already shown
      if (elapsedTimeInSeconds === 300 && !show5MinWarning) {
        setShow5MinWarning(true);
      }

      return (
        <div className="code-countdown-text">
          Time Limit:
          <span
            className={`code-countdown-text ${isLessThan10Minutes ? "code-countdown-text-danger" : ""}`}
          >
            <b>
              {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </b>
          </span>
        </div>
      );
    }
  };

  return (
    <div className="code-assessment-timeout">
      <div className="timer-header">
        <span className="timer-toggle">
          <div className={`icon-wrapper ${isTimerVisible ? "show-alarm-off" : "show-access-alarm"}`}>
            {isTimerVisible ? (
              <Tooltip title="Hide the timer">
                <AccessAlarmIcon
                  className="timer-icon pulsing-effect"
                  onClick={() => setIsTimerVisible(false)}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Turn on the timer">
                <AlarmOffIcon
                  className="code-timer-icon pulsing-effect"
                  onClick={() => setIsTimerVisible(true)}
                />
              </Tooltip>
            )}
          </div>
        </span>
        {/* Conditionally render the countdown timer based on visibility */}
        {isTimerVisible && <Countdown date={expiryTime} renderer={renderer} />}
      </div>

      {/* Popup Warning Message for 10 minutes left */}
      {show10MinWarning && (
        <div className="code-time-popup-warning">
          <div className="code-popup-warning-header">
            <span className="code-popup-warning-text">You have only 10 minutes left to complete the assessment!</span>
            <CloseIcon 
              className="code-popup-warning-close"
              onClick={() => setShow10MinWarning(false)}
            />
          </div>
        </div>
      )}

      {/* Popup Warning Message for 5 minutes left */}
      {show5MinWarning && (
        <div className="code-time-popup-warning">
          <div className="code-popup-warning-header">
            <span className="code-popup-warning-text">You have only 5 minutes left to complete the assessment!</span>
            <CloseIcon 
              className="code-popup-warning-close"
              onClick={() => setShow5MinWarning(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeAssessmentTimeOut;
