const resourceDao = require('../dao/ResourceDao');
const eventDao = require('../dao/EventDao');
const fs = require('fs');
const path = require('path');

exports.createResource = async (data, files) => {
  const { eventId } = data;

  const videoFiles = files?.videos || [];
  const imageFiles = files?.images || [];
  

  const videos = Array.isArray(videoFiles)
    ? videoFiles.map(file => file.filename)
    : [];

  const images = Array.isArray(imageFiles)
    ? imageFiles.map(file => file.filename)
    : [];


  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error('Event Not Found')
  }
  const newData = {
    videos,
    images,
    event: event._id
  };

  await eventDao.updateEventStatusByEventId(eventId, "Inprogress");

  return await resourceDao.createResource(newData);
};

exports.updateResource = async (resourceId, data) => {
  const { eventId } = data;

  const existingResource = await resourceDao.findResourceById(resourceId);
  if (!existingResource) {
    throw new Error('Resource Not Found');
  }

  const event = await eventDao.getEventById(eventId);
  if (!event) {
    throw new Error('Event Not Found');
  }

  const videoFiles = data.files?.videos || [];
  const imageFiles = data.files?.images || [];
 

  const uploadedVideos = videoFiles.map(file => file.filename);
  const uploadedimages = imageFiles.map(file => file.filename);

  const removedVideoUrls = JSON.parse(data.removedVideoUrls || '[]');
  const removedImageUrls = JSON.parse(data.removedImageUrls || '[]');

  const getFileName = (url) => url.split('/').pop();

  const finalVideos = [
    ...uploadedVideos,
    ...(existingResource.videos || []).filter(url =>
      !removedVideoUrls.includes(getFileName(url))
    )
  ];

  const finalImages = [
    ...uploadedimages,
    ...(existingResource.images || []).filter(url =>
      !removedImageUrls.includes(getFileName(url))
    )
  ];

  removedVideoUrls.forEach(filename => {
    const filePath = path.join(__dirname, '../uploads/videos', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  removedImageUrls.forEach(filename => {
    const filePath = path.join(__dirname, '../uploads/images', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });



  const updatedData = {
    videos: finalVideos,
    images: finalImages,
    event: event._id
  };

  const resource = await resourceDao.updateResource(resourceId, updatedData);
  return resource;
};

exports.findResourceById = async (resourceId) => {
  const resource = await resourceDao.findResourceById(resourceId);

  if (!resource) {
    throw new Error('Resource Not Found');
  }
  return resource;
};

exports.getAllResources = async () => {
  const response = resourceDao.getAllResources();

  if (!response) {
    throw new Error('No resources found');
  }
  return response;
};

exports.deleteResourceById = async (resourceId) => {
  const resource = await resourceDao.deleteResourceById(resourceId);

  if (!resource) {
    throw new Error('Resource Not Found');
  }
  return resource;
}

exports.getResourceByEventId = async (eventId) => {

  const event = await eventDao.getEventById(eventId);

  if (!event) {
    throw new Error('Event ID not found');
  }

  const resource = await resourceDao.findResourceByEventId(event._id);
  if (!resource) {
    throw new Error('No resources found!');
  }
  return resource;

}