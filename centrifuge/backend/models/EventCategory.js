const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const eventCategorySchema = new mongoose.Schema({
    eventCategoryId: {type: Number, unique: true},
    eventCategoryName: {type: String, required: true},
    eventCategoryDescription: {type: String, required: true},
    eventCategoryLogo: {type: String, required: true}
}, {timestamps: true});

eventCategorySchema.pre('save', async function(next) {
    if(!this.eventCategoryId){
        this.eventCategoryId = await getNextSequence('eventCategoryId');
    }
    next();
});

module.exports = mongoose.model('EventCategory', eventCategorySchema);