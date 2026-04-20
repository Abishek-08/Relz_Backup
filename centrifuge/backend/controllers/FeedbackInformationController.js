const feedbackInformationService = require("../services/FeedbackInformationService");
exports.updateFeedbackInformation = async (req, res) => {
  try {
    const eventId = req.query.eventId;
    console.log(req.body);

    const feedbackInfo =
      await feedbackInformationService.updateFeedbackInformation(
        eventId,
        req.body,
      );
    if (!feedbackInfo) {
      res
        .status(404)
        .json({ message: "No Feedback Information found for this ID" });
    }

    res.status(200).json(feedbackInfo);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getFeedbackInformationByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const event =
      await feedbackInformationService.getFeedbackInformationByEventId(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ message: "No feedback info found for this ID" });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.reOpenFeedbackByEventId = async (req, res) => {
  try {
    const { eventId } = req.query;
    const {
      masterSocket,
      isAnonymousFeedback,
      thankyouTimeout,
      idleTimeoutUnit,
      idleTimeoutValue,
    } = req.body;

    const payload = {
      eventId,
      masterSocket,
      isAnonymousFeedback,
      thankyouTimeout,
      idleTimeoutUnit,
      idleTimeoutValue,
      backgroundTheme: {
        filename:
          req.file?.filename ||
          req.body.backgroundTheme ||
          "Default Theme Selected",
      },
    };

    const feedbackInfo =
      await feedbackInformationService.reOpenFeedbackByEventId(payload);

    if (!feedbackInfo) {
      return res
        .status(404)
        .json({ message: "No feedback info found for this ID" });
    }

    res.status(200).json(feedbackInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
