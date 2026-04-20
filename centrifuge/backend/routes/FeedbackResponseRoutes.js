const express = require('express');
const feedbackResponseController = require('../controllers/FeedbackResponseController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

router.post("/saveFeedbackResponse", feedbackResponseController.createFeedbackResponses);
router.get("/getUserResponseByEventId", feedbackResponseController.getUserResponseByEventId);
router.get("/getFeedbackResponseCountByEventId", feedbackResponseController.getFeedbackResponseCount);


module.exports = router;