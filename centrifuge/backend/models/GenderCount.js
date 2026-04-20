const mongoose = require("mongoose");
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const genderSchema = mongoose.Schema({
    genderCountId: { type: Number, unique: true},
    maleCount: {type: Number, required: true},
    femaleCount: {type: Number, required: true},
    unknownCount: {type: Number, required: true},
    totalCount:{type: Number, required:true},
    resourceType:{
        type: String,
        enum: ["IMAGES", "VIDEOS"],
        require: true
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        autopopulate: true
    }
}, { timestamps: true });

genderSchema.plugin(autopopulate);

genderSchema.pre('save', async function(next){
    if(!this.genderCountId){
        this.genderCountId = await getNextSequence('genderCountId');
    }
    next();
});

module.exports = mongoose.model('GenderCount', genderSchema);