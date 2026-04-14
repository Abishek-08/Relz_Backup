const axios = require("axios");

const apiKey = "d7627bb6-2292-4911-82e1-615c0ed3eebb";

exports.publish = async () => {
  try {
    // const resp = await axios.post(
    //   "http://localhost:8070/api/publish",
    //   {
    //     channel: "demo-channel-0",
    //     data: { value: "Hello-test" },
    //   },
    //   { headers: { "Content-Type": "application/json", "X-API-Key": apiKey } },
    // );

    const resp = await axios.post(
      "http://localhost:8070/api/broadcast",
      {
        channels: [
          "demo-channel-0",
          "demo-channel-1",
          "facts:fact-channel",
          "gossips:gossips-channel",
        ],
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
