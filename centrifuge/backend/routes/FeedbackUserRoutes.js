const express = require('express');
const feedbackUserController = require('../controllers/FeedbcakUserController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/updatestatus', feedbackUserController.confirmFeedbackStatus);
router.use(verifyToken);

router.post("/saveFeedbackUser", feedbackUserController.createFeedbackUser);
router.put("/updateFeedbackUserById", feedbackUserController.updateFeedbackUserById);
router.get("/getFeedbackUserById", feedbackUserController.getFeedbackUserById);
router.get('/getAllFeedbackUsers', feedbackUserController.getAllFeedbackUsers);
router.delete("/deleteFeedbackUserById", feedbackUserController.deleteFeedbackUserById);
router.get("/getFeedbackUsersByEventId",feedbackUserController.getFeedbackUsersByEventId);
router.get("/getFeedbackTotalUserCountByEventId",feedbackUserController.getFeedbackUsersCountByEventId);
router.get("/getFeedbackAnonymousCountByEventId",feedbackUserController.getFeedbackAnonymousCountByEventId);
router.get("/getEmailVerification",feedbackUserController.getEmailVerification);


module.exports = router;