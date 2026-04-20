const PwaIdempotencyKeyDao = require("../dao/PwaIdempotencyKeyDao");
const feedbackUserDao = require("../dao/FeedbackUserDao");
const eventDao = require("../dao/EventDao");
const surveyUserDao = require("../dao/SurveyDao/SurveyUserDao");
const employeeService = require("../services/EmployeeService");
const feedbackResponseService = require("../services/FeedbackResponseService");
const feedbackUserService = require("../services/FeedbackUserService");
const surveyResponseService = require("../services/SurveyService/SurveyResponseService");
const surveyUserService = require("../services/SurveyService/SurveyUserService");

exports.createIdempotency = async (key) => {
  const data = { key: key };
  return await PwaIdempotencyKeyDao.createIdempotency(data);
};

exports.getIdempotencyKey = async (key) => {
  if (await PwaIdempotencyKeyDao.getIdempotencyKey(key)) {
    console.log("key present");
    return true;
  } else {
    console.log("key not-present");
    return false;
  }
};

exports.offlineFeedbackSubmission = async (data) => {
  console.log("input-data: ", data);
  const alreadySubmittedEmails = [];
  const invalidSubmittedEmails = [];

  await Promise.all(
    data.map(async (reqItem) => {
      console.log("lopp-cc");
      console.log("userPayload", reqItem.data.userPayload);

      let feedbackUserData;

      const { eventId, feedbackUserEmail } = reqItem.data.userPayload;
      let { feedbackUserName } = reqItem.data.userPayload; // allow override later
      const { isAnonymous, responses } = reqItem.data.responsesPayload;

      // idempotency check
      const isKeyPresent = await exports.getIdempotencyKey(
        reqItem.idempotencyKey,
      );
      if (isKeyPresent) {
        throw new Error("Key already present - Duplicate Request");
      }

      // Email Validation
      const isValidEmail = await employeeService(feedbackUserEmail);
      console.log("isva: ", isValidEmail);

      if (feedbackUserEmail !== "anonymous" && isValidEmail.length === 0) {
        // invalid email → record and SKIP DB insert
        invalidSubmittedEmails.push(feedbackUserEmail);
        return; // <-- important: stop further processing for this item
      }

      console.log("Key-not-present");

      // fetch event
      const event = await eventDao.getEventById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // handle anonymous vs non-anonymous
      if (feedbackUserEmail !== "anonymous") {
        const result = await feedbackUserService.getEmailVerification(
          feedbackUserEmail,
          eventId,
        );

        if (!result) {
          console.log("Email verified and eligible:", result);

          // fetch employee name
          const userInfo = await employeeService(feedbackUserEmail);
          if (userInfo && userInfo[0]?.fullName) {
            feedbackUserName = userInfo[0].fullName;
          }

          feedbackUserData = {
            feedbackUserName,
            feedbackUserEmail,
            event: event._id,
          };
        } else {
          console.log("You have already submitted feedback for this event.");
          alreadySubmittedEmails.push(feedbackUserEmail);
        }
      } else {
        // anonymous case
        feedbackUserData = {
          feedbackUserName,
          feedbackUserEmail,
          event: event._id,
        };
      }

      // only proceed if we actually have feedbackUserData
      if (feedbackUserData) {
        console.log("feedbackuser", feedbackUserData);

        const { feedbackUserId } =
          await feedbackUserDao.createFeedbackUser(feedbackUserData);

        console.log("res-data: ", feedbackUserId);

        await feedbackResponseService.createMultipleFeedbackResponses(
          feedbackUserId,
          eventId,
          responses,
          isAnonymous,
        );
      }
    }),
  );

  console.log("list: ", alreadySubmittedEmails);
  return { alreadySubmittedEmails, invalidSubmittedEmails };
};

exports.offlineSurveySubmission = async (data) => {
  console.log("input-data: ", data);
  const alreadySubmittedEmails = [];
  const invalidSubmittedEmails = [];

  await Promise.all(
    data.map(async (reqItem) => {
      const surveyUserEmail = reqItem.data.surveyUserEmail;
      const eventId = reqItem.data.eventId;
      const responses = reqItem.data.responses;
      const isAnonymous = reqItem.data.isAnonymous;

      let surveyUserData;

      // idempotency check
      const isKeyPresent = await exports.getIdempotencyKey(
        reqItem.idempotencyKey,
      );
      if (isKeyPresent) {
        throw new Error("Key already present - Duplicate Request");
      }

      // Email Validation
      const isValidEmail = await employeeService(surveyUserEmail);
      console.log("isva: ", isValidEmail);

      if (surveyUserEmail !== "anonymous" && isValidEmail.length === 0) {
        // invalid email → record and SKIP DB insert
        invalidSubmittedEmails.push(surveyUserEmail);
        return; // <-- important: stop further processing for this item
      }

      // Event fetch - validation
      const event = await eventDao.getEventById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // handle anonymous vs non-anonymous
      if (surveyUserEmail !== "anonymous") {
        const result = await surveyUserService.getEmailVerification(
          surveyUserEmail,
          eventId,
        );

        if (!result) {
          console.log("Email verified and eligible:", result);

          surveyUserData = {
            surveyUserEmail,
            event: event._id,
          };
        } else {
          console.log("You have already submitted feedback for this event.");
          alreadySubmittedEmails.push(surveyUserEmail);
          return; // skip DB insert
        }
      } else {
        // anonymous case
        surveyUserData = {
          surveyUserEmail,
          event: event._id,
        };
      }

      // only proceed if we actually have surveyUserData
      if (surveyUserData) {
        console.log("surveyuser", surveyUserData);

        const createdUser =
          await surveyUserDao.createSurveyUser(surveyUserData);
        const surveryUserId = createdUser.surveyUserId;

        console.log("res-data: ", surveryUserId);

        await surveyResponseService.createMultipleSurveyResponses(
          surveryUserId,
          eventId,
          responses,
          isAnonymous,
        );
      }
    }),
  );

  // send already submitted email's
  console.log("list: ", alreadySubmittedEmails);
  console.log("invalid: ", invalidSubmittedEmails);
  return { alreadySubmittedEmails, invalidSubmittedEmails };
};
