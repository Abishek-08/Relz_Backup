const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const feedbackQuestionSchema = new mongoose.Schema({
    feedbackQuestionId: { type: Number, unique: true },
    feedbackQuestion: { type: String, required: true },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        autopopulate: true,
    }
}, { timestamps: true });

feedbackQuestionSchema.pre('save', async function (next) {
    if (!this.feedbackQuestionId) {
        this.feedbackQuestionId = await getNextSequence('feedbackQuestionId');
    }
    next();
});

module.exports = mongoose.model('FeedbackQuestion', feedbackQuestionSchema);