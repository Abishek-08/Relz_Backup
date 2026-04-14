import { Editor } from "@monaco-editor/react";
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import "../../../styles/skill_assessment_styles/assessment_report_styles/CodeTestReport.css";

/**
 * @author Srinivasan S - 12113
 * @since 19-07-2024
 */

function UserCodeResponse() {
  const codeResponse = useSelector((state) => state.skillAnswer);
  const lang = useSelector((state) => state.skillAnswer.language?.languageName);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "45vh",  
          overflowY: "auto",  
        }}
      >
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
          <Editor
            height="85vh"
            language={lang?.split(/(\d+)/)[0].toLowerCase()}
            theme="vs-dark"
            options={{ readOnly: true }}
            value={codeResponse.code}
          />
        </div>
      </Box>
    </div>
  );
}

export default UserCodeResponse;
