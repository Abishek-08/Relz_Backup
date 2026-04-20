const mongoose = require("mongoose");
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const resourceSchema = mongoose.Schema({
    resourceId: { type: Number, unique:true },
    images: {type: [String],},
    videos: {type: [String]},
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        autopopulate: true
    }
}, { timestamps: true });

resourceSchema.plugin(autopopulate);

resourceSchema.pre('save', async function(next){
    if(!this.resourceId){
        this.resourceId = await getNextSequence('resourceId');
    }
    next();
});

module.exports = mongoose.model('Resource', resourceSchema);