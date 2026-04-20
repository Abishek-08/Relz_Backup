const pwaService = require("../services/PwaService");

exports.offlineFeedbackSubmission = async (req, res) => {
  try {
    const submitResponse = await pwaService.offlineFeedbackSubmission(req.body);
    console.log("sb: ", submitResponse);
    return res.status(200).json({ message: submitResponse });
  } catch {
    return res.status(400).json({ message: err.message });
  }
};

exports.offlineSurveySubmission = async (req, res) => {
  try {
    const submitResponse = await pwaService.offlineSurveySubmission(req.body);
    return res.status(200).json({ message: submitResponse });
  } catch {
    return res.status(400).json({ message: err.message });
  }
};
