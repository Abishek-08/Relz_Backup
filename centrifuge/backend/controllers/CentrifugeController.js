const centifuge = require("../services/CentrifugeService");
const utilis = require(".././utils/encryptDecryptToken");
const { exportSPKI } = require("jose");

exports.decryptToken = (req, res) => {
  const { token } = req.body;
  const decryptToken = utilis.decryptToken(token);
  return res.status(200).json({ token: decryptToken });
};

exports.publish = async () => {
  return await centifuge.publish();
};

exports.registerFeedback = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await centifuge.registerFeedback(email);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.registerSurvey = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await centifuge.registerSurvey(email);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.launchFeedback = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await centifuge.launchFeedback(email);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.launchSurvey = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await centifuge.launchSurvey(email);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.disconnectSubscrptionByUser = async (req, res) => {
  try {
    const { disconnectEmailList } = req.body;
    const response =
      await centifuge.disconnectSubscrptionByUser(disconnectEmailList);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.fetchPresenceInChannel = async (req, res) => {
  try {
    const { channel } = req.body;
    const response = await centifuge.fetchPresenceInChannel(channel);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
