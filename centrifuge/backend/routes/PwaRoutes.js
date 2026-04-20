const express = require("express");
const pwaController = require("../controllers/PwaController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(verifyToken);

router.post("/feedbackSubmit", pwaController.offlineFeedbackSubmission);
router.post("/surveySubmit", pwaController.offlineSurveySubmission);

module.exports = router;
