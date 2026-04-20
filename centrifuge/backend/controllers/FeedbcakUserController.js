const feedbackUserService = require("../services/FeedbackUserService");

exports.createFeedbackUser = async (req, res) => {
  try {
    const feedbackUser = await feedbackUserService.createFeedbackUser(req.body);
    res.status(201).json(feedbackUser);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.updateFeedbackUserById = async (req, res) => {
  try {
    const { feedbackUserId } = req.query;

    const feedbackUser = await feedbackUserService.updateFeedbackUserById(
      feedbackUserId,
      req.body,
    );

    res.status(200).json(feedbackUser);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getFeedbackUserById = async (req, res) => {
  try {
    const { feedbackUserId } = req.query;
    const feedbackUser =
      await feedbackUserService.getFeedbackUserById(feedbackUserId);
    res.status(200).json(feedbackUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllFeedbackUsers = async (req, res) => {
  try {
    const response = await feedbackUserService.getAllFeedbackUsers();

    if (!response) {
      return res.status(404).json({ message: "No Feedback User found!" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.deleteFeedbackUserById = async (req, res) => {
  try {
    const { feedbackUserId } = req.query;
    const feedbcakUser =
      await feedbackUserService.deleteFeedbackUserById(feedbackUserId);
    if (!feedbcakUser) {
      return res
        .status(404)
        .json({ message: "No Feedback user found for this ID" });
    }
    res.status(200).json({ message: "Feedback User Deleted Successfully!" });
  } catch (err) {
    res.status(400).json({ messge: err.message });
  }
};

exports.getFeedbackUsersByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const feedbackUsers =
      await feedbackUserService.getFeedbackUsersByEventId(eventId);
    res.status(200).json(feedbackUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.confirmFeedbackStatus = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const user = await feedbackUserService.confirmFeedbackStatus(token);

    res.json({
      email: user.feedbackUserEmail,
      eventName: user.event.eventName,
      status: user.alreadyVerified,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFeedbackUsersCountByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const feedbackUsersCount =
      await feedbackUserService.getFeedbackUserCount(eventId);
    res.status(200).json(feedbackUsersCount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFeedbackAnonymousCountByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const feedbackAnonymousCount =
      await feedbackUserService.getFeedbackAnonymousCount(eventId);
    res.status(200).json(feedbackAnonymousCount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getEmailVerification = async (req, res) => {
  const { eventId, email } = req.query;
  try {
    const feedbackResponse = await feedbackUserService.getEmailVerification(
      email,
      eventId,
    );
    if (feedbackResponse) {
      return res.status(200).json({
        message: "Your feedback for this event is already submitted.",
      });
    }
    return res
      .status(200)
      .json({ message: "Email is eligible to submit feedback." });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
