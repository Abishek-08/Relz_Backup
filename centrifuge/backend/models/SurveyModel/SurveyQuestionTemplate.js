const mongoose = require("mongoose");
const getNextSequence = require("../../utils/getNextSequence");
const autoPopulate = require("mongoose-autopopulate");

const SurveyQuestionTemplateSchema = mongoose.Schema(
  {
    surveyQuestionId: {
      type: Number,
      unique: true,
    },
    surveyQuestion: {
      type: String,
      required: true,
    },
    surveyQuestionType: {
      type: String,
      required: true,
      enum: [
        "slider",
        "rating",
        "comment",
        "matrix",
        "checkbox",
        "radio",
        "star",
        "dropdown"
      ],
    },
    surveyCheckBoxOptions: {
      type: [String]
    },
    scaleMin: { type: Number },
    scaleMax: { type: Number },
    scaleLabels: { type: [String], default: [] },
    matrixQnLabels: {
      type: [String]
    },
    required: {
      type: Boolean,
      default: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      autopopulate: true,
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SurveyQuestionTemplateSchema.plugin(autoPopulate);

SurveyQuestionTemplateSchema.pre("save", async function (next) {
  if (!this.surveyQuestionId) {
    this.surveyQuestionId = await getNextSequence("surveyQuestionId");
  }
  next();
});

SurveyQuestionTemplateSchema.index(
  { event: 1, surveyQuestionType: 1 }
);
SurveyQuestionTemplateSchema.index({ event: 1, displayOrder: 1 });

module.exports = mongoose.model(
  "SurveyQuestionTemplate",
  SurveyQuestionTemplateSchema
);
