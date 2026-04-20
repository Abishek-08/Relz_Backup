const centifuge = require("../centrifuge");
const FeedbackInfo = require("../models/FeedbackInformation");
const FeedbackQuestion = require("../models/FeedbackQuestion");
const SurveyInformation = require("../models/SurveyModel/SurveyInformation");
const SurveyQuestionTemplate = require("../models/SurveyModel/SurveyQuestionTemplate");

exports.registerFeedback = async (emailRaw) => {
  try {
    const email = emailRaw?.trim().toLowerCase();
    console.log("received Email: ", email);
    if (!email) return;

    const feedbackInfo = await FeedbackInfo.findOne({
      email: new RegExp(`^${email}$`, "i"),
      feedbackStatus: "launched",
    }).populate("event");

    if (!feedbackInfo) return;

    const rawQuestions = await FeedbackQuestion.find({
      event: feedbackInfo.event?._id,
    });
    const questions = rawQuestions.map((q) => ({
      feedbackQuestionId: q.feedbackQuestionId || q._id,
      feedbackQuestion: q.feedbackQuestion,
    }));

    const registerFeedback_PublishData = {
      feedbackInfo,
      questions,
      eventId: feedbackInfo.event?.eventId,
      eventName: feedbackInfo.event?.eventName,
    };

    return registerFeedback_PublishData;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.registerSurvey = async (emailRaw) => {
  try {
    const email = emailRaw?.trim().toLowerCase();
    if (!email) return;

    const surveyInfo = await SurveyInformation.findOne({
      surveyOwnerEmail: new RegExp(`^${email}$`, "i"),
      surveyStatus: "launched",
    }).populate("event");

    if (!surveyInfo) {
      return;
    }

    const rawQuestions = await SurveyQuestionTemplate.find({
      event: surveyInfo.event?._id,
    });

    const questions = rawQuestions.map((q) => ({
      surveyQuestionId: q.surveyQuestionId || q._id,
      surveyQuestion: q.surveyQuestion,
      surveyQuestionType: q.surveyQuestionType,
      surveyCheckBoxOptions: q.surveyCheckBoxOptions,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      scaleLabels: q.scaleLabels,
      matrixQnLabels: q.matrixQnLabels,
      required: !!q.required,
      displayOrder: q.displayOrder,
    }));

    const registerSurveyData = {
      surveyInfo,
      questions,
      eventId: surveyInfo.event?.eventId,
      eventName: surveyInfo.event?.eventName,
    };

    return registerSurveyData;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.launchFeedback = async (emailRaw) => {
  const email = emailRaw?.trim().toLowerCase();
  if (!email) return;

  try {
    const updated = await FeedbackInfo.findOneAndUpdate(
      { email: new RegExp(`^${email}$`, "i"), feedbackStatus: "launched" },
      { $set: { masterSocket: "true" } },
      { new: true },
    ).populate("event");

    if (updated) {
      const rawQuestions = await FeedbackQuestion.find({
        event: updated.event?._id,
      });
      const questions = rawQuestions.map((q) => ({
        feedbackQuestionId: q.feedbackQuestionId || q._id,
        feedbackQuestion: q.feedbackQuestion,
      }));

      const launchFeedbackData = {
        feedbackInfo: updated,
        questions,
        eventId: updated.event?.eventId,
        eventName: updated.event?.eventName,
      };

      return await centifuge.launchFeedback(launchFeedbackData);
    }
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.launchSurvey = async (emailRaw) => {
  const email = emailRaw?.trim().toLowerCase();
  if (!email) return;

  try {
    const updated = await SurveyInformation.findOneAndUpdate(
      {
        surveyOwnerEmail: new RegExp(`^${email}$`, "i"),
        surveyStatus: "launched",
      },
      { $set: { masterSocket: "true" } },
      { new: true },
    ).populate("event");

    if (updated) {
      const rawQuestions = await SurveyQuestionTemplate.find({
        event: updated.event?._id,
      });
      const questions = rawQuestions.map((q) => ({
        surveyQuestionId: q.surveyQuestionId || q._id,
        surveyQuestion: q.surveyQuestion,
        surveyQuestionType: q.surveyQuestionType,
        surveyCheckBoxOptions: q.surveyCheckBoxOptions,
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        scaleLabels: q.scaleLabels,
        matrixQnLabels: q.matrixQnLabels,
        required: !!q.required,
        displayOrder: q.displayOrder,
      }));

      const launchSurveyData = {
        surveyInfo: updated,
        masterSocket: updated.masterSocket,
        questions,
        eventId: updated.event?.eventId,
        eventName: updated.event?.eventName,
      };

      return await centifuge.launchSurvey(launchSurveyData);
    } else {
      console.log(
        `[survey] launchSurvey: no launched survey found for ${email}`,
      );
    }
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.disconnectSubscrptionByUser = async (disconnectEmailList) => {
  if (disconnectEmailList.length == 0) return;
  try {
    for (const email of disconnectEmailList) {
      console.log(`${email}--disconnected`);
      centifuge.disconnectSubscrptionByUser(email);
    }
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.fetchPresenceInChannel = async (channel) => {
  if (!channel) return;
  try {
    return await centifuge.fetchPresenceInChannel(channel);
  } catch (err) {
    return err;
  }
};
