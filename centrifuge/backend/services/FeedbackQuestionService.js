const feedbackQuestionDao = require('../dao/FeedbackQuestionDao');
const feedbackInformationDao = require('../dao/FeedbackInformationDao');
const eventDao = require('../dao/EventDao');
const eventCategoryDao = require('../dao/EventCategoryDao');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

// exports.addFeedbackQuestionForEvent = async ({ eventId, feedbackQuestion, email, masterSocket, isAnonymousFeedback, backgroundTheme }) => {

//     const backgroundThemeFilename = backgroundTheme?.filename || null;

//     const event = await eventDao.getEventById(eventId);
//     if (!event) {
//         throw new Error(`Event not found for this Id: ${eventId}`);
//     }

//     const feedbackQuestionData = {
//         event: event._id,
//         feedbackQuestion
//     }

//     const savedFeedbackQuestion = await feedbackQuestionDao.saveFeedbackQuestion(feedbackQuestionData);


//     let savedFeedbackInformation = await feedbackInformationDao.getFeedbackInformationByEvent(event._id);

//     if (!savedFeedbackInformation) {
//         const feedbackInformationData = {
//             feedbackStatus: 'launched',
//             email,
//             isAnonymousFeedback,
//             masterSocket,
//             totalNoOfResponse: 0,
//             totalNoOfUnknownResponse: 0,
//             event: event._id,
//             backgroundTheme: backgroundThemeFilename
//         };
//         savedFeedbackInformation = await feedbackInformationDao.createFeedbackInformation(feedbackInformationData);
//     }
//     await eventDao.updateIsFeedbackLaunched(eventId);


//     return { savedFeedbackQuestion, savedFeedbackInformation };
// };

exports.addFeedbackQuestionForEvent = async ({
    eventId,
    feedbackQuestion,
    email,
    masterSocket,
    isAnonymousFeedback,
    backgroundTheme,
    thankyouTimeout,
    idleTimeoutValue,
    idleTimeoutUnit
}) => {
    const backgroundThemeFilename = backgroundTheme?.filename || "Default Theme Selected";

    try {
        const event = await eventDao.getEventById(eventId);
        if (!event) {
            throw new Error(`Event not found for this Id: ${eventId}`);
        }

        const feedbackQuestionData = {
            event: event._id,
            feedbackQuestion
        };

        const savedFeedbackQuestion = await feedbackQuestionDao.saveFeedbackQuestion(feedbackQuestionData);

        let savedFeedbackInformation = await feedbackInformationDao.getFeedbackInformationByEvent(event._id);

        if (!savedFeedbackInformation) {
            const feedbackInformationData = {
                feedbackStatus: 'launched',
                email,
                isAnonymousFeedback,
                masterSocket,
                totalNoOfResponse: 0,
                totalNoOfUnknownResponse: 0,
                event: event._id,
                backgroundTheme: backgroundThemeFilename,
                thankyouTimeout,
                idleTimeoutUnit,
                idleTimeoutValue
            };

            savedFeedbackInformation = await feedbackInformationDao.createFeedbackInformation(feedbackInformationData);
        }

        await eventDao.updateIsFeedbackLaunched(eventId);

        return { savedFeedbackQuestion, savedFeedbackInformation };
    } catch (err) {
        if (backgroundThemeFilename) {
            const filePath = path.join(process.cwd(), 'uploads/backgroundTheme', backgroundThemeFilename);
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    logger.error('Failed to delete unsaved backgroundTheme file:', unlinkErr.message);
                    console.error('Failed to delete unsaved backgroundTheme file:', unlinkErr.message);
                } else {
                    logger.info('Cleaned up backgroundTheme file due to API call failure.');
                    console.log('Cleaned up backgroundTheme file due to API call failure.');
                }
            });
        }

        throw err;
    }
};



exports.getFeedbackQuestionsByEventId = async (eventId) => {
    const event = await eventDao.getEventById(eventId);

    if (!event) {
        throw new Error(`Event not found for this Id: ${eventId}`);
    }

    return await feedbackQuestionDao.getFeedbackQuestionsByEventId(event._id);

};

exports.getAllFeedbackQuestions = async () => {
    const questions = await feedbackQuestionDao.getAllFeedbackQuestions();

    if (!questions) {
        throw new Error(`No questions found!`);
    }

    return questions;

};

exports.getFeedbackQuestionByEventCategoryId = async (eventCategoryId) => {
    const eventCategory = await eventCategoryDao.getEventCategoryById(eventCategoryId);
    if (!eventCategory) {
        throw new Error("Event Category not found");
    }
    const questions = await feedbackQuestionDao.getFeedbackQuestionsByEventCategoryId(eventCategoryId);
    if (!questions) {
        throw new Error('No Question found');
    }
    return questions;
};

exports.getFeedbackQuestionsByEventCategoryAndEventId = async (eventCategoryId, eventId) => {
    const eventCategory = await eventCategoryDao.getEventCategoryById(eventCategoryId);
    if (!eventCategory) {
        throw new Error("Event Category not found");
    }

    const event = await eventDao.getEventById(eventId);
    if (!event) {
        throw new Error("Event not found");
    }

    const questions = await feedbackQuestionDao.getFeedbackQuestionsByEventCategoryAndEventId(eventCategoryId, eventId);

    if (!questions) {
        throw new Error('No Question found');
    }
    return questions;

}