const mongoose = require("mongoose");
const getNextSequence = require("../../utils/getNextSequence");
const autopopulate = require("mongoose-autopopulate");

const SurveyInformationSchema = new mongoose.Schema(
  {
    surveyInformationId: { type: Number, unique: true },
    surveyStatus: { type: String },
    surveyOwnerEmail: { type: String, required: true },
    masterSocket: { type: String },
    isAnonymousSurvey: { type: Boolean, default: false },
    emailMode: {
      type: String,
      enum: ["internal", "external"],
    },
    thankyouTimeout: { type: Number },
    idleTimeoutValue: { type: Number, required: true, default: 20 },
    idleTimeoutUnit: {
      type: String,
      enum: ["minutes", "hours"],
      default: "minutes",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      autopopulate: true,
    },
    backgroundTheme: { type: String, default: "default background video" },
  },
  { timestamps: true }
);

SurveyInformationSchema.plugin(autopopulate);

SurveyInformationSchema.index({ emailMode: 1 });
SurveyInformationSchema.index({ event: 1 }, { unique: true });

SurveyInformationSchema.pre("save", async function (next) {
  if (!this.surveyInformationId) {
    this.surveyInformationId = await getNextSequence("surveyInformationId");
  }
  next();
});

module.exports = mongoose.model("SurveyInformation", SurveyInformationSchema);
