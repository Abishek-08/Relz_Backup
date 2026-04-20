const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const eventManagerSchema = new mongoose.Schema({
    eventManagerId:{type:Number, unique:true},
    fullName:{type:String},
    email:{type:String, require:true},
    accountStatus:{type: String, require:true, default: "ACTIVE"},

},{timestamps:true});

eventManagerSchema.pre('save', async function(next){
    if(!this.eventManagerId){
        this.eventManagerId = await getNextSequence('eventManagerId');
    }
    next();
});

module.exports = mongoose.model('EventManager', eventManagerSchema);