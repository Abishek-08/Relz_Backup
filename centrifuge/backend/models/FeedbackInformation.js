const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const feedbackInformationSchema = new mongoose.Schema({
    feedbackInformationId: { type: Number, unique: true },
    feedbackStatus: { type: String },
    totalNoOfResponse: { type: Number },
    totalNoOfUnknownResponse: { type: Number },
    email: { type: String, required: true },
    masterSocket: { type: String },
    isAnonymousFeedback: { type: Boolean, default: false },
    thankyouTimeout:{type:Number},
    idleTimeoutValue: { type: Number, require: true, default: 20 },
    idleTimeoutUnit: { type: String, enum: ["minutes", "hours"], default: "minutes", require: true },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        autopopulate: true,
    },
    backgroundTheme: { type: String, required: false, default: "default background video" }
})
feedbackInformationSchema.plugin(autopopulate);
feedbackInformationSchema.index({ event: 1 }, { unique: true });


feedbackInformationSchema.pre('save', async function (next) {
    if (!this.feedbackInformationId) {
        this.feedbackInformationId = await getNextSequence('feedbackInformationId');
    }
    next();
});

module.exports = mongoose.model('FeedbackInformation', feedbackInformationSchema);
