import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage/LandingPage";
import LoginPage from "../components/Login/LoginPage";
import ViewAllEvents from "../components/EventManagement/ViewAllEvents";
import HomePage from "../components/HomePage/HomePage";
import Events from "../components/EventManagement/Events";
import MediaUploader from "../components/Media/MediaUploader";
import NotFound from "../utils/NotFound";
import UserRoutes from "./UserRoutes";
import Unauthorized from "../utils/Unauthorized";
import FeedbackConfirmation from "../components/FeedbackUserConfirm/FeedbackConfirmation";
import FeedbackResponse from "../components/EventManagement/FeedbackResponse";
import FeedbackResponseFlow from "../components/FeedbackFlow/FeedbackResponseFlow";
import SocketTracker from "../components/SocketTracker/SocketTracker";
import ManageEventManager from "../components/Admin/ManageEventManager";
import AdminRoutes from "./AdminRoutes";
import SurveyConfirmation from "../components/Survey/SurveyConfirmation/SurveyConfirmation";
import SurveyBuilderPage from "../components/Survey/SurveyBuilderMain/SurveyBuilderPage";
import SurveyPreviewProp from "../components/Survey/SurveyPreview/SurveyPreviewProp";
import SurveyResponse from "../components/Survey/SurveyResponse/SurveyResponse";
import ReportPage from "../components/Survey/SurveyReports/pages/ReportPage";
import EngagementHub from "../components/SocketTracker/EngagementHub";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/confirmFeedback" element={<FeedbackConfirmation />} />
      <Route path="/feedbackResponse" element={<FeedbackResponse />} />
      <Route path="/verifySurvey" element={<SurveyConfirmation />} />
      {/* Survey */}
      <Route
        path="/SurveyQuestionConfiguration"
        element={<SurveyBuilderPage />}
      />
      <Route path="/surveyPreview" element={<SurveyPreviewProp />} />
      <Route path="/surveyResponse" element={<SurveyResponse />} />

      <Route element={<UserRoutes />}>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/viewAllEvents" element={<ViewAllEvents />} />
        <Route path="/events/:eventId" element={<Events />} />
        <Route path="/mediaUploader" element={<MediaUploader />} />
        <Route path="/socketDashboard" element={<SocketTracker />} />
        <Route path="/feedbackCollection" element={<FeedbackResponseFlow />} />
        <Route path="/reports/:eventId" element={<ReportPage />} />
      </Route>

      <Route element={<AdminRoutes />}>
        <Route path="/manageEventManager" element={<ManageEventManager />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route
        path="/engage/:isFeedbackAvail/:isSurveyAvail"
        element={<EngagementHub />}
      />
    </Routes>
  );
}
export default AppRouter;
