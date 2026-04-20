const feedbackResponseDao = require('../dao/FeedbackResponseDao');
const feedbackQuestionDao = require('../dao/FeedbackQuestionDao')
const feedbackUserDao = require('../dao/FeedbackUserDao');
const eventDao = require('../dao/EventDao');
const { sendFeedbackEmail } = require('../utils/emailService');
const logger = require('../logger');



exports.createMultipleFeedbackResponses = async (feedbackUserId, eventId, responses, isAnonymous) => {
  let event, feedbackUser;
  try {
    [event, feedbackUser] = await Promise.all([
      eventDao.getEventById(eventId),
      feedbackUserDao.getFeedbackUserById(feedbackUserId)
    ]);
  } catch (err) {
    throw new Error("Database fetch failed");
  }

  if (!event) throw new Error("Event Not Found");
  if (!feedbackUser) throw new Error("Feedback user not found");

  const savedResponses = await Promise.all(
    responses.map(async (item) => {
      const feedbackQuestion = await feedbackQuestionDao.getFeedbackQuestionById(item.feedbackQuestionId);
      if (!feedbackQuestion) throw new Error(`Feedback Question ${item.feedbackQuestionId} not found`);

      return feedbackResponseDao.createFeedbackResponse({
        feedbackQuestion: feedbackQuestion._id,
        feedbackResponse: item.feedbackResponse,
        feedbackUser: feedbackUser._id,
        event: event._id
      });
    })
  );

  const isTrulyAnonymous =
    Boolean(isAnonymous) === true ||
    String(feedbackUser.feedbackUserEmail).trim().toLowerCase() === "anonymous";

  // if (!isTrulyAnonymous) {
  //   try {
  //      sendFeedbackEmail(feedbackUser, savedResponses);
  //   } catch (err) {
  //     console.error("Email sending failed:", err.message);
  //     throw new Error("Email sending failed!")
  //   }
  // } else {
  //   console.log("Skipping email for anonymous user");
  // }

  //sample try for optimizing the email delivery
  if (!isTrulyAnonymous) {
    setImmediate(() => {
      sendFeedbackEmail(feedbackUser, savedResponses)
        .catch(err => {
          logger.error("Async email failed:", err.message);
          console.error("Async email failed:", err.message);
        });
    });
  } else {
    logger.info("Skipping email for anonymous user");
    console.log("Skipping email for anonymous user");
  }
  
 


  return savedResponses;
};


exports.getUserResponseByEventId = async (eventId) => {
  if (!eventId) {
    throw new Error("Event Id required");
  }
  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not Found");
  }
  const userResponse = await feedbackResponseDao.getUserResponseByEventId(event._id);

  if (!userResponse) {
    throw new Error("User Response not Found");
  }

  return userResponse;
};

exports.getFeedbackResponseCount = async (eventId) => {
  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not Found");
  }
  const count = await feedbackResponseDao.getFeedbackResponseCount(event._id);

  return count;
}



exports.getUserResponseByEventId = async (eventId) => {
  if (!eventId) {
    throw new Error("Event Id required");
  }
  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not Found");
  }
  const userResponse = await feedbackResponseDao.getUserResponseByEventId(event._id);

  if (!userResponse) {
    throw new Error("User Response not Found");
  }

  return userResponse;
};





