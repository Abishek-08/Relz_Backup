const express = require("express");
const connectDb = require("./config/db.js");
const dotenv = require("dotenv");
const eventCategoryRoutes = require("./routes/EventCategoryRoutes.js");
const eventRoutes = require("./routes/EventRoutes.js");
const genderCountRoutes = require("./routes/GenderCountRoutes.js");
const resourceRoutes = require("./routes/ResourceRoutes.js");
const userRoutes = require("./routes/UserRoutes.js");
const feedbackRoutes = require("./routes/FeedbackQuestionRoutes.js");
const feedbackUserRoutes = require("./routes/FeedbackUserRoutes.js");
const feedbackResponseRoutes = require("./routes/FeedbackResponseRoutes.js");
const empRoutes = require("./routes/EmployeeRoutes.js");
const feedbackInformationRoutes = require("./routes/FeedbackInformationRoutes.js");
const pwaRoutes = require("./routes/PwaRoutes.js");
const cors = require("cors");
const helmet = require("helmet");
const socketRoutes = require("./routes/SocketRoutes.js");
const authRoutes = require("./routes/AuthRoutes.js");
const eventManagerRoutes = require("./routes/EventManagerRoutes.js");
const surveyQuestionRoutes = require("./routes/SurveyRoutes/SurveyQuestionTemplateRoutes.js");
const surveyUserRoutes = require("./routes/SurveyRoutes/SurveyUserRoutes.js");
const surveyInformationRoutes = require("./routes/SurveyRoutes/SurveyInformationRoutes.js");
const surveyResponseRoutes = require("./routes/SurveyRoutes/SurveyResponseRoutes.js");
const surveyReportRoutes = require("./routes/SurveyRoutes/SurveyReportRoutes.js");
const centrifugeRoutes = require("./routes/CentrifugeRoutes.js");
const path = require("path");
const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none"],
      formAction: ["'self"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.type("text/plain");
  res.send("User-agent: *\nDisallow:");
});

app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset>...</urlset>`);
});

dotenv.config();
connectDb();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4173",
    // origin: 'https://liveaaz360stg.relevantz.com',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  }),
);

app.use(
  "/liveaaz/uploads",
  cors(),
  express.static(path.join(__dirname, "uploads")),
);

app.use(
  "/liveaaz",
  ((router) => {
    router.use("/eventCategory", eventCategoryRoutes);
    router.use("/event", eventRoutes);
    router.use("/genderCount", genderCountRoutes);
    router.use("/resource", resourceRoutes);
    router.use("/user", userRoutes);
    router.use("/auth", authRoutes);
    router.use("/feedback", feedbackRoutes);
    router.use("/feedbackUser", feedbackUserRoutes);
    router.use("/feedbackResponse", feedbackResponseRoutes);
    router.use("/feedbackInformation", feedbackInformationRoutes);
    router.use("/socket", socketRoutes);
    router.use("/emp", empRoutes);
    router.use("/eventManager", eventManagerRoutes);
    router.use("/offline", pwaRoutes);
    router.use("/surveyQuestion", surveyQuestionRoutes);
    router.use("/surveyUser", surveyUserRoutes);
    router.use("/surveyInformation", surveyInformationRoutes);
    router.use("/surveyResponse", surveyResponseRoutes);
    router.use("/surveyReport", surveyReportRoutes);
    router.use("/centrifuge", centrifugeRoutes);
    return router;
  })(express.Router()),
);

module.exports = app;
