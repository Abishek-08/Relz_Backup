const surveyResponseService = require('../../services/SurveyService/SurveyResponseService');
const logger = require('../../logger');

/**
 * Controller: Create multiple survey responses for a user in an event
 */
exports.createMultipleSurveyResponses = async (req, res) => {
  try {
    const { surveyUserId, eventId, responses, isAnonymous } = req.body;

    const savedResponses = await surveyResponseService.createMultipleSurveyResponses(
      surveyUserId,
      eventId,
      responses,
      isAnonymous
    );

    logger.info('Survey responses created successfully via controller', { surveyUserId, eventId });
    return res.status(201).json({ success: true, data: savedResponses });
  } catch (err) {
    console.log(err)
    logger.error('Controller error: createMultipleSurveyResponses', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get user survey responses by Event ID
 */
exports.getUserSurveyResponsesByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const responses = await surveyResponseService.getUserSurveyResponsesByEventId(eventId);

    if (!responses || responses.length === 0) {
      return res.status(404).json({ success: false, message: 'No survey responses found for this event' });
    }

    return res.status(200).json({ success: true, data: responses });
  } catch (err) {
    logger.error('Controller error: getUserSurveyResponsesByEventId', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey response count by Event ID
 */
exports.getSurveyResponseCountByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const count = await surveyResponseService.getSurveyResponseCountByEventId(eventId);

    return res.status(200).json({ success: true, count });
  } catch (err) {
    logger.error('Controller error: getSurveyResponseCountByEventId', { error: err.message });
    return res.status(400).json({ success: false, message: err.message });
  }
};
