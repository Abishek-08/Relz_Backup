const genderCount = require('../models/GenderCount');

exports.saveGenderCount = async(genderCountData) => {
    return await genderCount.create(genderCountData);
}

exports.getGenderCountById = async(genderCountId) => {
    return await genderCount.findOne({genderCountId});
}

exports.getAllEventCategories = async() => {
    return await genderCount.find();
}

exports.updateGenderCountById = async(genderCountId, updatedData) => {
    return await genderCount.findOneAndUpdate({genderCountId}, updatedData, {new:true})
}

exports.deleteGenderCountById = async(genderCountId) => {
    return await genderCount.findOneAndDelete({genderCountId});
}

exports.getGenderCountByEventId = async(eventObjectId) => {
    return await genderCount.find({event:eventObjectId});
}

exports.getGenderCountByEventIdAndResourceType = async(eventObjectId, resourceType) => {
    return await genderCount.findOne({event:eventObjectId, resourceType});
}