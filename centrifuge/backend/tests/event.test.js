const fs = require('fs');
const path = require('path');
const eventDao = require('../dao/EventDao');
const eventCategoryDao = require('../dao/EventCategoryDao');
const eventService = require('../services/EventService');

jest.mock('fs');
jest.mock('../dao/EventDao');
jest.mock('../dao/EventCategoryDao');

describe('EventService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // createEvent
  test('createEvent (positive)', async () => {
    const data = {
      eventName: 'Concert',
      eventDescription: 'Live music',
      eventDate: new Date(),
      eventOrganizer: 'ABC',
      eventCategoryId: 'cat1'
    };
    const file = { filename: 'concert.jpg' };

    eventCategoryDao.getEventCategoryById.mockResolvedValue({ _id: 'cat1' });
    eventDao.createEvent.mockResolvedValue({ eventName: 'Concert' });

    const result = await eventService.createEvent(data, file);

    expect(eventCategoryDao.getEventCategoryById).toHaveBeenCalledWith('cat1');
    expect(eventDao.createEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventName: 'Concert',
      eventPoster: 'concert.jpg'
    }));
    expect(result).toEqual({ eventName: 'Concert' });
  });

  test('createEvent (negative) - category not found', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue(null);

    await expect(eventService.createEvent({ eventCategoryId: 'invalid' }, { filename: 'x.jpg' }))
      .rejects.toThrow('Event Category not found');
  });

  // getEventById
  test('getEventById (positive)', async () => {
    eventDao.getEventById.mockResolvedValue({ eventId: 1 });

    const result = await eventService.getEventById(1);

    expect(eventDao.getEventById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ eventId: 1 });
  });

  test('getEventById (negative) - not found', async () => {
    eventDao.getEventById.mockResolvedValue(null);

    await expect(eventService.getEventById(999)).rejects.toThrow('No Events found for this ID');
  });

  // getAllEventCategories
  test('getAllEventCategories (positive)', async () => {
    eventDao.getAllEvent.mockResolvedValue([{ id: 1 }]);

    const result = await eventService.getAllEventCategories();

    expect(eventDao.getAllEvent).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  test('getAllEventCategories (negative) - no events', async () => {
    eventDao.getAllEvent.mockResolvedValue(null);

    await expect(eventService.getAllEventCategories()).rejects.toThrow('No events found!');
  });

  // updateEventById
  test('updateEventById (positive)', async () => {
    const eventId = 1;
    const data = {
      eventName: 'Updated',
      eventDate: new Date(),
      eventDescription: 'Updated desc',
      eventOrganizer: 'XYZ',
      filename: 'newposter.jpg'
    };
    const existingEvent = { eventPoster: 'oldposter.jpg' };

    eventDao.getEventById.mockResolvedValue(existingEvent);
    eventDao.updateEventById.mockResolvedValue({ eventName: 'Updated' });
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    const result = await eventService.updateEventById(eventId, data);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(eventDao.updateEventById).toHaveBeenCalledWith(eventId, expect.objectContaining({
      eventPoster: 'newposter.jpg'
    }));
    expect(result).toEqual({ eventName: 'Updated' });
  });

  test('updateEventById (negative) - event not found', async () => {
    eventDao.getEventById.mockResolvedValue(null);

    await expect(eventService.updateEventById(999, {})).rejects.toThrow('Event not found!');
  });

  // deleteEventById
  test('deleteEventById (positive)', async () => {
    const existingEvent = { eventPoster: 'poster.jpg' };

    eventDao.getEventById.mockResolvedValue(existingEvent);
    eventDao.deleteEventById.mockResolvedValue({ deleted: true });
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    const result = await eventService.deleteEventById(1);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(eventDao.deleteEventById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });

  test('deleteEventById (negative) - not found', async () => {
    eventDao.getEventById.mockResolvedValue(null);

    await expect(eventService.deleteEventById(999)).rejects.toThrow('No event found for this ID');
  });

  //  getEventsByEventCategoryId
  test('getEventsByEventCategoryId (positive)', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue({ _id: 'cat1' });
    eventDao.getEventsByEventCategoryId.mockResolvedValue([{ eventId: 1 }]);

    const result = await eventService.getEventsByEventCategoryId('cat1');

    expect(result).toEqual([{ eventId: 1 }]);
  });

  test('getEventsByEventCategoryId (negative) - category not found', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue(null);

    await expect(eventService.getEventsByEventCategoryId('invalid')).rejects.toThrow('Event Category not found');
  });

  test('getEventsByEventCategoryId (negative) - no events', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue({ _id: 'cat1' });
    eventDao.getEventsByEventCategoryId.mockResolvedValue(null);

    await expect(eventService.getEventsByEventCategoryId('cat1')).rejects.toThrow('No events found for this category');
  });

  //  updateEventStatusByEventId
  test('updateEventStatusByEventId (positive)', async () => {
    eventDao.updateEventStatusByEventId.mockResolvedValue({ eventStatus: 'Published' });

    const result = await eventService.updateEventStatusByEventId(1, { eventStatus: 'Published' });

    expect(result).toEqual({ eventStatus: 'Published' });
  });

  test('updateEventStatusByEventId (negative) - not found', async () => {
    eventDao.updateEventStatusByEventId.mockResolvedValue(null);

    await expect(eventService.updateEventStatusByEventId(999, { eventStatus: 'Published' }))
      .rejects.toThrow('Event not found');
  });
});
