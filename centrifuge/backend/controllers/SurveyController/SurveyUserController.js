const surveyUserService = require('../../services/SurveyService/SurveyUserService');
const logger = require('../../logger');

/**
 * Controller: Create a new survey user
 */
exports.createSurveyUser = async (req, res) => {
  try {
    const surveyUser = await surveyUserService.createSurveyUser(req.body);
    logger.info('Survey user created successfully via controller', { surveyUserId: surveyUser.surveyUserId });
    return res.status(201).json({ success: true, data: surveyUser });
  } catch (err) {
    logger.error('Controller error: createSurveyUser', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey user by ID
 */
exports.getSurveyUserById = async (req, res) => {
  try {
    const { surveyUserId } = req.params;
    const surveyUser = await surveyUserService.getSurveyUserById(surveyUserId);

    if (!surveyUser) {
      return res.status(404).json({ success: false, message: 'Survey user not found' });
    }

    return res.status(200).json({ success: true, data: surveyUser });
  } catch (err) {
    logger.error('Controller error: getSurveyUserById', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get all survey users
 */
exports.getAllSurveyUsers = async (req, res) => {
  try {
    const surveyUsers = await surveyUserService.getAllSurveyUsers();

    if (!surveyUsers || surveyUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'No survey users found' });
    }

    return res.status(200).json({ success: true, data: surveyUsers });
  } catch (err) {
    logger.error('Controller error: getAllSurveyUsers', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Update survey user by ID
 */
exports.updateSurveyUserById = async (req, res) => {
  try {
    const { surveyUserId } = req.params;
    const updatedSurveyUser = await surveyUserService.updateSurveyUserById(surveyUserId, req.body);

    if (!updatedSurveyUser) {
      return res.status(404).json({ success: false, message: 'Survey user not found for update' });
    }

    return res.status(200).json({ success: true, data: updatedSurveyUser });
  } catch (err) {
    logger.error('Controller error: updateSurveyUserById', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Delete survey user by ID
 */
exports.deleteSurveyUserById = async (req, res) => {
  try {
    const { surveyUserId } = req.params;
    const deletedSurveyUser = await surveyUserService.deleteSurveyUserById(surveyUserId);

    if (!deletedSurveyUser) {
      return res.status(404).json({ success: false, message: 'Survey user not found for deletion' });
    }

    logger.info('Survey user deleted successfully via controller', { surveyUserId });
    return res.status(200).json({ success: true, data: deletedSurveyUser });
  } catch (err) {
    logger.error('Controller error: deleteSurveyUserById', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey users by Event ID
 */
exports.getSurveyUsersByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const surveyUsers = await surveyUserService.getSurveyUsersByEventId(eventId);

    if (!surveyUsers || surveyUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'No survey users found for this event' });
    }

    return res.status(200).json({ success: true, data: surveyUsers });
  } catch (err) {
    logger.error('Controller error: getSurveyUsersByEventId', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Confirm survey user status via token
 */
exports.confirmSurveyStatus = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const result = await surveyUserService.confirmSurveyStatus(token);

    return res.status(200).json({ email: result.surveyUserEmail,
      eventName: result.event.eventName,
      status: result.alreadyVerified
     });
  } catch (err) {
    logger.error('Controller error: confirmSurveyStatus', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey user count by Event ID
 */
exports.getSurveyUserCount = async (req, res) => {
  try {
    const { eventId } = req.query;
    const count = await surveyUserService.getSurveyUserCount(eventId);

    return res.status(200).json({ success: true, count });
  } catch (err) {
    logger.error('Controller error: getSurveyUserCount', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get anonymous survey user count by Event ID
 */
exports.getSurveyAnonymousCount = async (req, res) => {
  try {
    const { eventId } = req.query;
    const count = await surveyUserService.getSurveyAnonymousCount(eventId);

    return res.status(200).json({ success: true, count });
  } catch (err) {
    logger.error('Controller error: getSurveyAnonymousCount', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get email verification for survey user
 */
exports.getEmailVerification = async (req, res) => {
  try {
    const { email, eventId } = req.query;
    const userResponse = await surveyUserService.getEmailVerification(email, eventId);

    if (!userResponse) {
      return res.status(404).json({ success: false, message: 'Survey user not found for email verification' });
    }

    return res.status(200).json({ success: true, data: userResponse, message: "already-submitted" });
  } catch (err) {
    logger.error('Controller error: getEmailVerification', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};
