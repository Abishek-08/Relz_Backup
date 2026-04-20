const otpUtil = require('../utils/otpUtil');
// const loginService = require('../services/LoginService')

exports.sendOtp = async (userEmail) => {
    if (!userEmail) {
        throw new Error("Email is required!");
    }

    const login = await loginService.getLoginDataByEmail(email);
    if (!login) {
        throw new Error("Login data not found!");
    }

    const otp = otpUtil.generateRandomOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    login.otp = otp;
    login.otpExpiresAt = otpExpiry;
    await login.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password',
        }
    });

    const mailOptions = {
        from: '"Your App" <your-email@example.com>',
        to: userEmail,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return { message: "OTP sent successfully" };
};