import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLanguageSkeleton } from "../../../redux/actions/skill_assessment_actions/assessment_views_actions/CodingAssessmentAction";

const LanguageSelectComponent = () => {
  
  //Fetching the Current Question's Language
  const questionLanguage = useSelector(
    (state) => state.langSkeleton.languageName
  );
  const question = useSelector((state) => state.code);
  const [language, setLanguage] = useState([]);
  const dispatch = useDispatch();
  
  //Handle Change the Language
  const handleChange = (e) => {
    const language = e.target.value;
    question.codingQuestionSkeletonDtos.forEach((data) => {
      if (data.languageName === language) {
        dispatch(getCurrentLanguageSkeleton(data));
        localStorage.setItem(question.questionId, language);
      }
      return;
    });
  };

  //UseEffect Hook is for setting option for Current Question
  useEffect(() => {
    const langList = question.codingQuestionSkeletonDtos.map(data => data.languageName);
    setLanguage(langList);
  }, [question, setLanguage])

  return (
    <div>
      <Stack direction={"row"} mt={1}>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography>Language:</Typography>
          <Select
            sx={{ width: "130px", height: "4vh", mr: 2 }}
            value={questionLanguage}
            onChange={handleChange}
          >
            {
              language.map((lang,index) => <MenuItem key={index} value={lang} >{lang}</MenuItem>)
            }
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
};

export default LanguageSelectComponent;
