const genderCountDao = require('../dao/GenderCountDao');
const eventDao = require('../dao/EventDao');

exports.createGenderCount = async (data) => {
    const { maleCount, femaleCount, unknownCount, totalCount,resourceType, eventId } = data;

    const event = await eventDao.getEventById(eventId)
    if (!event) {
        throw new Error("No Events found for this Event ID");
    }

    const genderCountData = {
        maleCount, femaleCount, unknownCount, totalCount, resourceType,
        event: event._id
    }
    await eventDao.updateEventStatusByEventId(eventId,"Completed");

    return await genderCountDao.saveGenderCount(genderCountData);
};

exports.getGenderCountById = async (genderCountId) => {
    const genderCount = await genderCountDao.getGenderCountById(genderCountId);

    if (!genderCount) {
        throw new Error("No GenderCounts found for this ID");
    }

    return genderCount;
};

exports.getAllGenderCountCategories = async () => {
    const response = genderCountDao.getAllGenderCount();

    if (!response) {
        throw new Error("No genderCounts found!");
    }

    return response;
};

exports.updateGenderCountById = async (genderCountId, data) => {
    const { maleCount, femaleCount, unknownCount, totalCount, resourceType } = data;

    const updatedData = {
        maleCount, femaleCount, unknownCount, totalCount, resourceType
    }

    const genderCount = await genderCountDao.updateGenderCountById(genderCountId, updatedData);

    if (!genderCount) {
        throw new Error("GenderCount not found!");
    }

    return genderCount;
};

exports.deleteGenderCountById = async (genderCountId) => {
    const genderCount = await genderCountDao.deleteGenderCountById(genderCountId);

    if(!genderCount){
        throw new Error("No genderCount found for this ID");
    }

    return genderCount;
};

exports.getGenderCountByEventId = async(eventId) => {

    const event = await eventDao.getEventById(eventId);

    if(!event) {
        throw new Error("No event found for this Event ID");
    }

    const genderCount = await genderCountDao.getGenderCountByEventId(event._id);

    if(!genderCount){
        throw new Error("No genderCount found for this Event ID");
    }

    return genderCount;

};

exports.updateGenderCountByEventId = async (eventId, resourceType, updatedData) => {
    const event = await eventDao.getEventById(eventId);
    if (!event) {
      const error = new Error("Event Id not found");
      error.statusCode = 404;
      throw error;
    }
  
    const genderCount = await genderCountDao.getGenderCountByEventIdAndResourceType(event._id, resourceType);
    if (!genderCount) {
      const error = new Error("GenderCount not found for this event and resourceType!");
      error.statusCode = 404;
      throw error;
    }

    await eventDao.updateEventStatusByEventId(eventId,"Completed");
  
    return await genderCountDao.updateGenderCountById(genderCount.genderCountId, updatedData);
  };
  
  