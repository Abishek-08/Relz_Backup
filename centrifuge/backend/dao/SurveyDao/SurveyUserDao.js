const surveyUser = require("../../models/SurveyModel/SurveyUser");

/**
 * Create a new survey user
 */
exports.createSurveyUser = async (surveyUserData) => {
  return await surveyUser.create(surveyUserData);
};

/**
 * Get survey user by numeric ID
 */
exports.getSurveyUserById = async (surveyUserId) => {
  return await surveyUser.findOne({ surveyUserId });
};

/**
 * Get survey user by email
 */
exports.getSurveyUserByEmail = async (email) => {
  return await surveyUser.findOne({ surveyUserEmail: email });
};

/**
 * Get all survey users for a given event
 */
exports.getSurveyUsersByEventId = async (eventObjectId) => {
  return await surveyUser.find({ event: eventObjectId });
};

/**
 * Get all survey users
 */
exports.getAllSurveyUsers = async () => {
  return await surveyUser.find();
};

/**
 * Update survey user by ID
 */
exports.updateSurveyUserById = async (surveyUserId, updatedData) => {
  return await surveyUser.findOneAndUpdate({ surveyUserId }, updatedData, {
    new: true,
  });
};

/**
 * Delete survey user by ID
 */
exports.deleteSurveyUserById = async (surveyUserId) => {
  return await surveyUser.findOneAndDelete({ surveyUserId });
};

/**
 * Verify survey user (mark as verified)
 */
exports.verifySurveyUser = async (email, eventObjectId) => {
  return await surveyUser.findOneAndUpdate(
    { surveyUserEmail: email, event: eventObjectId },
    { isVerified: true },
    { new: true },
  );
};

/**
 * Get total survey user count by Event ID
 */
exports.getSurveyTotalUserCountByEventId = async (eventObjectId) => {
  return await surveyUser.countDocuments({ event: eventObjectId });
};

/**
 * Get anonymous survey user count by Event ID
 */
exports.getSurveyAnonymousCountByEventId = async (eventObjectId) => {
  return await surveyUser.countDocuments({
    event: eventObjectId,
    surveyUserEmail: "anonymous",
  });
};

/**
 * Email verification lookup
 */
exports.emailVerification = async (eventObjectId, email) => {
  return await surveyUser.findOne({
    event: eventObjectId,
    surveyUserEmail: email,
  });
};
