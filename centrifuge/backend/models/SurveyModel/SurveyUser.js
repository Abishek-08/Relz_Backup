const mongoose = require('mongoose');
const getNextSequence = require('../../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const SurveyUserSchema = new mongoose.Schema({
  surveyUserId: { type: Number, unique: true },
//   surveyUserName: { type: String, required: true },
  surveyUserEmail: { type: String, required: true },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    autopopulate: true,
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

SurveyUserSchema.plugin(autopopulate);

SurveyUserSchema.pre('save', async function(next) {
  if (!this.surveyUserId) {
    this.surveyUserId = await getNextSequence('surveyUserId');
  }
  next();
});

module.exports = mongoose.model('SurveyUser', SurveyUserSchema);
