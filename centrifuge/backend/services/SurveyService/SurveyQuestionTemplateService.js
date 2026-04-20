const path = require("path");
const fs = require("fs");
const logger = require("../../logger");
const eventDao = require("../../dao/EventDao");
const eventCategoryDao = require("../../dao/EventCategoryDao");
const surveyInformationDao = require("../../dao/SurveyDao/SurveyInformationDao");
const eventCategoryService = require("../../services/EventCategoryService");
const surveyQuestionDao = require("../../dao/SurveyDao/SurveyQuestionTemplateDao");
const surveyQuestionTemplateDao = require("../../dao/SurveyDao/SurveyQuestionTemplateDao");

/**
 * Add a survey question for an event
 */
// exports.addSurveyQuestionForEvent = async ({
//   eventId,
//   surveyQuestion,
//   surveyQuestionType,
//   surveyCheckBoxOptions,
//   scaleMin,
//   scaleMax,
//   scaleLabels,
//   matrixQnLabels,
//   required,
//   surveyOwnerEmail,
//   masterSocket,
//   isAnonymousSurvey,
//   backgroundTheme,
//   thankyouTimeout,
//   idleTimeoutValue,
//   idleTimeoutUnit,
//   displayOrder
// }) => {
//   const backgroundThemeFilename = backgroundTheme || "Default Theme Selected";

//   try {
//     const event = await eventDao.getEventById(eventId);
//     if (!event) throw new Error(`Event not found for this Id: ${eventId}`);

//     const surveyQuestionData = {
//       event: event._id,
//       surveyQuestion,
//       surveyQuestionType,
//       surveyCheckBoxOptions,
//       scaleMin,
//       scaleMax,
//       scaleLabels,
//       matrixQnLabels,
//       required,
//       displayOrder
//     };

//     const savedSurveyQuestion = await surveyQuestionTemplateDao.createSurveyQuestionTemplate(surveyQuestionData);

//     let savedSurveyInformation = await surveyInformationDao.getSurveyInformationByEventId(event._id);

//     if (!savedSurveyInformation) {
//       const surveyInformationData = {
//         surveyStatus: 'launched',
//         surveyOwnerEmail,
//         isAnonymousSurvey,
//         masterSocket,
//         event: event._id,
//         backgroundTheme: backgroundThemeFilename,
//         thankyouTimeout,
//         idleTimeoutUnit,
//         idleTimeoutValue
//       };
//       logger.info("Calling dao for creating survey info", surveyInformationData)

//       savedSurveyInformation = await surveyInformationDao.createSurveyInformation(surveyInformationData);
//             logger.info("completed Calling dao for creating survey info")

//     }

//     await eventDao.updateIsFeedbackLaunched(eventId);

//     return { savedSurveyQuestion, savedSurveyInformation };
//   } catch (err) {
//     if (backgroundThemeFilename && backgroundThemeFilename !== "Default Theme Selected") {
//       const filePath = path.join(process.cwd(), 'uploads/backgroundTheme', backgroundThemeFilename);
//       fs.unlink(filePath, (unlinkErr) => {
//         if (unlinkErr) {
//           logger.error('Failed to delete unsaved backgroundTheme file', { filePath, error: unlinkErr.message });
//         } else {
//           logger.info('Cleaned up backgroundTheme file due to API call failure', { filePath });
//         }
//       });
//     }
//     throw err;
//   }
// };

/**
 * Add one or more survey questions for an event and launch feedback
 */
exports.addSurveyQuestionForEvent = async ({
  eventId,
  questions,
  surveyQuestion,
  surveyQuestionType,
  surveyCheckBoxOptions,
  scaleMin,
  scaleMax,
  scaleLabels,
  matrixQnLabels,
  required,
  surveyOwnerEmail,
  masterSocket,
  isAnonymousSurvey,
  backgroundTheme,
  thankyouTimeout,
  idleTimeoutValue,
  idleTimeoutUnit,
  displayOrder,
  emailMode,
}) => {
  const backgroundThemeFilename = backgroundTheme || "Default Theme Selected";

  try {
    const event = await eventDao.getEventById(eventId);
    if (!event) throw new Error(`Event not found for this Id: ${eventId}`);

    let savedSurveyQuestions = [];

    if (Array.isArray(questions) && questions.length > 0) {
      // Bulk insert path
      const surveyQuestionDataArray = questions.map((q) => ({
        event: event._id,
        surveyQuestion: q.surveyQuestion,
        surveyQuestionType: q.surveyQuestionType,
        surveyCheckBoxOptions: q.surveyCheckBoxOptions || [],
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        scaleLabels: q.scaleLabels || [],
        matrixQnLabels: q.matrixQnLabels || [],
        required: q.required || false,
        displayOrder: q.displayOrder || 0,
      }));

      savedSurveyQuestions =
        await surveyQuestionTemplateDao.createSurveyQuestionTemplates(
          surveyQuestionDataArray,
        );
    } else {
      const surveyQuestionData = {
        event: event._id,
        surveyQuestion,
        surveyQuestionType,
        surveyCheckBoxOptions,
        scaleMin,
        scaleMax,
        scaleLabels,
        matrixQnLabels,
        required,
        displayOrder,
      };

      const savedSurveyQuestion =
        await surveyQuestionTemplateDao.createSurveyQuestionTemplate(
          surveyQuestionData,
        );
      savedSurveyQuestions = [savedSurveyQuestion];
    }

    // Ensure surveyInformation exists
    let savedSurveyInformation =
      await surveyInformationDao.getSurveyInformationByEventId(event._id);

    if (!savedSurveyInformation) {
      const surveyInformationData = {
        surveyStatus: "launched",
        surveyOwnerEmail,
        isAnonymousSurvey,
        masterSocket,
        event: event._id,
        backgroundTheme: backgroundThemeFilename,
        thankyouTimeout,
        idleTimeoutUnit,
        idleTimeoutValue,
        emailMode,
      };
      logger.info(
        "Calling dao for creating survey info",
        surveyInformationData,
      );

      savedSurveyInformation =
        await surveyInformationDao.createSurveyInformation(
          surveyInformationData,
        );
      logger.info("completed Calling dao for creating survey info");
    }

    await eventDao.updateIsSurveyLaunched(eventId);

    return { savedSurveyQuestions, savedSurveyInformation };
  } catch (err) {
    if (
      backgroundThemeFilename &&
      backgroundThemeFilename !== "Default Theme Selected"
    ) {
      const filePath = path.join(
        process.cwd(),
        "uploads/backgroundTheme",
        backgroundThemeFilename,
      );
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          logger.error("Failed to delete unsaved backgroundTheme file", {
            filePath,
            error: unlinkErr.message,
          });
        } else {
          logger.info(
            "Cleaned up backgroundTheme file due to API call failure",
            {
              filePath,
            },
          );
        }
      });
    }
    throw err;
  }
};

/**
 * Get survey questions by Event ID
 */
exports.getSurveyQuestionsByEventId = async (eventId) => {
  try {
    logger.info("Fetching survey questions by Event ID", { eventId });
    const event = await eventDao.getEventById(eventId);
    if (!event) {
      logger.warn("Event not found while fetching survey questions", {
        eventId,
      });
      throw new Error(`Event not found for this Id: ${eventId}`);
    }
    const questions =
      await surveyQuestionTemplateDao.getAllSurveyQuestionsByEventId(event._id);
    logger.info("Fetched survey questions count by Event ID", {
      eventId,
      count: questions.length,
    });
    return questions;
  } catch (err) {
    logger.error("Error fetching survey questions by Event ID", {
      eventId,
      error: err.message,
    });
    throw err;
  }
};

/**
 * Get all survey questions
 */
exports.getAllSurveyQuestions = async () => {
  try {
    logger.info("Fetching all survey questions");
    const questions = await surveyQuestionTemplateDao.getAllSurveyQuestions();
    if (!questions || questions.length === 0) {
      logger.warn("No survey questions found");
      throw new Error(`No survey questions found!`);
    }
    logger.info("Fetched all survey questions", { count: questions.length });
    return questions;
  } catch (err) {
    logger.error("Error fetching all survey questions", { error: err.message });
    throw err;
  }
};

/**
 * Get survey questions by EventCategory ID
 */
exports.getSurveyQuestionsByEventCategoryId = async (eventCategoryId) => {
  try {
    logger.info("Fetching survey questions by EventCategory ID", {
      eventCategoryId,
    });
    const eventCategory =
      await eventCategoryDao.getEventCategoryById(eventCategoryId);
    if (!eventCategory) {
      logger.warn("Event Category not found", { eventCategoryId });
      throw new Error("Event Category not found");
    }
    const questions =
      await surveyQuestionTemplateDao.getSurveyQuestionsByEventCategoryId(
        eventCategoryId,
      );
    if (!questions || questions.length === 0) {
      logger.warn("No survey questions found for EventCategory", {
        eventCategoryId,
      });
      throw new Error("No survey questions found");
    }
    logger.info("Fetched survey questions count by EventCategory ID", {
      eventCategoryId,
      count: questions.length,
    });
    return questions;
  } catch (err) {
    logger.error("Error fetching survey questions by EventCategory ID", {
      eventCategoryId,
      error: err.message,
    });
    throw err;
  }
};

/**
 * Get survey questions by EventCategory ID and Event ID
 */
exports.getSurveyQuestionsByEventCategoryAndEventId = async (
  eventCategoryId,
  eventId,
) => {
  try {
    logger.info("Fetching survey questions by EventCategory ID and Event ID", {
      eventCategoryId,
      eventId,
    });

    const eventCategory =
      await eventCategoryDao.getEventCategoryById(eventCategoryId);
    if (!eventCategory) {
      logger.warn("Event Category not found", { eventCategoryId });
      throw new Error("Event Category not found");
    }

    const event = await eventDao.getEventById(eventId);
    if (!event) {
      logger.warn("Event not found", { eventId });
      throw new Error("Event not found");
    }

    const questions =
      await surveyQuestionTemplateDao.getSurveyQuestionsByEventCategoryAndEventId(
        eventCategoryId,
        eventId,
      );
    if (!questions || questions.length === 0) {
      logger.warn("No survey questions found for EventCategory and Event", {
        eventCategoryId,
        eventId,
      });
      throw new Error("No survey questions found");
    }

    logger.info(
      "Fetched survey questions count by EventCategory and Event ID",
      { eventCategoryId, eventId, count: questions.length },
    );
    return questions;
  } catch (err) {
    logger.error(
      "Error fetching survey questions by EventCategory and Event ID",
      { eventCategoryId, eventId, error: err.message },
    );
    throw err;
  }
};
