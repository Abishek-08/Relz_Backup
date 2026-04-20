const surveyInformationDao = require('../../dao/SurveyDao/SurveyInformationDao');
const eventDao = require('../../dao/EventDao');
const path = require('path');
const fs = require('fs');
const logger = require('../../logger');

exports.updateSurveyInformation = async (eventId, data) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not Found");
  }

  const surveyInfo = await surveyInformationDao.updateSurveyInformationById(event._id, data);

  if (!surveyInfo) {
    throw new Error("Survey Info not found!");
  }

  return surveyInfo;
};

exports.getSurveyInformationByEventId = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const surveyInfo = await surveyInformationDao.getSurveyInformationByEventId(event._id);

  return surveyInfo;
};

exports.reOpenSurveyByEventId = async (payload) => {
  const {
    eventId,
    masterSocket,
    isAnonymousSurvey,
    thankyouTimeout,
    backgroundTheme,
    idleTimeoutValue,
    idleTimeoutUnit
  } = payload;

  const event = await eventDao.getEventById(eventId);
  if (!event) throw new Error("Event not found!");

  const existingInfo = await surveyInformationDao.getSurveyInformationByEventId(event._id);
  if (!existingInfo) throw new Error("Survey information not found!");

  let updatedFields = {
    isAnonymousSurvey,
    thankyouTimeout,
    masterSocket,
    idleTimeoutUnit,
    idleTimeoutValue
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
        const oldPath = path.join(process.cwd(), "uploads/backgroundTheme", oldFile);
        const newPath = path.join(process.cwd(), "uploads/backgroundTheme", newFilename);
        logger.info("Old path:", oldPath);
        logger.info("New path:", newPath);

        if (fs.existsSync(newPath) && fs.existsSync(oldPath)) {
          logger.info("Deleting old background theme file:", oldFile);
          fs.unlink(oldPath, (err) => {
            if (err) {
              logger.error("Failed to delete old background theme:", err.message);
            }
          });
        } else {
          logger.warn("Skip deletion: new or old file not found", { oldFile, newFilename });
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

  const updatedSurveyInfo = await surveyInformationDao.reOpenSurveyByEventId(
    event._id,
    updatedFields
  );

  return updatedSurveyInfo;
};
