const eventManager = require('../models/EventManager');

exports.createEventManager = async(eventManagerData) => {
    return await eventManager.create(eventManagerData);
};

exports.getAllEventManager = async() => {
    return await eventManager.find();
};

exports.getEventManagerById = async(eventManagerId) => {
    return await eventManager.findOne({eventManagerId});
};

exports.updateEventManagerById = async(eventManagerId, eventManagerData) => {
   return await eventManager.findOneAndUpdate({eventManagerId}, eventManagerData, {new:true})
};

exports.updateAccountStatus = async(eventManagerId, accountStatus) => {
   return await eventManager.findOneAndUpdate({eventManagerId},{accountStatus}, {new:true});
};

exports.checkEventManagerByEmail = async(email) => {
    const existing = await eventManager.findOne({email});
    return existing;
};


