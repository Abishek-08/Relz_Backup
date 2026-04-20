const transporter = require('../config/mailer');
const logger = require('../logger');
const { generateFeedbackToken } = require('../middleware/tokenGenerator');
const {encryptToken} = require('../utils/encryptDecryptToken');
 
exports.sendLoginCredentials = async (to, password, userName) => {
 
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f9;
      margin: 0; padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #1a1a1a;
    }
    .content {
      font-size: 16px;
      color: #444;
      line-height: 1.6;
    }
    .highlight {
      background: #ecf3fb;
      border-left: 4px solid #007bff;
      padding: 12px 16px;
      margin: 20px 0;
      font-weight: bold;
      color: #000;
    }
    .button {
      display: inline-block;
      background: #007bff;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 5px;
      font-size: 15px;
      text-decoration: none;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 40px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Surprise! Your Exclusive Access Awaits</h1>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Welcome to <strong>LIVEAAZ360</strong> — where innovation meets simplicity.</p>
 
      <p>We’ve unlocked your gateway to a suite of futuristic products designed to transform the way you work and connect. But first, here’s your temporary password to access the experience:</p>
 
      <div class="highlight">
        ${password}
      </div>
 
      <p>Don’t wait — use the button below to reset your password and dive into the magic of LIVEAAZ360:</p>
 
      <a class="button" href="https://your-app-url.com/reset-password">Reset Password & Begin</a>
 
      <p>If you didn’t sign up for this, please ignore this message or contact us immediately.</p>
 
      <p>See you inside,<br/>The LIVEAAZ360 Team 🚀</p>
    </div>
    <div class="footer">
      © 2025 Liveaaz360 • Need help? <a href="mailto:support@liveaaz360.com">support@liveaaz360.com</a>
    </div>
  </div>
</body>
</html>
`;
 
  const mailOptions = {
    from: `"LIVEAAZ360 Support" <support@liveaaz360}>`,
    to: to,
    subject: "LIVEAAZ360 Login Credentials",
    html: htmlContent
  };
 
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Email delivery failed. Please try again.');
  }
};
 
 
exports.sendOtpMail = async (to, otp, expiresAt, username) => {
  const htmlContent = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f6f9;
        margin: 0; padding: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      .header h1 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #1a1a1a;
      }
      .content {
        font-size: 16px;
        color: #444;
        line-height: 1.6;
      }
      .highlight {
        background: #ecf3fb;
        border-left: 4px solid #007bff;
        padding: 12px 16px;
        margin: 20px 0;
        font-weight: bold;
        color: #000;
      }
      .footer {
        font-size: 12px;
        color: #999;
        margin-top: 40px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 Your OTP Code Has Arrived!</h1>
      </div>
      <div class="content">
        <p>Hi ${username},</p>
        <p>To verify your action on <strong>LIVEAAZ360</strong>, please use the One-Time Password (OTP) provided below. This code is valid for a limited time and should not be shared with anyone.</p>
 
        <div class="highlight">
          ${otp}
        </div>
 
        <p>This OTP will expire in <strong>${expiresAt} minutes</strong>.</p>
 
        <p>If you didn’t request this, please ignore the message or report it to us immediately.</p>
 
        <p>Stay secure,<br/>The LIVEAAZ360 Team 🚀</p>
      </div>
      <div class="footer">
        © 2025 Liveaaz360 • Need help? <a href="mailto:support@liveaaz360.com">support@liveaaz360.com</a>
      </div>
    </div>
  </body>
  </html>
  `
  const mailOptions = {
    from: `"LIVEAAZ360 Support" <support@liveaaz360}>`,
    to: to,
    subject: "OTP verification",
    html: htmlContent
  };
 
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Email delivery failed. Please try again.');
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
 
exports.sendFeedbackEmail = async (feedbackUser, responses) => {
  const ratingLabels = {
    5: "Excellent",
    4: "Good",
    3: "Average",
    2: "Poor",
    1: "Very Poor"
  };
 
  const token = generateFeedbackToken(feedbackUser.feedbackUserEmail, feedbackUser.event.eventId);
  const encryptedToken = encryptToken(token);
  const confirmLink = `${process.env.FRONTEND_URL}/confirmFeedback?token=${encryptedToken}`;
 
  const responseRows = responses.map(r => `
    <tr>
      <td>${r.feedbackQuestion.feedbackQuestion}</td>
      <td>${ratingLabels[r.feedbackResponse] || r.feedbackResponse}</td>
    </tr>
  `).join('');
 
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f9;
      margin: 0; padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #007BFF;
      color: white;
      padding: 10px;
      text-align: left;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .button {
      display: inline-block;
      margin: 10px 10px 0 0;
      padding: 10px 20px;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .confirm {
      background-color: #28a745;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 40px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>📝 Feedback Summary for Event: ${feedbackUser.event.eventName}</h2>
    <p><strong>Name:</strong> ${feedbackUser.feedbackUserName}</p>
    <p><strong>Email:</strong> ${feedbackUser.feedbackUserEmail}</p>
 
    <table>
      <tr><th>Question</th><th>Response</th></tr>
      ${responseRows}
    </table>
 
    <p style="margin-top:20px;">Please confirm your feedback!</p>
    <a href="${confirmLink}" class="button confirm">✅ Confirm</a>
 
    <div class="footer">
      © 2025 LIVEEAZ • Need help? <a href="mailto:support@liveeaz.com">support@liveeaz.com</a>
    </div>
  </div>
</body>
</html>
`;
  const mailOptions = {
    from: `"LIVEEAZ Notifications" <support@liveeaz.com>`,
    to: feedbackUser.feedbackUserEmail,
    subject: 'Confirm Your Feedback Submission',
    html: htmlContent
  };
  try {
    // if (!isValidEmail(email)) {
    //   throw new Error("Invalid email address provided.");
    // }
    
    if (String(feedbackUser.feedbackUserEmail).toLowerCase() === "anonymous") {
      logger.info("Email sending aborted: anonymous user");
      console.log("Email sending aborted: anonymous user");
      return;
    }
   
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Email delivery failed. Please try again.');
  }
 
};
