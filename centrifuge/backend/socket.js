const socketIO = require("socket.io");
const FeedbackInfo = require("./models/FeedbackInformation");
const FeedbackQuestion = require("./models/FeedbackQuestion");
const SurveyInformation = require("./models/SurveyModel/SurveyInformation");
const SurveyQuestionTemplate = require("./models/SurveyModel/SurveyQuestionTemplate");
const socketInfo = require("./models/Sockets");
const logger = require("./logger");

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      // origin: 'https://liveaaz360stg.relevantz.com',
      origin: "http://localhost:5005",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    logger.info("Socket connected:", socket.id);
    console.log(`[socket] connected ${socket.id}`, {
      origin: socket.handshake.headers.origin,
      referer: socket.handshake.headers.referer,
      transports: socket.conn.transport.name,
    });

    /* -------------------- FEEDBACK -------------------- */

    socket.on("register", async (emailRaw) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email) return;

      try {
        socket.join(`feedback:${email}`);
        socket.email = email;

        const feedbackInfo = await FeedbackInfo.findOne({
          email: new RegExp(`^${email}$`, "i"),
          feedbackStatus: "launched",
        }).populate("event");

        if (!feedbackInfo) return;

        const rawQuestions = await FeedbackQuestion.find({
          event: feedbackInfo.event?._id,
        });
        const questions = rawQuestions.map((q) => ({
          feedbackQuestionId: q.feedbackQuestionId || q._id,
          feedbackQuestion: q.feedbackQuestion,
        }));

        io.to(`feedback:${email}`).emit("showFeedbackPage", {
          feedbackInfo,
          masterSocket: feedbackInfo.masterSocket,
          questions,
          eventId: feedbackInfo.event?.eventId,
          eventName: feedbackInfo.event?.eventName,
        });

        const exists = await socketInfo.findOne({ socket: socket.id });
        if (!exists) {
          await new socketInfo({ socket: socket.id, email, isActive: true })
            .save()
            .catch(() => {});
        }
      } catch (err) {
        logger.error(`Error checking feedback for ${email}: ${err.message}`);
      }
    });

    socket.on("launchFeedback", async (emailRaw) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email) return;

      try {
        const updated = await FeedbackInfo.findOneAndUpdate(
          { email: new RegExp(`^${email}$`, "i"), feedbackStatus: "launched" },
          { $set: { masterSocket: socket.id } },
          { new: true },
        ).populate("event");

        if (updated) {
          const rawQuestions = await FeedbackQuestion.find({
            event: updated.event?._id,
          });
          const questions = rawQuestions.map((q) => ({
            feedbackQuestionId: q.feedbackQuestionId || q._id,
            feedbackQuestion: q.feedbackQuestion,
          }));

          io.to(`feedback:${email}`).emit("showFeedbackPage", {
            feedbackInfo: updated,
            masterSocket: updated.masterSocket,
            questions,
            eventId: updated.event?.eventId,
            eventName: updated.event?.eventName,
          });

          const exists = await socketInfo.findOne({ socket: socket.id });
          if (!exists) {
            await new socketInfo({ socket: socket.id, email, isActive: true })
              .save()
              .catch(() => {});
          }
        }
      } catch (err) {
        logger.error(`Error launching feedback for ${email}: ${err.message}`);
      }
    });

    socket.on("closeFeedback", ({ emailRaw, eventId }) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email || !eventId) return;
      io.to(`feedback:${email}`).emit("feedbackClosed", { eventId });
    });

    /* -------------------- SURVEY -------------------- */

    socket.on("registerSurvey", async (emailRaw) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email) return;

      try {
        socket.join(`survey:${email}`);
        socket.email = email;

        const surveyInfo = await SurveyInformation.findOne({
          surveyOwnerEmail: new RegExp(`^${email}$`, "i"),
          surveyStatus: "launched",
        }).populate("event");

        if (!surveyInfo) {
          return;
        }

        const rawQuestions = await SurveyQuestionTemplate.find({
          event: surveyInfo.event?._id,
        });
        const questions = rawQuestions.map((q) => ({
          surveyQuestionId: q.surveyQuestionId || q._id,
          surveyQuestion: q.surveyQuestion,
          surveyQuestionType: q.surveyQuestionType,
          surveyCheckBoxOptions: q.surveyCheckBoxOptions,
          scaleMin: q.scaleMin,
          scaleMax: q.scaleMax,
          scaleLabels: q.scaleLabels,
          matrixQnLabels: q.matrixQnLabels,
          required: !!q.required,
          displayOrder: q.displayOrder,
        }));

        io.to(`survey:${email}`).emit("showSurveyPage", {
          surveyInfo,
          masterSocket: surveyInfo.masterSocket,
          questions,
          eventId: surveyInfo.event?.eventId,
          eventName: surveyInfo.event?.eventName,
        });

        const exists = await socketInfo.findOne({ socket: socket.id });
        if (!exists) {
          await new socketInfo({ socket: socket.id, email, isActive: true })
            .save()
            .catch(() => {});
        }
      } catch (err) {
        logger.error(`Survey register error for ${email}: ${err.message}`);
      }
    });

    socket.on("launchSurvey", async (emailRaw) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email) return;

      try {
        const updated = await SurveyInformation.findOneAndUpdate(
          {
            surveyOwnerEmail: new RegExp(`^${email}$`, "i"),
            surveyStatus: "launched",
          },
          { $set: { masterSocket: socket.id } },
          { new: true },
        ).populate("event");

        if (updated) {
          const rawQuestions = await SurveyQuestionTemplate.find({
            event: updated.event?._id,
          });
          const questions = rawQuestions.map((q) => ({
            surveyQuestionId: q.surveyQuestionId || q._id,
            surveyQuestion: q.surveyQuestion,
            surveyQuestionType: q.surveyQuestionType,
            surveyCheckBoxOptions: q.surveyCheckBoxOptions,
            scaleMin: q.scaleMin,
            scaleMax: q.scaleMax,
            scaleLabels: q.scaleLabels,
            matrixQnLabels: q.matrixQnLabels,
            required: !!q.required,
            displayOrder: q.displayOrder,
          }));

          io.to(`survey:${email}`).emit("showSurveyPage", {
            surveyInfo: updated,
            masterSocket: updated.masterSocket,
            questions,
            eventId: updated.event?.eventId,
            eventName: updated.event?.eventName,
          });
        } else {
          console.log(
            `[survey] launchSurvey: no launched survey found for ${email}`,
          );
        }
      } catch (err) {
        logger.error(`launchSurvey error for ${email}: ${err.message}`);
      }
    });

    socket.on("closeSurvey", ({ emailRaw, eventId }) => {
      const email = emailRaw?.trim().toLowerCase();
      if (!email || !eventId) return;
      io.to(`survey:${email}`).emit("surveyClosed", { eventId });
    });

    /* -------------------- COMMON -------------------- */

    socket.on("terminateSockets", async (socketList) => {
      if (!Array.isArray(socketList)) return;
      for (const socketId of socketList) {
        const targetSocket = io.sockets.sockets.get(socketId);
        if (targetSocket) {
          targetSocket.disconnect(true);
        }
      }
    });

    socket.on("ping", () => {
      socket.emit("pong");
    });

    socket.on("disconnect", async (reason) => {
      try {
        await socketInfo.findOneAndUpdate(
          { socket: socket.id },
          { isActive: false },
        );
      } catch (e) {
        console.error(`[common] disconnect save error for ${socket.id}:`, e);
      }
      logger.info("Socket disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;
