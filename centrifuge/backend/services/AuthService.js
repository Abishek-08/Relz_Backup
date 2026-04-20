const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/tokenGenerator");
const ldapAuthenticate = require("./ldapAuth");
const authDao = require("../dao/AuthDao");
const { encryptToken } = require("../utils/encryptDecryptToken");
const { generateRandomOtp } = require("../utils/otpUtil");
const emailService = require("../utils/emailService");
const feedbackInfoDao = require("../dao/FeedbackInformationDao");
const eventDao = require("../dao/EventDao");
const logger = require("../logger");

// exports.loginUser = async ({ email, password }) => {

//   //VM
//      const isLDAPUser = email.endsWith('@relevantz.com');

//     //  var login = {};
//      var user = {};

//     if (isLDAPUser) {
//        try {
//          const response  =  await ldapAuthenticate(email, password);
//          console.log(response);
//           //  login = response.login
//            user = response.user

//            if (user.accountStatus === 'INACTIVE') {
//              throw new Error('Account is inactive. Please contact the administrator.');
//                }

//        } catch (err) {
//          console.log(err)
//          throw err;
//        }
//      }
//      const token = generateToken(user);
//      const encryptedToken = encryptToken(token);

//      return {
//        encryptedToken,
//        user: {
//          firstName: user.firstName,
//          email: user.email,
//          userType: user.userType,
//          accountStatus: user.accountStatus
//        }
//      };
//    };

exports.loginUser = async ({ email, password }) => {
  const isLDAPUser = email.endsWith("@relevantz.com");
  let user = {};

  if (isLDAPUser) {
    try {
      const response = await ldapAuthenticate(email, password);
      user = response.user;
      logger.info(response);

      if (user.accountStatus === "INACTIVE") {
        throw new Error(
          "Account is inactive. Please contact the administrator.",
        );
      }
    } catch (err) {
      logger.error(err);

      //invalid credentials explicitly
      if (err.message && err.message.includes("Invalid LDAP credentials")) {
        throw new Error("Invalid credentials");
      }

      // Pass through inactive account error or other known messages
      if (err.message && err.message.includes("Account is inactive")) {
        throw err;
      }
      if (err.message && err.message.includes("User not authorized")) {
        throw new Error("You are not authorized to access the system");
      }

      // Fallback for any other LDAP errors
      throw new Error("Authentication failed");
    }
  }

  const token = await generateToken(user);
  const encryptedToken = encryptToken(token);

  return {
    encryptedToken,
    user: {
      firstName: user.firstName,
      email: user.email,
      userType: user.userType,
      accountStatus: user.accountStatus,
    },
  };
};

//Local
// const login = await authDao.findEmail(email);
// if (!login) throw new Error('Invalid email or password');

// const user = login.user;

// if (user.accountStatus === 'INACTIVE') {
//   throw new Error('Account is inactive. Please contact the administrator.');
// }

//   const isLDAPUser = email.endsWith('@relevantz.com');

//   if (isLDAPUser) {
//     try {
//       await ldapAuthenticate(email, password);
//     } catch (err) {
//       throw new Error('LDAP authentication failed');
//     }
//   } else {
//     const isMatch = await bcrypt.compare(password, login.password);

//     if (!isMatch) {

//       if (user.userType === 'ADMIN') {
//         throw new Error('Invalid credentials');
//       }
//       if (!login.isPasswordChanged && login.attemptCount === 0) {
//         throw new Error('Invalid email or password');
//       }

//       login.attemptCount = Math.max((login.attemptCount || 5) - 1, 0);

//       if (login.attemptCount === 0 && login.isPasswordChanged) {
//         user.accountStatus = 'INACTIVE';
//         await authDao.updateUser(user);
//         await authDao.updateLogin(login);
//         throw new Error('Account locked due to multiple failed login attempts. Contact admin.');
//       }

//       await authDao.updateLogin(login);
//       throw new Error(`Invalid email or password. Remaining attempts: ${login.attemptCount}`);
//     }

//     login.attemptCount = 5;
//     await authDao.updateLogin(login);
//   }
//   if (user.userType === 'ADMIN') {
//     await this.sendOtp(email);
//     return { message: 'OTP sent to admin email for verification' };
//   }

//   const token = generateToken(login.user);
//   const encryptedToken = encryptToken(token);

//   return {
//     encryptedToken,
//     user: {
//       firstName: login.user.firstName,
//       email: login.user.email,
//       userType: login.user.userType,
//       isPasswordChanged: login.isPasswordChanged
//     }
//   };
// };

exports.firstResetPassword = async (email, oldPassword, newPassword) => {
  const login = await authDao.findEmail(email);
  if (!login) {
    throw new Error("User not found");
  }

  const storedHashedPassword = login.password;

  const isOldPasswordCorrect = await bcrypt.compare(
    oldPassword,
    storedHashedPassword,
  );
  if (!isOldPasswordCorrect) {
    throw new Error("Incorrect old password!");
  }

  const isNewPasswordSameAsOld = await bcrypt.compare(
    newPassword,
    storedHashedPassword,
  );
  if (isNewPasswordSameAsOld) {
    throw new Error("New password cannot be the same as the current password!");
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 8);
  login.password = newHashedPassword;
  login.attemptCount = 5;
  login.isPasswordChanged = true;

  const updatedLogin = await authDao.updateLogin(login);
  return updatedLogin;
};

exports.resetPassword = async (email, password) => {
  const login = await authDao.findEmail(email);

  if (!login) {
    throw new Error("User not found");
  }

  const randomPassword = login.password;

  const isSamePassword = await bcrypt.compare(password, login.password);

  if (isSamePassword) {
    throw new Error("Old password and new password are same!");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  login.password = hashedPassword;
  login.attemptCount = 5;
  login.isPasswordChanged = true;

  const updatedLogin = await authDao.updateLogin(login);
  return "Password reset success!";
};

exports.sendOtp = async (email) => {
  const otp = await generateRandomOtp();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const now = new Date(Date.now());
  const diffInMinutes = Math.round((expiresAt - now) / 60000);

  const login = await authDao.findEmail(email);
  if (!login) throw new Error("User not found");

  login.otp = otp;
  login.otpExpiresAt = expiresAt;

  await emailService.sendOtpMail(
    email,
    otp,
    diffInMinutes,
    login.user.firstName,
  );
  await authDao.updateLogin(login);
};

exports.verifyOtp = async (email, inputOtp) => {
  const login = await authDao.findEmail(email);
  if (!login || !login.otp || !login.otpExpiresAt) {
    throw new Error("OTP not found or expired");
  }

  if (Date.now() > login.otpExpiresAt.getTime()) {
    login.otp = null;
    login.otpExpiresAt = null;
    await authDao.updateLogin(login);
    throw new Error("OTP expired");
  }

  if (login.otp !== inputOtp) {
    throw new Error("Invalid OTP");
  }

  login.otp = null;
  login.otpExpiresAt = null;
  await authDao.updateLogin(login);

  const token = generateToken(login.user);
  const encryptedToken = encryptToken(token);

  return {
    encryptedToken,
    user: {
      firstName: login.user.firstName,
      email: login.user.email,
      userType: login.user.userType,
    },
  };
};

exports.findUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const response = await authDao.findEmail(email);
  if (!response) {
    throw new Error("User not found");
  }

  return response;
};

exports.feedbackLogin = async (email, password) => {
  // const login = await authDao.findEmail(email);
  // if (!login) throw new Error('Email not Found');

  // const user = login.user;

  // if (user.accountStatus === 'INACTIVE') {
  //   throw new Error('Account is inactive. Please contact the administrator.');
  // }

  // const isMatch = await bcrypt.compare(password, login.password);

  // if (!isMatch) {
  //   throw new Error("Invalid Password");
  // }

  try {
    const resposne = await ldapAuthenticate(email, password);
    return resposne;
  } catch (err) {
    throw new Error(
      "Invalid login credentials. Please check your email and password.",
    );
  }

  // const event = await eventDao.getEventById(eventId);

  // if (!event) {
  //   throw new Error("Event not Found");
  // }
  // await feedbackInfoDao.updateFeedbackStatus(event._id, "Completed");

  // return user;
};
