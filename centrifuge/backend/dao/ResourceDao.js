const resource = require('../models/Resource');

exports.createResource = async(data) => {
    return await resource.create(data);
};

exports.updateResource = async(resourceId,data) => {
    return await resource.findOneAndUpdate({resourceId},data,{new:true});
};

exports.findResourceById = async(resourceId) => {
    return await resource.findOne({resourceId});
};

exports.findResourceByEventId = async(eventObjectId) => {
    return await resource.find({event: eventObjectId});
};

exports.getAllResources = async() => {
    return await resource.find();
}

exports.deleteResourceById = async(resourceId) => {
    return await resource.findOneAndDelete({resourceId});
};