const eventDao = require("../dao/EventDao");
const eventCategoryDao = require("../dao/EventCategoryDao");
const path = require("path");
const fs = require("fs");

exports.createEvent = async (data, file) => {
  const {
    eventName,
    eventDescription,
    eventDate,
    eventOrganizer,
    eventCategoryId,
  } = data;
  const eventPoster = file.filename;

  const eventCategory =
    await eventCategoryDao.getEventCategoryById(eventCategoryId);
  if (!eventCategory) {
    throw new Error("Event Category not found");
  }

  const eventData = {
    eventName,
    eventDescription,
    eventPoster,
    eventOrganizer,
    eventDate,
    eventCategory: eventCategory._id,
  };

  return await eventDao.createEvent(eventData);
};

exports.getEventById = async (eventId) => {
  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error("No Events found for this ID");
  }

  return event;
};

exports.getAllEventCategories = async () => {
  const response = await eventDao.getAllEvent();

  if (!response) {
    throw new Error("No events found!");
  }

  return response;
};

exports.updateEventById = async (eventId, data) => {
  const { eventName, eventDate, eventDescription, eventOrganizer, filename } =
    data;

  const updatedData = {
    eventName,
    eventDescription,
    eventDate,
    eventOrganizer,
  };

  if (filename) {
    updatedData.eventPoster = filename;
  }

  const existingEvent = await eventDao.getEventById(eventId); // Assumes you have this method

  if (!existingEvent) {
    throw new Error("Event not found!");
  }

  if (filename && existingEvent.eventPoster) {
    const oldFilePath = path.join(
      __dirname,
      "../uploads/images",
      existingEvent.eventPoster,
    );
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    updatedData.eventPoster = filename;
  }

  const event = await eventDao.updateEventById(eventId, updatedData);

  return event;
};

exports.deleteEventById = async (eventId) => {
  const existingEvent = await eventDao.getEventById(eventId);

  if (!existingEvent) {
    throw new Error("No event found for this ID");
  }

  if (existingEvent.eventPoster) {
    const filePath = path.join(
      __dirname,
      "../uploads/images",
      existingEvent.eventPoster,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const event = await eventDao.deleteEventById(eventId);

  return event;
};

exports.getEventsByEventCategoryId = async (eventCategoryId) => {
  const eventCategory =
    await eventCategoryDao.getEventCategoryById(eventCategoryId);

  if (!eventCategory) {
    throw new Error("Event Category not found");
  }

  const events = await eventDao.getEventsByEventCategoryId(eventCategory._id);

  if (!events) {
    throw new Error("No events found for this category");
  }
  return events;
};

exports.updateEventStatusByEventId = async (eventId, data) => {
  const { eventStatus } = data;

  const updateEventStatus = await eventDao.updateEventStatusByEventId(
    eventId,
    eventStatus,
  );

  if (!updateEventStatus) {
    throw new Error("Event not found");
  }

  return updateEventStatus;
};

exports.getEventsByCategoryMinimal = async (eventCategoryId) => {
  return await eventDao.getEventsByCategoryMinimal(eventCategoryId);
};
