const mongoose = require("mongoose");
const getNextSequence = require("../../utils/getNextSequence");
const autoPopulate = require('mongoose-autopopulate');

const SurveyResponseSchema = mongoose.Schema(
  {
    surveyResponseId: {
      type: Number,
      unique: true,
    },
    surveyQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurveyQuestionTemplate",
      required: true,
      autoPopulate: true,
    },
    surveyResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    surveyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurveyUser",
      required: true,
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, autopopulate: true }
  },
  { timestamps: true }
);

SurveyResponseSchema.plugin(autoPopulate);

SurveyResponseSchema.pre("save", async function (next) {
  if (!this.surveyResponseId) {
    this.surveyResponseId = await getNextSequence("surveyResponseId");
  }
  next();
});

SurveyResponseSchema.index({ surveyUser: 1, surveyQuestion: 1}, {unique: true});
SurveyResponseSchema.index({ event: 1 });
SurveyResponseSchema.index({ event: 1, surveyQuestion: 1 });
SurveyResponseSchema.index({ event: 1, surveyUser: 1 });

module.exports = mongoose.model("SurveyResponse", SurveyResponseSchema);
