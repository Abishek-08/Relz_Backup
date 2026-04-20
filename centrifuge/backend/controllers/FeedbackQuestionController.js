const feedbackQuestionService = require('../services/FeedbackQuestionService');

exports.addFeedbackQuestionsForEvent = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            backgroundTheme: req.file ? { filename: req.file.filename } : "Default Theme Selected"
        };
        const feedbackQuestion = await feedbackQuestionService.addFeedbackQuestionForEvent(payload);
        res.status(201).json(feedbackQuestion);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.getFeedbackQuestionsByEventId = async (req, res) => {
    try {
        const { eventId } = req.query;
        const feedbackQuestions = await feedbackQuestionService.getFeedbackQuestionsByEventId(eventId);

        if (!feedbackQuestions) {
            return res.status(404).json({ message: 'Feedback questions not found for the event' });
        }

        res.status(200).json(feedbackQuestions.map(fq => ({ feedbackQuestionId: fq.feedbackQuestionId, feedbackQuestion: fq.feedbackQuestion })));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllFeedbackQuestions = async (req, res) => {
    try {
        const response = await feedbackQuestionService.getAllFeedbackQuestions();
        if (!response) {
            return res.status(404).json({ message: "No Feedback questions found!" });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getFeedbackQuestionByEventCategoryId = async (req, res) => {
    try {
        const { eventCategoryId } = req.query;
        const response = await feedbackQuestionService.getFeedbackQuestionByEventCategoryId(eventCategoryId);
        if (!response) {
            return res.status(404).json({ message: "No Feedback question for event" });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
};

exports.getFeedbackQuestionByEventCategoryAndEventId = async (req, res) => {
    try {
        const { eventCategoryId, eventId } = req.query;
        const response = await feedbackQuestionService.getFeedbackQuestionsByEventCategoryAndEventId(eventCategoryId, eventId);
        if (!response) {
            return res.status(404).json({ message: "No Feedback question for event" });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
};