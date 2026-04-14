import ClearIcon from "@mui/icons-material/Clear";
import LockIcon from "@mui/icons-material/Lock";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box, Typography, Divider, Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

/**
 *@author Srinivasan.S 12113
 * @since 19-07-2023
 */

function OverallTestCaseReport() {
  const testCaseResults = useSelector((state) => state.skillAnswer);

  // Handle loading state or empty results
  if (
    !Array.isArray(testCaseResults.testResults) ||
    testCaseResults.testResults.length === 0
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderColor: "divider",
        width: "100%",
        height: "44vh",
        overflowY: "auto",
        borderRadius: 1,
        pt: 2,
        pb: 2,
        px: 3,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      {testCaseResults.testResults.map((testcase, index) => (
        <React.Fragment key={index}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <LockIcon />
            </Grid>
            <Grid item xs>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: testcase.status === "pass" ? "#009900" : "#cc001f",
                }}
              >
                Test case {index + 1} :{" "}
                {testcase.status === "pass" ? (
                  <>
                    Pass <TaskAltIcon sx={{ color: "#009900", ml: 1 }} />
                  </>
                ) : (
                  <>
                    Fail <ClearIcon sx={{ color: "#cc001f", ml: 1 }} />
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
          {index < testCaseResults.testResults.length - 1 && (
            <Divider sx={{ my: 1 }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default OverallTestCaseReport;
