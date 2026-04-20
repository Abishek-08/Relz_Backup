import { useEffect } from "react";
import { subscribe, unsubscribe } from "./centrifugeManager";
import { useCentrifuge } from "./useCentrifuge";
import { useDispatch } from "react-redux";
import { addSurveyShownData } from "../redux/features/survey/surveySlice";
import { addfeedbackShownData } from "../redux/features/feedback/feedbackSlice";

export default function CentrifugeProvider({ isAuth }) {
  const connected = useCentrifuge(isAuth);
  const dispatch = useDispatch();

  console.log("from-provider--isAuth: ", isAuth, "connected: ", connected);

  useEffect(() => {
    if (!connected) return;

    console.log("📡 Subscribing Survey&Feedback channel");

    subscribe("SurveyNS:launchSurvey", {
      onPublication: (ctx) => {
        console.log("🔥 Survey Data:", ctx.data);
        dispatch(addSurveyShownData(ctx.data));
      },
    });

    subscribe("FeedbackNS:launchFeedback", {
      onPublication: (ctx) => {
        console.log("🔥 Feedback Data: ", ctx.data);
        dispatch(addfeedbackShownData(ctx.data));
      },
    });

    return () => {
      console.log("🚫 Unsubscribe Survey&Feedback channel");
      unsubscribe("SurveyNS:launchSurvey");
      unsubscribe("FeedbackNS:launchFeedback");
    };
  }, [connected, dispatch]);

  return null;
}
