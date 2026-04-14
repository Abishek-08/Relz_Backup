import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import "../../../styles/skill_assessment_styles/coding_question_styles/CodeEditor.css";
import useFullScreen from "../../user_module_components/Proctoring/useFullScreen";

const CodeEditor = ({ value, setValue, theme }) => {
  //For getting current Question Id
  const questionId = useSelector((state) => state.code.questionId);
  //For getting current language name
  const language = useSelector((state) => state.langSkeleton.languageName);
  // Proctoring
  const { isFullscreen, enterFullscreen } = useFullScreen();

  //Handle change for answering the question 
  const handleChange = (code) => {
    if (isFullscreen || !isFullscreen) {
      enterFullscreen();
    }
    // Save current code
    localStorage.setItem(questionId + "_" + language, code);
    setValue(code);
  };

  return (
    <Editor
      height="45vh"
      width="100%"
      language={language.split(/(\d+)/)[0].toLowerCase()}
      value={value}
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      options={{
        wordWrap: "on",
        minimap: { enabled: false },
        showUnused: true,
        colorDecorators: true,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        contextmenu: false,
        lineNumbers: "on",
        renderLineHighlight: "all",
      }}
      onChange={(code) => handleChange(code)}
      className={`editor-container ${theme === "light" ? "light-shadow" : ""}`}
    />
  );
};

export default CodeEditor;
