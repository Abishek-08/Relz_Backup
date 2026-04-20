const surveyUserDao = require('../../dao/SurveyDao/SurveyUserDao');
const eventDao = require('../../dao/EventDao');
const jwt = require('jsonwebtoken');
const { decryptToken } = require('../../utils/encryptDecryptToken');
const logger = require('../../logger');

/**
 * Create a new survey user
 */
exports.createSurveyUser = async (data) => {
  const { surveyUserEmail, eventId } = data;

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const surveyUserData = {
    surveyUserEmail,
    event: event._id
  };

  const createdUser = await surveyUserDao.createSurveyUser(surveyUserData);
  logger.info("Survey user created successfully", { surveyUserId: createdUser.surveyUserId });
  return createdUser;
};

/**
 * Get survey user by ID
 */
exports.getSurveyUserById = async (surveyUserId) => {
  const surveyUser = await surveyUserDao.getSurveyUserById(surveyUserId);

  if (!surveyUser) {
    throw new Error("No Survey user found for this ID");
  }

  return surveyUser;
};

/**
 * Get all survey users
 */
exports.getAllSurveyUsers = async () => {
  const response = await surveyUserDao.getAllSurveyUsers();

  if (!response || response.length === 0) {
    throw new Error("No Survey users found!");
  }

  return response;
};

/**
 * Update survey user by ID
 */
exports.updateSurveyUserById = async (surveyUserId, data) => {
  const updatedSurveyUser = await surveyUserDao.updateSurveyUserById(surveyUserId, data);
  if (!updatedSurveyUser) {
    throw new Error("No survey user found");
  }
  logger.info("Survey user updated successfully", { surveyUserId });
  return updatedSurveyUser;
};

/**
 * Delete survey user by ID
 */
exports.deleteSurveyUserById = async (surveyUserId) => {
  const surveyUser = await surveyUserDao.deleteSurveyUserById(surveyUserId);

  if (!surveyUser) {
    throw new Error("No Survey user found for this ID");
  }

  logger.info("Survey user deleted successfully", { surveyUserId });
  return surveyUser;
};

/**
 * Get survey users by Event ID
 */
exports.getSurveyUsersByEventId = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const surveyUsers = await surveyUserDao.getSurveyUsersByEventId(event._id);

  if (!surveyUsers || surveyUsers.length === 0) {
    throw new Error("No Survey users found for this event");
  }

  return surveyUsers;
};

/**
 * Confirm survey user status via token
 */
exports.confirmSurveyStatus = async (token) => {
  if (!token) {
    throw new Error('Missing token');
  }

  let decoded;
  try {
    const decryptedToken = decryptToken(token);
    decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }

  const { email, eventId } = decoded;

  if (!email || !eventId) {
    throw new Error('Token missing email or eventId');
  }

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const surveyUserCheck = await surveyUserDao.emailVerification(event._id, email);
  if (!surveyUserCheck) {
    throw new Error('Survey user not found');
  }

  if (surveyUserCheck.isVerified === true) {
    return {
      ...surveyUserCheck.toObject?.() || surveyUserCheck,
      alreadyVerified: true
    };
  }

  const surveyUser = await surveyUserDao.verifySurveyUser(email, event._id);
  if (!surveyUser) {
    throw new Error('Survey user not found');
  }

  return {
    ...surveyUser.toObject?.() || surveyUser,
    alreadyVerified: false
  };
};

/**
 * Get survey user count by Event ID
 */
exports.getSurveyUserCount = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const surveyUserCount = await surveyUserDao.getSurveyTotalUserCountByEventId(event._id);

  if (!surveyUserCount) {
    throw new Error('Survey user count not found');
  }

  return surveyUserCount;
};

/**
 * Get anonymous survey user count by Event ID
 */
exports.getSurveyAnonymousCount = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const surveyAnonymousCount = await surveyUserDao.getSurveyAnonymousCountByEventId(event._id);

  if (surveyAnonymousCount === 0) {
    return 0;
  }
  if (!surveyAnonymousCount) {
    throw new Error('Survey anonymous count not found');
  }

  return surveyAnonymousCount;
};

/**
 * Get email verification for survey user
 */
exports.getEmailVerification = async (email, eventId) => {
  logger.info("Verifying survey user email", { email, eventId });

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error("Event not Found");
  }

  const userResponse = await surveyUserDao.emailVerification(event._id, email);

  return userResponse;
};
