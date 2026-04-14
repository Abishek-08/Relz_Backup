import { Textarea } from "@mui/joy";
import { Grid, Tooltip } from "@mui/material";
import React from "react";

/**
 * CustomRunCodeTerminal Component
 * 
 * This component displays a terminal for running code with input and output areas.
 * 
 * @author Sanjay Khanna, Srinivasan S
 * @since 24-08-2024
 * @version 2.0
 */

const CustomRunCodeTerminal = ({
  loading,
  theme,
  customOutput,
  customInput,
  setCustomInput,
  setCustomOutput,
}) => {
  
  // Handle changes in the input textarea
  const handleChange = (e) => {
    setCustomOutput(null); // Clear the output when input changes
    setCustomInput(e.target.value); // Update the input value
  };

  return (
    <div
      className={`run-code-terminal-container ${theme === "dark" ? "dark-theme" : "light-theme"}`}
    >
      {loading ? (
        <Grid item xs={12} mt={1} className="loading-container">
          <p>Results loading....</p>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          mt={1}
          p={3}
          pt={5}
          gap={2}
          container
          className="output-container"
        >
          <Grid item xs={12}>
            <Tooltip
              title={
                "Enter the input values, and use a space to separate the number of inputs."
              }
              placement="bottom-start"
            >
              <Textarea
                placeholder="Type input values here"
                id="skill_module_input_textarea"
                sx={{ width: "100%" }}
                value={customInput}
                onChange={handleChange} // Attach the change handler
              />
            </Tooltip>
          </Grid>
          {customOutput !== null && (
            <>
              <Grid item xs={12}>
                <Textarea
                  sx={{ width: "100%" }}
                  readOnly
                  value={customOutput} // Display the output
                  error={
                    customOutput.includes("exception") ||
                    customOutput.includes("Exception") ||
                    customOutput.includes("Unable to compile") ||
                    customOutput.includes("Error")
                      ? true
                      : false
                  }
                  color={
                    customOutput.includes("exception") ||
                    customOutput.includes("Exception") ||
                    customOutput.includes("Unable to compile") ||
                    customOutput.includes("Error")
                      ? "danger"
                      : "success"
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </div>
  );
};

export default CustomRunCodeTerminal;
