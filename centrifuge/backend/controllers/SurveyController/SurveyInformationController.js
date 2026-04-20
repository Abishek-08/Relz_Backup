const surveyInformationService = require("../../services/SurveyService/SurveyInformationService");
const logger = require("../../logger");

/**
 * Controller: Update survey information by Event ID
 */
exports.updateSurveyInformation = async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = req.body;

    const updatedSurveyInfo =
      await surveyInformationService.updateSurveyInformation(eventId, data);

    if (!updatedSurveyInfo) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Survey information not found for update",
        });
    }

    logger.info("Survey information updated successfully via controller", {
      eventId,
    });
    return res.status(200).json({ success: true, data: updatedSurveyInfo });
  } catch (err) {
    logger.error("Controller error: updateSurveyInformation", {
      error: err.message,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get survey information by Event ID
 */
exports.getSurveyInformationByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const surveyInfo =
      await surveyInformationService.getSurveyInformationByEventId(eventId);

    if (!surveyInfo) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Survey information not found for event",
        });
    }

    logger.info("Survey information fetched successfully via controller", {
      eventId,
    });
    return res.status(200).json({ success: true, data: surveyInfo });
  } catch (err) {
    logger.error("Controller error: getSurveyInformationByEventId", {
      error: err.message,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Re-open survey by Event ID
 */
exports.reOpenSurveyByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      masterSocket,
      isAnonymousSurvey,
      thankyouTimeout,
      idleTimeoutUnit,
      idleTimeoutValue,
    } = req.body;

    const payload = {
      eventId,
      masterSocket,
      isAnonymousSurvey,
      thankyouTimeout,
      idleTimeoutUnit,
      idleTimeoutValue,
      backgroundTheme: {
        filename:
          req.file?.filename ||
          req.body.backgroundTheme ||
          "Default Theme Selected",
      },
    };

    const updatedSurveyInfo =
      await surveyInformationService.reOpenSurveyByEventId(payload);

    if (!updatedSurveyInfo) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Survey information not found for re-open",
        });
    }

    logger.info("Survey re-opened successfully via controller", { eventId });
    return res.status(200).json({ success: true, data: updatedSurveyInfo });
  } catch (err) {
    logger.error("Controller error: reOpenSurveyByEventId", {
      error: err.message,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};
