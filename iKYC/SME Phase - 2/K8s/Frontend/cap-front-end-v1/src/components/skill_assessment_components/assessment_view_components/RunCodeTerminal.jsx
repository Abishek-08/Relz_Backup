import CancelIcon from "@mui/icons-material/Cancel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Grid } from "@mui/material";
import React from "react";
import "../../../styles/skill_assessment_styles/coding_question_styles/RunCodeTerminal.css";

const RunCodeTerminal = ({ loading, output, theme }) => {

  //Rendering specific test result 
  const renderOutput = () => {

    //no output mean should render nothing
    if (!output) return null;
    const {
      testCount = 0,
      wasSuccessful,
      failureList = [],
      exception,
    } = output;

    //Exception raise means should handle first
    if (exception && exception !== "Other Exception") {
      return (
        <>
          <div className="compilation-error">
            <div className="ms-2">
              {" "}
              Your code has a Runtime error <CancelIcon />
            </div>
            <div className="ms-2 mt-5">{exception}</div>
          </div>
        </>
      );
    }

    //Compilation Error
    if (testCount === 0 && failureList.length > 0) {
      return (
        <>
          <div className="compilation-error">
            Your code has a compilation error <CancelIcon />
          </div>
          <ul>
            {failureList.map((error, index) => (
              <li key={index} className="error-item">
                {error.split("\n").map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </li>
            ))}
          </ul>
        </>
      );
    }

    //Rendering Test Result
    if (wasSuccessful) {
      return (
        <>
          <div className="testcase-success">
            All Test Cases Passed <TaskAltIcon />
          </div>
          <ul>
            {Array.from({ length: testCount }).map((_, index) => (
              <li key={index}>
                Test Case {index + 1}:{" "}
                <span className="success-item">Passed</span>
              </li>
            ))}
          </ul>
        </>
      );
    }
    else {
      //Test partials result
      return (
        <>
          <div
            className={`runcode-failure-box ${theme === "dark" ? "dark-theme" : "light-theme"}`}
          >
            Test Cases Failed <CancelIcon />
          </div>
          <ul>
            {Array.from({ length: testCount }).map((_, index) => (
              <li key={index}>
                Test Case {index + 1}:
                {failureList[index] === null ? (
                  <span className="failure-item">Failed</span>
                ) : failureList[index] ? (
                  <span className="failure-item">{failureList[index]}</span>
                ) : (
                  <span className="success-item">Passed</span>
                )}
              </li>
            ))}
          </ul>
        </>
      );
    }
  };

  return (
    <div
      className={`run-code-terminal-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}
    >
      <div className="code-header-container">
        <h6 className="code-terminal-header">Test Results</h6>
      </div>
      {loading ? (
        <Grid item xs={12} mt={1} className="loading-container">
          <p>Results loading....</p>
        </Grid>
      ) : (
        <Grid item xs={12} mt={1} className="output-container">
          {renderOutput()}
        </Grid>
      )}
    </div>
  );
};

export default RunCodeTerminal;
