const logger = require('../logger');
const feedbackQuestion = require('../models/FeedbackQuestion');
const mongoose = require('mongoose');

exports.saveFeedbackQuestion = async (feedbackQuestionData) => {
    return await feedbackQuestion.create(feedbackQuestionData);
};

exports.getFeedbackQuestionsByEventId = async(eventId) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error(`Invalid Event Id ${eventId}`);
    }
    return await feedbackQuestion.find({ event: new mongoose.Types.ObjectId(eventId) });
}

exports.getFeedbackQuestionById = async(feedbackQuestionId) => {
    return await feedbackQuestion.findOne({feedbackQuestionId});

}

exports.getAllFeedbackQuestions = async() => {
    return await feedbackQuestion.find();
}



exports.getFeedbackQuestionsByEventCategoryId = async (eventCategoryId) => {
    const questions = await feedbackQuestion.find()
        .select('_id feedbackQuestion feedbackQuestionId event') 
        .populate({
            path: 'event',
            populate: {
                path: 'eventCategory'
            }
        });
    logger.info('Raw questions length:', questions.length);

    const filteredQuestions = questions
        .filter(q =>
            q.event &&
            q.event.eventCategory &&
            q.event.eventCategory.eventCategoryId === Number(eventCategoryId)
        )
        .map(q => ({
            _id: q._id,
            feedbackQuestionId: q.feedbackQuestionId,
            feedbackQuestion: q.feedbackQuestion
        }));
    logger.info('Filtered questions length:', filteredQuestions.length);
    return filteredQuestions;
};



exports.getFeedbackQuestionsByEventCategoryAndEventId = async (eventCategoryId, eventId) => {
    logger.info("eventCategory",eventCategoryId);
    console.log("eventCategory",eventCategoryId);
    logger.info(eventId);
    console.log(eventId);
    const questions = await feedbackQuestion.find()
        .select('_id feedbackQuestion feedbackQuestionId event') 
        .populate({
            path: 'event',
            populate: {
                path: 'eventCategory'
            }
        });
    logger.info('Raw questions length:', questions.length);

    const filteredQuestions = questions
        .filter(q =>
            q.event &&
            q.event.eventCategory &&
            q.event.eventCategory.eventCategoryId === Number(eventCategoryId) &&
            q.event.eventId === Number(eventId)
        )
        .map(q => ({
            _id: q._id,
            feedbackQuestionId: q.feedbackQuestionId,
            feedbackQuestion: q.feedbackQuestion
        }));
    logger.info('Filtered questions length:', filteredQuestions.length);

    return filteredQuestions;
};
