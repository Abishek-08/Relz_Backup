import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AddLearningAssessmentQuestionAdmin from "../components/admin_module_components/AdminLearningAssessment/AddLearningAssessmentQuestionAdmin";
import CreateSkillAssessmentAdmin from "../components/admin_module_components/ScheduleSkillAssessment/CreateSkillAssessmentAdmin";
import AssessmentScheduleRedux from "../components/admin_module_components/Skill_Assessment_Admin/AssessmentScheduleRedux";
import ProctorSkill from "../components/admin_module_components/Skill_Assessment_Admin/ProctorSkill";
import AdminAddSkillQuestionView from "../views/admin_module_views/AdminAddSkillQuestionView";
import { AdminDashboardView } from "../views/admin_module_views/AdminDashboardView";
import KnowledgeAssessmentScheduleViewStep from "../views/admin_module_views/Admin_Knowledge_Assessment/KnowledgeAssessmentScheduleViewStep";
import KnowledgeQuestionPickViewStep from "../views/admin_module_views/Admin_Knowledge_Assessment/KnowledgeQuestionPickViewStep";
import CreateAssessmentViewStep from "../views/admin_module_views/Admin_Skill_Assessment/CreateAssessmentViewStep";
import ProctorSkillViewStep from "../views/admin_module_views/Admin_Skill_Assessment/ProctorSkillViewStep";
import SkillAssessmentScheduleViewStep from "../views/admin_module_views/Admin_Skill_Assessment/SkillAssessmentScheduleViewStep";
import SkillQuestionPickViewStep from "../views/admin_module_views/Admin_Skill_Assessment/SkillQuestionPickViewStep";
import Adminnavbar from "../views/admin_module_views/Adminnavbar";
import AllBatch from "../views/admin_module_views/AllBatch";
import ViewUser from "../views/admin_module_views/ViewUser";
import AssessmentFeedback from "../views/admin_module_views/Admin_Knowledge_Assessment/AssessmentFeedbackFormView";

/* login and user-module imports starts here */
//Landing Page View
import ForgotPassword from "../components/user_module_components/login_components/ForgotPassword";
import FeedbackForm from "../components/user_module_components/user_components/FeedbackForm";
import SkillAssessmentInstruction from "../components/user_module_components/user_components/SkillAssessmentInstruction";
import LandingView from "../views/LandingView";
import LeaderboardView from "../views/user_module_views/leaderboard_view/LeaderboardView";
import LoginView from "../views/user_module_views/login_view/LoginView";
import OtpView from "../views/user_module_views/login_view/OtpView";
import ResetPasswordView from "../views/user_module_views/login_view/ResetPasswordView";
import SecurityQuestionsVerifyView from "../views/user_module_views/login_view/SecurityQuestionsVerifyView";
import SecurityQuestionsView from "../views/user_module_views/login_view/SecurityQuestionsView";
import UpdatePasswordView from "../views/user_module_views/login_view/UpdatePasswordView";
import DashboardView from "../views/user_module_views/profile_view/DashboardView";
import UpdateView from "../views/user_module_views/profile_view/UpdateView";
import ScheduledAssessmentsView from "../views/user_module_views/scheduledassessment_view/ScheduledAssessmentsView";
import ScorecardDetailsView from "../views/user_module_views/scorecard_view/ScorecardDetailsView";
/*login and user-module imports ends here */

import { AddUserIntoBatch } from "../views/admin_module_views/AddUserIntoBatch";
import BatchView from "../views/admin_module_views/BatchView";
import IndividualReportsView from "../views/admin_module_views/IndividualReportsView";

//Skill Assessment
import AddBulkQuestions from "../views/learning_assessment_views/AddBulkQuestions";
import AddSingleQuestions from "../views/learning_assessment_views/AddSingleQuestions";
import GetAllLearningQuestionsAnswersView from "../views/learning_assessment_views/GetAllLearningQuestionsAnswersView";
import LearningAssessmentSingleQuestionUpdate from "../views/learning_assessment_views/LearningAssessmentSingleQuestionUpdate";
import AddCodingQuestionView from "../views/skill_assessment_views/coding_question_views/AddCodingQuestionView";
import AllCodingQuestionView from "../views/skill_assessment_views/coding_question_views/AllCodingQuestionView";

//learning Assessment
import CreateLearningProctor from "../components/admin_module_components/AdminLearningAssessment/CreateLearningProctor";
import AdminLearningDetailedReport from "../components/admin_module_components/AssessementReports/AdminLearningDetailedReport";
import UnMappedUserSkillReport from "../components/admin_module_components/AssessementReports/UnMappedUserSkillReport";
import AssessmentScheduling from "../components/admin_module_components/AssessmentScheduling";
import UserRequestAdmin from "../components/admin_module_components/UserRequest/UserRequestAdmin";
import ViewAllScheduling from "../components/admin_module_components/ViewAllScheduling";
import SingleQuestionUpdate from "../components/learningassessment_module_components/SingleQuestionUpdate";
import ErrorPage from "../components/user_module_components/login_components/ErrorPage";
import AddUserView from "../views/admin_module_views/AddUserView";
import AdminFeedbackView from "../views/admin_module_views/AdminFeedbackView";
import AdminSkillAssessmentBatchReport from "../views/admin_module_views/AdminSkillAssessmentBatchReport";
import AdminUpdatePasswordView from "../views/admin_module_views/AdminUpdatePasswordView";
import BulkUserUploadView from "../views/admin_module_views/BulkUserUploadView";
import FeedbackUserDetailsView from "../views/admin_module_views/FeedbackUserDetailsView";
import KnowledgeAssessmentBatchReportView from "../views/admin_module_views/KnowledgeAssessmentBatchReportView";
import KnowledgeAssessmentIndividualReportView from "../views/admin_module_views/KnowledgeAssessmentIndividualReportView";
import KnowledgeAssessmentWiseReportView from "../views/admin_module_views/KnowledgeAssessmentWiseReportView";
import ReportTreeViewPage from "../views/admin_module_views/ReportTreeViewPage";
import SkillBatchwiseUserReportView from "../views/admin_module_views/SkillBatchwiseUserReportView";
import ViewAllAssessmentView from "../views/admin_module_views/ViewAllAssessmentView";
import ViewAllLearningAssessmentView from "../views/admin_module_views/ViewAllLearningAssessmentView";
import KnowledgeAssessmentDetailReportView from "../views/learning_assessment_views/KnowledgeAssessmentDetailReportView";
import LearningAssessmentEngineView from "../views/learning_assessment_views/LearningAssessmentEngineView";
import LearningAssessmentLandingPageView from "../views/learning_assessment_views/LearningAssessmentLandingPageView";
import LearningAssessmentPreviewView from "../views/learning_assessment_views/LearningAssessmentPreviewView";
import LearningDetailedReportsAdminSide from "../views/learning_assessment_views/LearningDetailedReportsAdminSide";
import CodingAssessmentLoadingView from "../views/skill_assessment_views/assessment_page_view/CodingAssessmentLoadingView";
import CodingAssessmentView from "../views/skill_assessment_views/assessment_page_view/CodingAssessmentView";
import CodingQuestionAttemptStatusView from "../views/skill_assessment_views/assessment_page_view/CodingQuestionAttemptStatusView";
import CodingAssessmentReportView from "../views/skill_assessment_views/assessment_report_view/CodingAssessmentReportView";
import SkillSubmissionView from "../views/user_module_views/submissionpage_view/SkillSubmissionView";
import ProtectedRoute from "./ProtectedRoute";
import UserRequestHistory from "../components/admin_module_components/UserRequest/UserRequestHistory";

const MainRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let [userType, setUserType] = useState(null);

  useEffect(() => {
    setIsLoggedIn(JSON.parse(localStorage.getItem("loggedIn")) || false);
    setUserType(localStorage.getItem("userType") || null);
  }, [isLoggedIn, userType]);

  return (
    <Router basename="/cap">
      <Routes>
        <Route path="/" element={<LandingView />} />
        {/* Redirect logged-in users away from login page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={`/${userType?.toLowerCase()}dashboard`} />
            ) : (
              <LoginView />
            )
          }
        />
        <Route path="/verifyOtp" element={<OtpView />} />
        <Route
          path="/securityquestionsview"
          element={<SecurityQuestionsView />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPasswordView />} />
        <Route
          path="/securityquestionsverifyview"
          element={<SecurityQuestionsVerifyView />}
        />
        {/* User-module routes starts here*/}

        <Route path="*" element={<ErrorPage />} />

        {/* Protected routes starts here */}
        {/* User-module protected routes starts here*/}
        <Route element={<ProtectedRoute requiredRole="USER" />}>
          <Route path="/updateprofile" element={<UpdateView />} />
          <Route path="/userdashboard" element={<DashboardView />} />
          <Route path="/updatepasswordview" element={<UpdatePasswordView />} />

          <Route path="/leaderboard" element={<LeaderboardView />} />

          <Route
            path="/scheduledLearning/skill"
            element={<ScheduledAssessmentsView assessmentType="skill" />}
          />
          <Route
            path="/scheduledAsssessments"
            element={<ScheduledAssessmentsView assessmentType="learning" />}
          />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route
            path="assessmentInstruction/skill"
            element={<SkillAssessmentInstruction />}
          />
          <Route
            path="/scorecard"
            element={<ScorecardDetailsView type="skill" />}
          />
          <Route
            path="/preview"
            element={<LearningAssessmentPreviewView />}
          ></Route>
          <Route
            path="/skillsubmission/:attemptId"
            element={<SkillSubmissionView />}
          />
          <Route
            path="/knowledgeAssessmentLandingPage"
            element={<LearningAssessmentLandingPageView />}
          ></Route>
        </Route>
        {/* User-module protected routes starts here*/}

        {/* Admin-module */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/viewalluser" element={<ViewUser />} />
          <Route path="/viewAllBatch" element={<AllBatch />} />
          <Route path="/adminnavbar" element={<Adminnavbar />} />
          <Route path="/adduserintobatch" element={<AddUserIntoBatch />} />
          <Route path="/batchview" element={<BatchView />} />
          <Route path="/admindashboard" element={<AdminDashboardView />} />
          <Route
            path="/adminupdatepasswordview"
            element={<AdminUpdatePasswordView />}
          />
          <Route path="/userRequest" element={<UserRequestAdmin />} />
          <Route path="/userrequesthistory" element={<UserRequestHistory />} />
          {/* Report*/}
          <Route
            path="/adminbatchreportview"
            element={<ReportTreeViewPage />}
          />
          <Route
            path="/adminskillreport"
            element={<AdminSkillAssessmentBatchReport />}
          />
          <Route
            path="/adminKnowledgereport"
            element={<KnowledgeAssessmentBatchReportView />}
          />
          <Route
            path="/adminskillbatchwisereport"
            element={<SkillBatchwiseUserReportView />}
          />
          <Route
            path="/knowledgeassessmentindividualreport"
            element={<KnowledgeAssessmentIndividualReportView />}
          />
          <Route
            path="/knowledgeAssessmentreport"
            element={<KnowledgeAssessmentWiseReportView />}
          />

          <Route path="/adminfeedback" element={<AdminFeedbackView />} />
          <Route path="/individualreport" element={<IndividualReportsView />} />

          <Route
            path="/feedbackuserdetails/:assessmentId"
            element={<FeedbackUserDetailsView />}
          />
          <Route path="/bulkuseruploadview" element={<BulkUserUploadView />} />
          <Route
            path="/createskillassessment"
            element={<CreateSkillAssessmentAdmin />}
          />
          <Route
            path="/assessmentscheduling"
            element={<AssessmentScheduling />}
          />
          <Route path="/adduser" element={<AddUserView />} />
          <Route
            path="/viewAllAssessment"
            element={<ViewAllAssessmentView />}
          />
          <Route path="/viewAllScheduling" element={<ViewAllScheduling />} />
          <Route path="/learningProctor" element={<CreateLearningProctor />} />
          <Route
            path="/addLearningAssessmentQuestionAdmin"
            element={<AddLearningAssessmentQuestionAdmin />}
          />
          <Route
            path="/viewlearningassessment"
            element={<ViewAllLearningAssessmentView />}
          />
          <Route
            path="/adminaddskillquestion"
            element={<AdminAddSkillQuestionView />}
          />
          <Route
            path="/adminlearningdetailedreport"
            element={<AdminLearningDetailedReport />}
          />
          <Route
            path="/unmappeduserskillreport"
            element={<UnMappedUserSkillReport />}
          />
          <Route path="/proctorskill" element={<ProctorSkill />} />
          <Route
            path="/skillquestionpick"
            element={<SkillQuestionPickViewStep />}
          />
          <Route
            path="/assessmentscheduleredux"
            element={<AssessmentScheduleRedux />}
          />
          <Route
            path="/createassessmentstep"
            element={<CreateAssessmentViewStep />}
          />
          <Route path="/proctorstep" element={<ProctorSkillViewStep />} />
          <Route
            path="/skillquestionpickstep"
            element={<SkillQuestionPickViewStep />}
          />
          <Route
            path="/skillassessmentschedulestep"
            element={<SkillAssessmentScheduleViewStep />}
          />
          <Route
            path="knowledgequestionpickstep"
            element={<KnowledgeQuestionPickViewStep />}
          />
          <Route
            path="knowledgeschedulestep"
            element={<KnowledgeAssessmentScheduleViewStep />}
          />
          <Route path="feedbackform" element={<AssessmentFeedback />} />

          {/* learner-module */}
          <Route path="/addSingleQuestion" element={<AddSingleQuestions />} />

          <Route
            path="/allknowledgeQuestions"
            element={<GetAllLearningQuestionsAnswersView />}
          />

          <Route
            path="/bulkQuestionUpload"
            element={<AddBulkQuestions />}
          ></Route>
          <Route
            path="/SingleQuestionUpdate/:id"
            element={<LearningAssessmentSingleQuestionUpdate />}
          />
          <Route
            path="/knowledgeReportAdminSide"
            element={<LearningDetailedReportsAdminSide />}
          ></Route>
        </Route>

        <Route
          path="/knowledgeEngineScreen"
          element={<LearningAssessmentEngineView />}
        ></Route>
        <Route
          path="/knowledgeDetailReport/:schedulingId/:userId"
          element={<KnowledgeAssessmentDetailReportView />}
        ></Route>

        <Route
          path="/SingleQuestionUpdate/:id"
          element={<SingleQuestionUpdate />}
        />

        {/* Skill assessment module */}
        <Route path="/addcodingquestion" element={<AddCodingQuestionView />} />
        <Route path="/allcodingquestion" element={<AllCodingQuestionView />} />
        <Route
          path="/codingassessmentloading"
          element={<CodingAssessmentLoadingView />}
        />

        <Route
          path="/codingassessmentpage"
          element={<CodingAssessmentView />}
        />

        <Route
          path="/attemptstatus"
          element={<CodingQuestionAttemptStatusView />}
        />

        <Route
          path="/knowledgeReportAdminSide"
          element={<LearningDetailedReportsAdminSide />}
        ></Route>

        <Route
          path="/codereport/:attemptId"
          element={<CodingAssessmentReportView />}
        />
        {/* Protected routes ends here */}
      </Routes>
    </Router>
  );
};
export default MainRouter;
