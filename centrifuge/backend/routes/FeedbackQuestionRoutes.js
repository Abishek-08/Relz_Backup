const express = require('express');
const feedbackQuestionController = require('../controllers/FeedbackQuestionController');
const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/multerConfig'); 

const handleUpload = (req, res, next) => {
    upload.single('backgroundTheme')(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message }); 
      }
      next(); 
    });
  };
  
router.use(verifyToken);

router.post("/createFeedback", handleUpload, feedbackQuestionController.addFeedbackQuestionsForEvent);
router.get("/getFeedbackQuestionsByEventId", feedbackQuestionController.getFeedbackQuestionsByEventId);
router.get("/getAllFeedbackQuestions", feedbackQuestionController.getAllFeedbackQuestions);
router.get("/getQuestionByEventCategoryId", feedbackQuestionController.getFeedbackQuestionByEventCategoryId);
router.get("/getQuestionByEventCategoryAndEventId", feedbackQuestionController.getFeedbackQuestionByEventCategoryAndEventId);
module.exports = router;