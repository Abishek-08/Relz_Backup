const express = require('express');
const surveyQuestionController = require('../../controllers/SurveyController/SurveyQuestionTemplateController');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const upload = require('../../middleware/multerConfig');

/**
 * Middleware: Handle backgroundTheme file upload safely
 */
const handleUpload = (req, res, next) => {
  upload.single('backgroundTheme')(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Apply authentication middleware to all survey question routes
router.use(verifyToken);

/**
 * Routes for Survey Questions
 */
router.post(
  '/addSurveyQuestionForEvent',
  handleUpload,
  surveyQuestionController.addSurveyQuestionForEvent
);

router.get(
  '/getSurveyQuestionsByEventId/:eventId',
  surveyQuestionController.getSurveyQuestionsByEventId
);

router.get(
  '/getAllSurveyQuestions',
  surveyQuestionController.getAllSurveyQuestions
);

router.get(
  '/getSurveyQuestionsByEventCategoryId/:eventCategoryId',
  surveyQuestionController.getSurveyQuestionsByEventCategoryId
);

router.get(
  '/getSurveyQuestionsByEventCategoryAndEventId/:eventCategoryId/:eventId',
  surveyQuestionController.getSurveyQuestionsByEventCategoryAndEventId
);

module.exports = router;
