const surveyResponseDao = require("../../dao/SurveyDao/SurveyResponseDao");
const surveyQuestionTemplateDao = require("../../dao/SurveyDao/SurveyQuestionTemplateDao");
const surveyUserDao = require("../../dao/SurveyDao/SurveyUserDao");
const eventDao = require("../../dao/EventDao");
const logger = require("../../logger");
const { sendSurveySummaryEmail } = require("../../utils/surveyEmailService");
/**
 * Create multiple survey responses for a user in an event
 */
exports.createMultipleSurveyResponses = async (
  surveyUserId,
  eventId,
  responses,
  isAnonymous,
) => {
  let event, surveyUser;
  try {
    [event, surveyUser] = await Promise.all([
      eventDao.getEventById(eventId),
      surveyUserDao.getSurveyUserById(surveyUserId),
    ]);
  } catch (err) {
    logger.error("Database fetch failed while creating survey responses", {
      error: err.message,
    });
    throw new Error("Database fetch failed");
  }

  if (!event) {
    logger.warn("Event not found while creating survey responses", { eventId });
    throw new Error("Event Not Found");
  }
  if (!surveyUser) {
    logger.warn("Survey user not found while creating survey responses", {
      surveyUserId,
    });
    throw new Error("Survey user not found");
  }

  const savedResponses = await Promise.all(
    responses.map(async (item) => {
      const surveyQuestion =
        await surveyQuestionTemplateDao.getSurveyQuestionTemplateById(
          item.surveyQuestionId,
        );
      if (!surveyQuestion || surveyQuestion.length === 0) {
        logger.warn("Survey question not found while saving response", {
          surveyQuestionId: item.surveyQuestionId,
        });
        throw new Error(`Survey Question ${item.surveyQuestionId} not found`);
      }

      return surveyResponseDao.createSurveyResponse({
        surveyQuestion: surveyQuestion[0]._id,
        surveyResponse: item.surveyResponse,
        surveyUser: surveyUser._id,
        event: event._id,
      });
    }),
  );

  const userResponsesForThisUser =
    await surveyResponseDao.getSurveyResponsesByEventAndUser(
      event._id,
      surveyUser._id,
    );

  const isTrulyAnonymous =
    Boolean(isAnonymous) === true ||
    String(surveyUser.surveyUserEmail).trim().toLowerCase() === "anonymous";

  if (!isTrulyAnonymous) {
    setImmediate(() => {
      sendSurveySummaryEmail(surveyUser, event, userResponsesForThisUser).catch(
        (err) => {
          logger.error("Async survey email failed", { error: err.message });
        },
      );
    });
    logger.info("Survey responses saved for non-anonymous user", {
      surveyUserId,
      eventId,
    });
  } else {
    logger.info("Skipping email for anonymous survey user", {
      surveyUserId,
      eventId,
    });
  }

  return savedResponses;
};

/**
 * Get user survey responses by Event ID
 */
exports.getUserSurveyResponsesByEventId = async (eventId) => {
  if (!eventId) {
    logger.warn("Event ID required for fetching user survey responses");
    throw new Error("Event Id required");
  }

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    logger.warn("Event not found while fetching user survey responses", {
      eventId,
    });
    throw new Error("Event not Found");
  }

  const userResponses = await surveyResponseDao.getSurveyResponsesByEventId(
    event._id,
  );
  if (!userResponses || userResponses.length === 0) {
    logger.warn("No survey responses found for event", { eventId });
    throw new Error("User Responses not Found");
  }

  logger.info("Fetched user survey responses by Event ID", {
    eventId,
    count: userResponses.length,
  });
  return userResponses;
};

/**
 * Get survey response count by Event ID
 */
exports.getSurveyResponseCountByEventId = async (eventId) => {
  const event = await eventDao.getEventById(eventId);
  if (!event) {
    logger.warn("Event not found while counting survey responses", { eventId });
    throw new Error("Event not Found");
  }

  const count = await surveyResponseDao.getSurveyResponseCountByEventId(
    event._id,
  );
  logger.info("Survey response count fetched successfully", { eventId, count });
  return count;
};
