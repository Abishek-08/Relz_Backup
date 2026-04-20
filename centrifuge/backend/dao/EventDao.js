const event = require("../models/Event");
const eventCategory = require("../models/EventCategory");

exports.createEvent = async (eventData) => {
  return await event.create(eventData);
};

exports.getEventById = async (eventId) => {
  return await event.findOne({ eventId });
};

exports.getAllEvent = async () => {
  return await event.find();
};

exports.updateEventById = async (eventId, updatedData) => {
  return await event.findOneAndUpdate({ eventId }, updatedData, { new: true });
};

exports.deleteEventById = async (eventId) => {
  return await event.findOneAndDelete({ eventId });
};

exports.getEventsByEventCategoryId = async (eventObjectId) => {
  return await event.find({ eventCategory: eventObjectId });
};

exports.updateEventStatusByEventId = async (eventId, eventStatus) => {
  return await event.findOneAndUpdate(
    { eventId },
    { eventStatus: eventStatus },
    { new: true },
  );
};

exports.updateIsFeedbackLaunched = async (eventId) => {
  return await event.findOneAndUpdate(
    { eventId },
    { isFeedbackLaunched: true },
    { new: true },
  );
};

exports.updateIsSurveyLaunched = async (eventId) => {
  return await event.findOneAndUpdate(
    { eventId },
    { isSurveyLaunched: true },
    { new: true },
  );
};


exports.getEventsByCategoryMinimal = async (eventCategoryId) => {
  const category = await eventCategory.findOne({ eventCategoryId: Number(eventCategoryId) })
    .select('_id eventCategoryId eventCategoryName');

  if (!category) {
    return [];
  }

  const events = await event.find({ eventCategory: category._id })
    .select('_id eventId eventName')
    .populate('eventCategory', 'eventCategoryId eventCategoryName');

  return events;
};