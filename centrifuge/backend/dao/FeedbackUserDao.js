const feedbackUser = require("../models/FeedbackUser");

exports.createFeedbackUser = async (userData) => {
  return await feedbackUser.create(userData);
};

exports.getFeedbackUserById = async (feedbackUserId) => {
  return await feedbackUser.findOne({ feedbackUserId });
};

exports.getFeedbackUserByEmail = async (feedbackUserEmail) => {
  return await feedbackUser.findOne({ feedbackUserEmail });
};

exports.getAllFeedbackUsers = async () => {
  return await feedbackUser.find();
};

exports.updateFeedbackUserById = async (feedbackUserId, updatedData) => {
  return await feedbackUser.findOneAndUpdate({ feedbackUserId }, updatedData, {
    new: true,
  });
};

exports.deleteFeedbackUserById = async (feedbackUserId) => {
  return await feedbackUser.findOneAndDelete({ feedbackUserId });
};

exports.getFeedbackUserByEventId = async (eventObjectId) => {
  return await feedbackUser.find({ event: eventObjectId });
};

exports.verifyFeedbackUser = async (email, eventObjectId) => {
  return await feedbackUser.findOneAndUpdate(
    { feedbackUserEmail: email, event: eventObjectId },
    { isVerified: true },
    { new: true },
  );
};

exports.getFeedbackTotalUserCountByEventId = async (eventObjectId) => {
  return await feedbackUser.countDocuments({ event: eventObjectId });
};

exports.getFeedbackAnonymousCountByEventId = async (eventObjectId) => {
  return await feedbackUser.countDocuments({
    event: eventObjectId,
    feedbackUserName: "anonymous",
    feedbackUserEmail: "anonymous",
  });
};

exports.emailVerification = async (eventObjectId, email) => {
  const existingResponse = await feedbackUser.findOne({
    event: eventObjectId,
    feedbackUserEmail: email,
  });

  return existingResponse;
};
