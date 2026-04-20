const express = require('express');
const feedbackInformationController = require('../controllers/FeedbackInformationController');
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

router.put("/updateFeedbackInfoById", feedbackInformationController.updateFeedbackInformation);
router.get("/getFeedbackInformationByEventId", feedbackInformationController.getFeedbackInformationByEventId);
router.put("/reOpenFeedbackByEventId", handleUpload, feedbackInformationController.reOpenFeedbackByEventId);

module.exports = router;