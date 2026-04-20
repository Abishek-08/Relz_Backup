const eventCategoryDao = require("../dao/EventCategoryDao");
const fs = require("fs");
const path = require("path");

exports.createEventCategory = async (data, file) => {
  const { eventCategoryName, eventCategoryDescription } = data;
  const eventCategoryLogo = file.filename;

  const eventCategoryData = {
    eventCategoryName,
    eventCategoryDescription,
    eventCategoryLogo,
  };

  return await eventCategoryDao.createEventCategory(eventCategoryData);
};

exports.getEventCategoryById = async (eventCategoryId) => {
  return await eventCategoryDao.getEventCategoryById(eventCategoryId);
};

exports.getAllEventCategories = async () => {
  return await eventCategoryDao.getAllEventCategories();
};

exports.updateEventCategoryById = async (eventCategoryId, data) => {
  const { eventCategoryName, eventCategoryDescription, filename } = data;

  const updatedData = {
    eventCategoryName,
    eventCategoryDescription,
  };

  const existingEventCategory =
    await eventCategoryDao.getEventCategoryById(eventCategoryId);

  if (filename && existingEventCategory.eventCategoryLogo) {
    const oldFilePath = path.join(
      __dirname,
      "../uploads/images",
      existingEventCategory.eventCategoryLogo,
    );
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    updatedData.eventCategoryLogo = filename;
  }

  return await eventCategoryDao.updateEventCategoryById(
    eventCategoryId,
    updatedData,
  );
};

exports.deleteEventCategoryById = async (eventCategoryId) => {
  const existingEventCategory =
    await eventCategoryDao.getEventCategoryById(eventCategoryId);

  if (existingEventCategory && existingEventCategory.eventCategoryLogo) {
    const logoPath = path.join(
      __dirname,
      "../uploads/images",
      existingEventCategory.eventCategoryLogo,
    );
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
  }
  return await eventCategoryDao.deleteEventCategoryById(eventCategoryId);
};

exports.getAllEventCategoriesMinimal = async () => {
  return await eventCategoryDao.getAllEventCategoriesMinimal();
};
