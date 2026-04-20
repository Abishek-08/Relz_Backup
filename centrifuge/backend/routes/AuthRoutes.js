const express = require('express');
const authController = require('../controllers/AuthController');
const router = express.Router();

router.post("/login",authController.login);
router.put("/resetPassword",authController.passwordReset);
router.put("/firstResetPassword",authController.firstPasswordReset);
router.post("/verifyOtp", authController.otpVerification);
router.post("/resendOtp", authController.resendOTP);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resendOtp", authController.resendOTP);
router.get("/getLoginDataByEmail", authController.findLoginDataByEmail);
router.post("/feedbackLogin", authController.feedbackLogin);

module.exports = router;