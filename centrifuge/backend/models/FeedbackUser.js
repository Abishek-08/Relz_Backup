const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const feedbackUserSchema = new mongoose.Schema({
    feedbackUserId : { type: Number, unique: true },
    feedbackUserName: { type: String, required: true },
    feedbackUserEmail: { type: String, required: true },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        autopopulate: true,
    },
    isVerified :{type:Boolean, default:'false'}
}, { timestamps: true });
feedbackUserSchema.plugin(autopopulate);

feedbackUserSchema.pre('save', async function (next) {
    if (!this.feedbackUserId) {
        this.feedbackUserId = await getNextSequence('feedbackUserId');
    }
    next();
});

module.exports = mongoose.model('FeedbackUser', feedbackUserSchema);