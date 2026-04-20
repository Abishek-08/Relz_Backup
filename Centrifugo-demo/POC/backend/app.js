const express = require("express");
const cors = require("cors");
const tokenGenerator = require("./tokenGenerator");
const centrifuge = require("./centrifugo");

const app = express();
const PORT = 5050;

const allowedOrigins = ["*"];

app.use(cors(allowedOrigins));

app.get("/test", (req, res) => {
  res.send("test app is running");
});

app.get("/token", async (req, res) => {
  res.send({ token: await tokenGenerator.generateToken() });
});

// Example route that publishes to a channel
app.get("/publish", async (req, res) => {
  res.send(await centrifuge.publish());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
