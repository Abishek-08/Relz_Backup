import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AdminNavbar from "../../../components/admin_module_components/AdminNavbar";
import OverallScore from "../../../components/skill_assessment_components/assessment_report_component/OverallScore";
import SkillAssessmentNavbar from "../../../components/skill_assessment_components/assessment_view_components/SkillAssessmentNavbar";
import UserNavbar from "../../../components/user_module_components/user_components/UserNavbar";
import { getAssessmentResult } from "../../../redux/actions/skill_assessment_actions/assessment_report_actions/AssessmentReportActions";
import { getSkillReport } from "../../../services/skill_assessment_services/assessment_report_services/CodeAssessmentReport";

/**
 * CodingAssessmentReportView component fetches and displays coding assessment results.
 *
 * @component
 */
const CodingAssessmentReportView = () => {
  const { attemptId } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [assessments, setAssessments] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSkillReport(attemptId);
        console.log(res.data.skillResults[0]);
        const { data } = res;
        dispatch(getAssessmentResult(data.skillResults[0]));
        setData(data);
        setUser(data.user);
        setSchedule(data.scheduleAssessment);
        setAssessments(data.scheduleAssessment.assessment);
        setResult(data.skillResults);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Handle error state or show a user-friendly message
      }
    };

    fetchData();
  }, [attemptId, dispatch]);

  return (
    <Box
      sx={{
        position: "fixed",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          bgcolor: "#020357",
          zIndex: 1200,
          height: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {sessionStorage.getItem("reportPage") !== null ? (
          <SkillAssessmentNavbar report={true} />
        ) : localStorage.getItem("userType") === "ADMIN" ?
          <AdminNavbar />
          : (
            <UserNavbar />
          )}
      </Box>

      <Box
        sx={{
          marginTop: "50px",
          flex: "1 0 auto",
          overflow: "hidden",
        }}
      >
        {sessionStorage.getItem("reportPage") !== null ? (
          <OverallScore
            data={data}
            result={result}
            user={user}
            assessments={assessments}
            schedule={schedule}
          />
        ) : (
          <div className="mt-2">
            <OverallScore
              data={data}
              result={result}
              user={user}
              assessments={assessments}
              schedule={schedule}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default CodingAssessmentReportView;
