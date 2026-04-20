const mongoose = require("mongoose");
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const eventSchema = mongoose.Schema({
    eventId: { type: Number, unique: true },
    eventName: { type: String, required: true },
    eventPoster: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventDescription:{type: String, requried: true},
    eventStatus: { type: String, required: true, default: 'Created' },
    eventOrganizer: {type:String, required:true},
    eventCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventCategory',
         autopopulate: true
    },
    isFeedbackLaunched: { type:Boolean, default:false},
    isSurveyLaunched: { type: Boolean, default: false}
    
}, { timestamps: true });

eventSchema.plugin(autopopulate);

eventSchema.pre('save', async function(next){
    if(!this.eventId){
        this.eventId = await getNextSequence('eventId');
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);