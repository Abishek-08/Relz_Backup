const axios = require("axios");

const apiKey = process.env.CENTRIFUGO_API_KEY;
const CENTRIFUGO_PUBLISH_URL = process.env.CENTRIFUGO_PUBLISH_URL;
const CENTRIFUGO_DISCONNECT_URL = process.env.CENTRIFUGO_DISCONNECT_URL;
const CENTRIFUGO_PRESENCE_URL = process.env.CENTRIFUGO_PRESENCE_URL;

exports.publish = async () => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_PUBLISH_URL,
      {
        channel: "demo-channel-0",
        data: { value: "Hello-test" },
      },
      { headers: { "Content-Type": "application/json", "X-API-Key": apiKey } },
    );

    console.log(resp.data.result);
    return resp.data.result;
  } catch (err) {
    console.error("Error publishing:", err.response?.data || err.message);
  }
};

exports.showFeedbackPublish = async (data) => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_PUBLISH_URL,
      {
        channel: "FeedbackNS:showFeedbackPage",
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      },
    );

    return resp.data.result;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.launchFeedback = async (data) => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_PUBLISH_URL,
      {
        channel: "FeedbackNS:launchFeedback",
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      },
    );

    return resp.data.result;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.launchSurvey = async (data) => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_PUBLISH_URL,
      {
        channel: "SurveyNS:launchSurvey",
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      },
    );

    return resp.data.result;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.disconnectSubscrptionByUser = async (userEmail) => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_DISCONNECT_URL,
      {
        user: userEmail,
        disconnect: {
          code: 3503,
          reason: "Your subscription was terminated by ADMIN",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      },
    );

    return resp.data.result;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

exports.fetchPresenceInChannel = async (channel) => {
  try {
    const resp = await axios.post(
      CENTRIFUGO_PRESENCE_URL,
      {
        channel,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      },
    );

    return resp.data.result;
  } catch (err) {
    return err.response?.data || err.message;
  }
};
