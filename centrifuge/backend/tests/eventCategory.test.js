const fs = require('fs');
const path = require('path');
const eventCategoryDao = require('../dao/EventCategoryDao');
const eventCategoryService = require('../services/EventCategoryService');

jest.mock('fs');
jest.mock('../dao/eventCategoryDao');

eventCategoryDao.createEventCategory = jest.fn();
eventCategoryDao.getEventCategoryById = jest.fn();
eventCategoryDao.getAllEventCategories = jest.fn();
eventCategoryDao.updateEventCategoryById = jest.fn();
eventCategoryDao.deleteEventCategoryById = jest.fn();

describe('Event Category Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  test('should create event category with valid data', async () => {
    const data = { eventCategoryName: 'Tech', eventCategoryDescription: 'Tech events' };
    const file = { filename: 'tech.png' };
    const expected = { ...data, eventCategoryLogo: 'tech.png' };

    eventCategoryDao.createEventCategory.mockResolvedValue(expected);
    const result = await eventCategoryService.createEventCategory(data, file);

    expect(eventCategoryDao.createEventCategory).toHaveBeenCalledWith(expected);
    expect(result).toEqual(expected);
  });

  test('should fail to create event category if DAO throws error', async () => {
    const data = { eventCategoryName: 'Fail', eventCategoryDescription: 'Broken' };
    const file = { filename: 'fail.png' };

    eventCategoryDao.createEventCategory.mockRejectedValue(new Error('DB error'));
    await expect(eventCategoryService.createEventCategory(data, file)).rejects.toThrow('DB error');
  });

  // GET BY ID
  test('should return event category by ID', async () => {
    const mockCategory = { id: 1, name: 'Art' };
    eventCategoryDao.getEventCategoryById.mockResolvedValue(mockCategory);

    const result = await eventCategoryService.getEventCategoryById(1);
    expect(result).toEqual(mockCategory);
  });

  test('should return null if event category not found', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue(null);
    const result = await eventCategoryService.getEventCategoryById(999);
    expect(result).toBeNull();
  });

  // GET ALL
  test('should return all event categories', async () => {
    const mockList = [{ id: 1 }, { id: 2 }];
    eventCategoryDao.getAllEventCategories.mockResolvedValue(mockList);

    const result = await eventCategoryService.getAllEventCategories();
    expect(result).toEqual(mockList);
  });

  test('should return empty array if no categories found', async () => {
    eventCategoryDao.getAllEventCategories.mockResolvedValue([]);
    const result = await eventCategoryService.getAllEventCategories();
    expect(result).toEqual([]);
  });

  // UPDATE
  test('should update event category and delete old logo', async () => {
    const id = 1;
    const data = {
      eventCategoryName: 'Updated',
      eventCategoryDescription: 'Updated desc',
      filename: 'newlogo.png'
    };
    const existing = { eventCategoryLogo: 'oldlogo.png' };

    eventCategoryDao.getEventCategoryById.mockResolvedValue(existing);
    eventCategoryDao.updateEventCategoryById.mockResolvedValue({ success: true });
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    const result = await eventCategoryService.updateEventCategoryById(id, data);
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  test('should fail to update if category does not exist', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue(null);
    const result = await eventCategoryService.updateEventCategoryById(999, {
      eventCategoryName: 'Ghost',
      eventCategoryDescription: 'Missing',
      filename: 'ghost.png'
    });
    expect(result).toBeNull();
  });

  // DELETE
  test('should delete category and logo file', async () => {
    const id = 2;
    const existing = { eventCategoryLogo: 'logo.png' };

    eventCategoryDao.getEventCategoryById.mockResolvedValue(existing);
    eventCategoryDao.deleteEventCategoryById.mockResolvedValue({ deleted: true });
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    const result = await eventCategoryService.deleteEventCategoryById(id);
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(result).toEqual({ deleted: true });
  });

  test('should delete category even if logo file is missing', async () => {
    const id = 3;
    const existing = { eventCategoryLogo: 'missing.png' };

    eventCategoryDao.getEventCategoryById.mockResolvedValue(existing);
    eventCategoryDao.deleteEventCategoryById.mockResolvedValue({ deleted: true });
    fs.existsSync.mockReturnValue(false);

    const result = await eventCategoryService.deleteEventCategoryById(id);
    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(result).toEqual({ deleted: true });
  });

  test('should fail to delete if category not found', async () => {
    eventCategoryDao.getEventCategoryById.mockResolvedValue(null);
    eventCategoryDao.deleteEventCategoryById.mockResolvedValue({ deleted: false });

    const result = await eventCategoryService.deleteEventCategoryById(999);
    expect(result).toEqual({ deleted: false });
  });
});
