const express = require('express');
const surveyResponseController = require('../../controllers/SurveyController/SurveyResponseController');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

/**
 * Routes for Survey Responses
 */
router.post(
  '/createMultipleSurveyResponses',
  surveyResponseController.createMultipleSurveyResponses
);

router.get(
  '/getUserSurveyResponsesByEventId',
  surveyResponseController.getUserSurveyResponsesByEventId
);

router.get(
  '/getSurveyResponseCountByEventId',
  surveyResponseController.getSurveyResponseCountByEventId
);

module.exports = router;
