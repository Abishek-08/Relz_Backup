const express = require('express');
const surveyInformationController = require('../../controllers/SurveyController/SurveyInformationController');
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

router.use(verifyToken);

/**
 * Routes for Survey Information
 */
router.put(
  '/updateSurveyInformation/:eventId',
  surveyInformationController.updateSurveyInformation
);

router.get(
  '/getSurveyInformationByEventId/:eventId',
  surveyInformationController.getSurveyInformationByEventId
);

router.put(
  '/reOpenSurveyByEventId/:eventId',
  handleUpload,
  surveyInformationController.reOpenSurveyByEventId
);

module.exports = router;
