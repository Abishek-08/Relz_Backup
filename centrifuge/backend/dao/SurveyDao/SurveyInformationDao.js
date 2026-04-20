const mongoose = require("mongoose");
const surveyInformation = require("../../models/SurveyModel/SurveyInformation");

exports.createSurveyInformation = async (surveyInfoData) => {
  return await surveyInformation.create(surveyInfoData);
};

exports.getSurveyInformationById = async (surveyInfoId) => {
  return await surveyInformation.findOne({ surveyInformationId: surveyInfoId });
};

exports.getSurveyInformationByEventId = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new Error(`Invalid Event Id ${eventId}`);
  }
  return await surveyInformation.findOne({
    event: new mongoose.Types.ObjectId(eventId),
  });
};

exports.getAllSurveyInformation = async () => {
  return await surveyInformation.find();
};

exports.updateSurveyInformationById = async (
  eventId,
  updatedSurveyInfoData,
) => {
  return await surveyInformation.findOneAndUpdate(
    { event: eventId },
    updatedSurveyInfoData,
    { new: true },
  );
};

exports.deleteSurveyInformationById = async (surveyInfoId) => {
  return await surveyInformation.findOneAndDelete({
    surveyInformationId: surveyInfoId,
  });
};

exports.reOpenSurveyByEventId = async (eventObjectId, updatedFields) => {
  return await surveyInformation.findOneAndUpdate(
    { event: eventObjectId },
    { $set: { surveyStatus: "launched", ...updatedFields } },
    { new: true },
  );
};

//for reports
exports.findSurveyInfoByEvent = (eventObjId) => {
  return surveyInformation
    .findOne({ event: eventObjId })
    .populate("event")
    .lean();
};
