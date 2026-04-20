const feedbackUserDao = require("../dao/FeedbackUserDao");
const eventDao = require("../dao/EventDao");
const PwaIdempotencyKeyDao = require("../dao/PwaIdempotencyKeyDao");
const jwt = require("jsonwebtoken");
const { decryptToken } = require("../utils/encryptDecryptToken");
const logger = require("../logger");

exports.createFeedbackUser = async (data) => {
  const { feedbackUserName, feedbackUserEmail, eventId } = data;

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackUserData = {
    feedbackUserName,
    feedbackUserEmail,
    event: event._id,
  };

  return await feedbackUserDao.createFeedbackUser(feedbackUserData);
};

exports.getFeedbackUserById = async (feedbackUserId) => {
  const feedbcakUser =
    await feedbackUserDao.getFeedbackUserById(feedbackUserId);

  if (!feedbcakUser) {
    throw new Error("No Feedback user found for this ID");
  }

  return feedbcakUser;
};

exports.getAllFeedbackUsers = async () => {
  const response = feedbackUserDao.getAllFeedbackUsers();

  if (!response) {
    throw new Error("No Feedback users found!");
  }

  return response;
};

exports.updateFeedbackUserById = async (feedbackUserId, data) => {
  const updatedFeedbackUser = await feedbackUserDao.updateFeedbackUserById(
    feedbackUserId,
    data,
  );
  if (!updatedFeedbackUser) {
    throw new Error("No feedback user found");
  }
  return updatedFeedbackUser;
};

exports.deleteFeedbackUserById = async (feedbackUserId) => {
  const feedbackUser =
    await feedbackUserDao.deleteFeedbackUserById(feedbackUserId);

  if (!feedbackUser) {
    throw new Error("No Feedback user found for this ID");
  }

  return feedbackUser;
};

exports.getFeedbackUsersByEventId = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackUser = await feedbackUserDao.getFeedbackUserByEventId(
    event._id,
  );

  if (!feedbackUser) {
    throw new Error("No Feedback users found for this event");
  }
  return feedbackUser;
};

exports.confirmFeedbackStatus = async (token) => {
  if (!token) {
    throw new Error("Missing token");
  }

  let decoded;
  try {
    const decryptedToken = decryptToken(token);
    decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  const { email, eventId } = decoded;

  if (!email || !eventId) {
    throw new Error("Token missing email or eventId");
  }

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackUserCheck = await feedbackUserDao.emailVerification(
    event._id,
    email,
  );
  if (!feedbackUserCheck) {
    throw new Error("Feedback user not found");
  }

  if (feedbackUserCheck.isVerified === true) {
    return {
      ...(feedbackUserCheck.toObject?.() || feedbackUserCheck),
      alreadyVerified: true,
    };
  }

  const feedbackUser = await feedbackUserDao.verifyFeedbackUser(
    email,
    event._id,
  );
  if (!feedbackUser) {
    throw new Error("Feedback user not found");
  }

  return {
    ...(feedbackUser.toObject?.() || feedbackUser),
    alreadyVerified: false,
  };
};

exports.getFeedbackUserCount = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackUserCount =
    await feedbackUserDao.getFeedbackTotalUserCountByEventId(event._id);

  if (!feedbackUserCount) {
    throw new Error("Feedback user count not found");
  }

  return feedbackUserCount;
};

exports.getFeedbackAnonymousCount = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackAnonymousCount =
    await feedbackUserDao.getFeedbackAnonymousCountByEventId(event._id);

  if (feedbackAnonymousCount === 0) {
    return 0;
  }
  if (!feedbackAnonymousCount) {
    throw new Error("Feedback anonymous count not found");
  }

  return feedbackAnonymousCount;
};

exports.getEmailVerification = async (email, eventId) => {
  logger.info(email);
  console.log(email);
  logger.info(eventId);
  console.log(eventId);
  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not Found");
  }

  const userResponse = await feedbackUserDao.emailVerification(
    event._id,
    email,
  );

  return userResponse;
};
