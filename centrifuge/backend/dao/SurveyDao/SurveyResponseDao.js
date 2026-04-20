const surveyResponse = require("../../models/SurveyModel/SurveyResponse");

exports.createSurveyResponse = async (surveyResponseData) => {
  return await surveyResponse.create(surveyResponseData);
};

exports.getSurveyResponseById = async (surveyResponseId) => {
  return await surveyResponse.findOne({ surveyResponseId });
};

exports.getSurveyResponsesByUserId = async (surveyUserId) => {
  return await surveyResponse.find({ surveyUser: surveyUserId });
};

// exports.getSurveyResponsesByEventId = async (eventId) => {
//   return await surveyResponse.find({ event: eventId });
// };

exports.getSurveyResponsesByQuestionId = async (questionId) => {
  return await surveyResponse.find({ surveyQuestion: questionId });
};

exports.updateSurveyResponseById = async (surveyResponseId, updatedData) => {
  return await surveyResponse.findOneAndUpdate(
    { surveyResponseId: surveyResponseId },
    updatedData,
    { new: true },
  );
};

exports.deleteSurveyResponseById = async (surveyResponseId) => {
  return await surveyResponse.findOneAndDelete({
    surveyResponseId: surveyResponseId,
  });
};

exports.getSurveyResponsesByEventId = async (eventObjectId) => {
  const responses = await surveyResponse
    .find({ event: eventObjectId })
    .select(
      "_id surveyResponseId surveyQuestion surveyResponse surveyUser event",
    )
    .populate({
      path: "surveyQuestion",
      select:
        "_id surveyQuestion surveyQuestionId surveyQuestionType scaleMin scaleMax scaleLabels surveyCheckBoxOptions matrixQnLabels",
    })
    .populate({ path: "surveyUser", select: "surveyUserEmail" })
    .populate({
      path: "event",
      select: "eventName eventDate eventStatus eventOrganizer",
    });
  return responses;
};

exports.getSurveyResponseCountByEventId = async (eventObjectId) => {
  return await surveyResponse.countDocuments({ event: eventObjectId });
};

// for survey reports
exports.findByEventWithFilter = (eventObjId, dateFilter) => {
  return surveyResponse
    .find({ event: eventObjId, ...dateFilter })
    .populate("surveyQuestion")
    .lean();
};

exports.findResponseByEventPaginated = async (eventObjId, page, limit) => {
  const skip = (page - 1) * limit;

  const data = await surveyResponse
    .find({ event: eventObjId })
    .populate("surveyUser")
    .populate("surveyQuestion")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await surveyResponse.countDocuments({ event: eventObjId });
  return { data, total };
};

exports.getSurveyResponsesByEventAndUser = async (
  eventObjectId,
  surveyUserObjectId,
) => {
  return surveyResponse
    .find({ event: eventObjectId, surveyUser: surveyUserObjectId })
    .select(
      "_id surveyResponseId surveyQuestion surveyResponse surveyUser event createdAt",
    )
    .populate({
      path: "surveyQuestion",
      select:
        "_id surveyQuestion surveyQuestionId surveyQuestionType displayOrder scaleMin scaleMax scaleLabels surveyCheckBoxOptions matrixQnLabels",
    })
    .populate({ path: "surveyUser", select: "surveyUserEmail" })
    .populate({
      path: "event",
      select: "eventName eventDate eventStatus eventOrganizer",
    })
    .lean();
};
