const surveyQuestionService = require("../../services/SurveyService/SurveyQuestionTemplateService");
const logger = require("../../logger");

/**
 * Controller: Add a survey question for an event and launch feedback
 */
exports.addSurveyQuestionForEvent = async (req, res) => {
  try {
    let payload = {
      ...req.body,
      backgroundTheme: req.file ? req.file.filename : "Default Theme Selected",
    };

    if (typeof payload.questions === "string") {
      payload.questions = JSON.parse(payload.questions);
    }

    const result = await surveyQuestionService.addSurveyQuestionForEvent(payload);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey questions by Event ID
 */
exports.getSurveyQuestionsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const questions =
      await surveyQuestionService.getSurveyQuestionsByEventId(eventId);

    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    logger.error("Controller error: getSurveyQuestionsByEventId", {
      error: err.message,
    });
    return res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get all survey questions
 */
exports.getAllSurveyQuestions = async (req, res) => {
  try {
    const questions = await surveyQuestionService.getAllSurveyQuestions();
    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    logger.error("Controller error: getAllSurveyQuestions", {
      error: err.message,
    });
    return res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey questions by EventCategory ID
 */
exports.getSurveyQuestionsByEventCategoryId = async (req, res) => {
  try {
    const { eventCategoryId } = req.params;
    const questions =
      await surveyQuestionService.getSurveyQuestionsByEventCategoryId(
        eventCategoryId,
      );

    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    logger.error("Controller error: getSurveyQuestionsByEventCategoryId", {
      error: err.message,
    });
    return res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey questions by EventCategory ID and Event ID
 */
exports.getSurveyQuestionsByEventCategoryAndEventId = async (req, res) => {
  try {
    const { eventCategoryId, eventId } = req.params;
    const questions =
      await surveyQuestionService.getSurveyQuestionsByEventCategoryAndEventId(
        eventCategoryId,
        eventId,
      );

    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    logger.error(
      "Controller error: getSurveyQuestionsByEventCategoryAndEventId",
      { error: err.message },
    );
    return res.status(404).json({ success: false, message: err.message });
  }
};

exports.getSurveyQuestionsByEventCategoryId = async (req, res) => {
  try {
    const { eventCategoryId } = req.params;
    const questions = await surveyQuestionService.getSurveyQuestionsByEventCategoryId(eventCategoryId);
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
