const logger = require("../../logger");
const surveyQuestionTemplate = require("../../models/SurveyModel/SurveyQuestionTemplate");
const getNextSequence = require("../../utils/getNextSequence");

exports.createSurveyQuestionTemplate = async (templateData) => {
  return await surveyQuestionTemplate.create(templateData);
};

exports.createSurveyQuestionTemplates = async (templatesArray) => {
  for (const doc of templatesArray) {
    doc.surveyQuestionId = await getNextSequence("surveyQuestionId");
  }
  return await surveyQuestionTemplate.insertMany(templatesArray);
};

exports.getSurveyQuestionTemplateById = async (templateId) => {
  return await surveyQuestionTemplate.find({ surveyQuestionId: templateId });
};

exports.getAllSurveyQuestions = async () => {
  return await surveyQuestionTemplate.find();
};

exports.getAllSurveyQuestionsByEventId = async (eventObjId) => {
  return await surveyQuestionTemplate.find({ event: eventObjId });
};

exports.updateSurveyQuestionTemplateById = async (
  surveyQuestionId,
  updatedData,
) => {
  return await surveyQuestionTemplate.findOneAndUpdate(
    { surveyQuestionId },
    updatedData,
    { new: true },
  );
};

exports.deleteSurveyQuestionTemplateById = async (surveyQuestionId) => {
  return await surveyQuestionTemplate.findOneAndDelete({ surveyQuestionId });
};

exports.getSurveyQuestionsByEventCategoryId = async (eventCategoryId) => {
  const questions = await surveyQuestionTemplate
    .find()
    .select(
      "_id surveyQuestionId surveyQuestion surveyQuestionType surveyCheckBoxOptions scaleMin scaleMax scaleLabels matrixQnLabels required displayOrder event",
    )
    .populate({
      path: "event",
      match: {
        "eventCategory.eventCategoryId": Number(eventCategoryId),
      },
      populate: { path: "eventCategory" },
    });

  const filteredQuestions = questions
    .filter(
      (q) =>
        q.event &&
        q.event.eventCategory &&
        q.event.eventCategory.eventCategoryId === Number(eventCategoryId),
    )
    .map((q) => ({
      _id: q._id,
      surveyQuestionId: q.surveyQuestionId,
      surveyQuestion: q.surveyQuestion,
      surveyQuestionType: q.surveyQuestionType,
      surveyCheckBoxOptions: q.surveyCheckBoxOptions,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      scaleLabels: q.scaleLabels,
      matrixQnLabels: q.matrixQnLabels,
      required: q.required,
      displayOrder: q.displayOrder,
    }));
  return filteredQuestions;
};

exports.getSurveyQuestionsByEventCategoryAndEventId = async (
  eventCategoryId,
  eventId,
) => {
  logger.info("eventCategoryId", eventCategoryId);
  logger.info("eventId", eventId);

  const questions = await surveyQuestionTemplate
    .find()
    .select(
      "_id surveyQuestionId surveyQuestion surveyQuestionType surveyCheckBoxOptions scaleMin scaleMax scaleLabels matrixQnLabels required displayOrder event",
    )
    .populate({
      path: "event",
      match: {
        eventId: Number(eventId),
        "eventCategory.eventCategoryId": Number(eventCategoryId),
      },
      populate: { path: "eventCategory" },
    });

  logger.info("Raw survey questions length:", questions.length);

  const filteredQuestions = questions
    .filter(
      (q) =>
        q.event &&
        q.event.eventCategory &&
        q.event.eventCategory.eventCategoryId === Number(eventCategoryId) &&
        q.event.eventId === Number(eventId),
    )
    .map((q) => ({
      _id: q._id,
      surveyQuestionId: q.surveyQuestionId,
      surveyQuestion: q.surveyQuestion,
      surveyQuestionType: q.surveyQuestionType,
      surveyCheckBoxOptions: q.surveyCheckBoxOptions,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      scaleLabels: q.scaleLabels,
      matrixQnLabels: q.matrixQnLabels,
      required: q.required,
      displayOrder: q.displayOrder,
    }));
  logger.info("Filtered survey questions length:", filteredQuestions.length);
  return filteredQuestions;
};

//for survey reports
exports.findByEventOrdered = (evenObjId) => {
  return surveyQuestionTemplate
    .find({ event: evenObjId})
    .sort({ displayOrder: 1 })
    .lean();
}