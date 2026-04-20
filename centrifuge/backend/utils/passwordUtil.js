const crypto = require('crypto');

exports.generateRandomPassword = (length = 8) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};
