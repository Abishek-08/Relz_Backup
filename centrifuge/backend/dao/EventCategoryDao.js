const eventCategory = require("../models/EventCategory");

exports.createEventCategory = async (eventCategoryData) => {
  return await eventCategory.create(eventCategoryData);
};

exports.getEventCategoryById = async (eventCategoryId) => {
  return await eventCategory.findOne({ eventCategoryId });
};

exports.getAllEventCategories = async () => {
  return await eventCategory.find();
};

exports.updateEventCategoryById = async (eventCategoryId, updatedData) => {
  return await eventCategory.findOneAndUpdate(
    { eventCategoryId },
    updatedData,
    { new: true },
  );
};

exports.deleteEventCategoryById = async (eventCategoryId) => {
  return await eventCategory.findOneAndDelete({ eventCategoryId });
};

exports.getAllEventCategoriesMinimal = async () => {
  return await eventCategory.find().select("_id eventCategoryId eventCategoryName");
};
