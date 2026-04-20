const authService = require("../services/AuthService");

exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.passwordReset = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authService.resetPassword(email, password);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.firstPasswordReset = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const response = await authService.firstResetPassword(
      email,
      oldPassword,
      newPassword,
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.otpVerification = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const response = await authService.verifyOtp(email, otp);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    await authService.sendOtp(email);
    res.status(200).json("OTP Resend Successfully!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.query;

  try {
    const result = await authService.findUserByEmail(email);

    if (!result) {
      res.status(404).json({ message: "User not found" });
    } else {
      await authService.sendOtp(email);
      res.status(200).json({
        message: "User found",
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    await authService.sendOtp(email);
    res.status(200).json("OTP Resend Successfully!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findLoginDataByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const response = await authService.findUserByEmail(email);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.feedbackLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.feedbackLogin(email, password);
    res.status(200).json("Success");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
