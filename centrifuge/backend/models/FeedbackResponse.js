const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');


const feedbackResponseSchema = new mongoose.Schema({
    feedbackResponseId: { type: Number, unique: true },
    feedbackQuestion: { type: mongoose.Schema.Types.ObjectId, ref:'FeedbackQuestion', required: true, autopopulate:true },
    feedbackResponse: { type: Number, required: true },
    feedbackUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeedbackUser',
        required: true,
        autopopulate: true,
    },
    event:{type:mongoose.Schema.Types.ObjectId, ref:'Event', required:true, autopopulate:true}
}, { timestamps: true });
feedbackResponseSchema.plugin(autopopulate);

feedbackResponseSchema.pre('save', async function (next) {
    if (!this.feedbackResponseId) {
        this.feedbackResponseId = await getNextSequence('feedbackResponseId');
    }
    next();
});

module.exports = mongoose.model('FeedbackResponse', feedbackResponseSchema);