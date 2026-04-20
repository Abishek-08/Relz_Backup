const feedbackInformation = require('../models/FeedbackInformation');


exports.createFeedbackInformation = async (feedbackInformationData) => {
    return await feedbackInformation.create(feedbackInformationData);
};

exports.updateFeedbackStatus = async (eventObjId, feedbackStatus) => {
    return await feedbackInformation.findOneAndUpdate({ event: eventObjId }, { feedbackStatus: feedbackStatus }, { new: true })
};

exports.getFeedbackInformationByEvent = async (eventObjId) => {
    return await feedbackInformation.findOne({ event: eventObjId });
};

exports.updateFeedbackInformation = async (eventObjectId, updatedData) => {
    return await feedbackInformation.findOneAndUpdate({ event: eventObjectId }, updatedData, { new: true })
}

exports.reOpenFeedbackByEventId = async (eventObjectId, updatedFields) => {
    return await feedbackInformation.findOneAndUpdate({ event: eventObjectId }, { $set: { feedbackStatus: "launched", ...updatedFields } }, { new: true })
}