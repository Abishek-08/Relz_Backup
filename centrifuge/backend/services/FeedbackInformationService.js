const feedbackInfoDao = require("../dao/FeedbackInformationDao");
const eventDao = require("../dao/EventDao");
const path = require("path");
const fs = require("fs");
const logger = require("../logger");

exports.updateFeedbackInformation = async (eventId, data) => {
  console.log("eventId: ", eventId);

  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not Found");
  }

  const feedbackInfo = await feedbackInfoDao.updateFeedbackInformation(
    event._id,
    data,
  );

  if (!feedbackInfo) {
    throw new Error("Feedback Info not found!");
  }

  return feedbackInfo;
};

exports.getFeedbackInformationByEventId = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const feedbackInfo = await feedbackInfoDao.getFeedbackInformationByEvent(
    event._id,
  );

  return feedbackInfo;
};

// exports.reOpenFeedbackByEventId = async(payload) =>{

//   const {
//     eventId,
//     masterSocket,
//     isAnonymousFeedback,
//     thankyouTimeout,
//     backgroundTheme
//   } = payload;

//   const event = await eventDao.getEventById(eventId);

//   if (!event) {
//     throw new Error("Event not found!");
//   }

//   const existingInfo = await feedbackInfoDao.getFeedbackInformationByEvent(event._id);

//   if (!existingInfo) {
//     throw new Error("Feedback information not found!");
//   }

//   let updatedFields = {
//     isAnonymousFeedback,
//     thankyouTimeout,
//     masterSocket
//   };

//   // const newFilename =
//   // typeof backgroundTheme === 'string'
//   //   ? backgroundTheme
//   //   : backgroundTheme?.filename;

//   if (backgroundTheme !== undefined) {
//     const newFilename =
//       typeof backgroundTheme === 'string'
//         ? backgroundTheme
//         : backgroundTheme?.filename;

//     if (newFilename && newFilename !== existingInfo.backgroundTheme) {
//       updatedFields.backgroundTheme = newFilename;
//     }
//   }

//   if (newFilename && newFilename !== existingInfo.backgroundTheme) {
//     const oldFile = existingInfo.backgroundTheme;

//     if (oldFile && oldFile !== "Default Theme Selected") {
//       const oldPath = path.join(process.cwd(), 'uploads/backgroundTheme', oldFile);
//       fs.unlink(oldPath, (err) => {
//         if (err) {
//           console.error("Failed to delete old background theme:", err.message);
//         }
//       });
//     }

//     updatedFields.backgroundTheme = newFilename;
//   }

//   // else if (!newFilename) {
//   //   updatedFields.backgroundTheme = "Default Theme Selected";
//   // }
//   else {
//     updatedFields.backgroundTheme = existingInfo.backgroundTheme;
//   }

//   const updatedFeedbackInfo = await feedbackInfoDao.reOpenFeedbackByEventId(event._id, updatedFields);

//   return updatedFeedbackInfo;
// }

exports.reOpenFeedbackByEventId = async (payload) => {
  const {
    eventId,
    masterSocket,
    isAnonymousFeedback,
    thankyouTimeout,
    backgroundTheme,
    idleTimeoutValue,
    idleTimeoutUnit,
  } = payload;

  const event = await eventDao.getEventById(eventId);
  if (!event) throw new Error("Event not found!");

  const existingInfo = await feedbackInfoDao.getFeedbackInformationByEvent(
    event._id,
  );
  if (!existingInfo) throw new Error("Feedback information not found!");

  let updatedFields = {
    isAnonymousFeedback,
    thankyouTimeout,
    masterSocket,
    idleTimeoutUnit,
    idleTimeoutValue,
  };

  let newFilename;
  if (backgroundTheme !== undefined) {
    newFilename =
      typeof backgroundTheme === "string"
        ? backgroundTheme
        : backgroundTheme?.filename;
  }

  if (newFilename) {
    const oldFile = existingInfo.backgroundTheme;
    logger.info("Theme change detected");
    logger.info("Old background theme:", oldFile);
    logger.info("New background theme:", newFilename);

    const oldNormalized = oldFile ? oldFile.toLowerCase() : "";
    const newNormalized = newFilename.toLowerCase();

    if (newNormalized !== oldNormalized) {
      if (oldFile && oldFile !== "Default Theme Selected") {
        const oldPath = path.join(
          process.cwd(),
          "uploads/backgroundTheme",
          oldFile,
        );
        const newPath = path.join(
          process.cwd(),
          "uploads/backgroundTheme",
          newFilename,
        );
        logger.info("Old path:", oldPath);
        logger.info("New path:", newPath);

        if (fs.existsSync(newPath) && fs.existsSync(oldPath)) {
          logger.info("Deleting old background theme file:", oldFile);
          fs.unlink(oldPath, (err) => {
            if (err) {
              logger.error(
                "Failed to delete old background theme:",
                err.message,
              );
            }
          });
        } else {
          logger.warn("Skip deletion: new or old file not found", {
            oldFile,
            newFilename,
          });
        }
      }

      updatedFields.backgroundTheme = newFilename;
    } else {
      logger.info("No change in background theme, keeping existing:", oldFile);
      updatedFields.backgroundTheme = oldFile;
    }
  } else if (newFilename === "Default Theme Selected") {
    updatedFields.backgroundTheme = "Default Theme Selected";
  } else {
    updatedFields.backgroundTheme = existingInfo.backgroundTheme;
  }

  const updatedFeedbackInfo = await feedbackInfoDao.reOpenFeedbackByEventId(
    event._id,
    updatedFields,
  );

  return updatedFeedbackInfo;
};
