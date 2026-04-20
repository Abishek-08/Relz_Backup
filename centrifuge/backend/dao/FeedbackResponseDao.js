const feedbackResponse = require('../models/FeedbackResponse');

exports.createFeedbackResponse = async (feedbackResponseData) => {
    return await feedbackResponse.create(feedbackResponseData);
}

exports.getUserResponseByEventId = async (eventObjectId) => {
    // return await feedbackResponse.find({event:eventObjectId});
    const responses = await feedbackResponse.find({ event: eventObjectId })
        .select('_id feedbackResponseId feedbackQuestion feedbackResponse feedbackUser event') // main fields
        .populate({
            path: 'feedbackQuestion',
            select: '_id feedbackQuestion feedbackQuestionId'
        })
        .populate({
            path: 'feedbackUser',
            select: 'feedbackUserName feedbackUserEmail'
        })
        .populate({
            path: 'event',
            select: 'eventName eventDate eventStatus eventOrganizer'
        });

    return responses;

}

exports.getFeedbackResponseCount = async(eventObjId) => {
    return await feedbackResponse.countDocuments({event:eventObjId});
}



