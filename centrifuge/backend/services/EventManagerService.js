const eventManagerDao = require('../dao/EventManagerDao');
const userDao = require('../dao/UserDao');

exports.createEventManager = async(data) => {
    const eventManager = await eventManagerDao.createEventManager(data);
    return eventManager;
};

exports.updateEventManager = async(eventManagerId,data) => {
    const eventManager = await eventManagerDao.getEventManagerById(eventManagerId);
    if(!eventManager){
        throw new Error("Event Manager not found!");
    }
    const updateEventManager = await eventManagerDao.updateEventManagerById(eventManagerId,data);
    return updateEventManager;
};

exports.getEventManagerById = async(eventManagerId) => {
    const eventManager = await eventManagerDao.getEventManagerById(eventManagerId);
    if(!eventManager){
        throw new Error("Event Manager not found!");
    }
    return eventManager;
};

exports.getAllEventManagers = async() => {
    const eventManagers = await eventManagerDao.getAllEventManager();
    return eventManagers;
};

exports.updateAccountStatus = async (eventManagerId, accountStatus) => {
    const eventManager = await eventManagerDao.getEventManagerById(eventManagerId);
    if (!eventManager) {
        throw new Error("Event Manager not found!");
    }

    const updatedEventManager = await eventManagerDao.updateAccountStatus(eventManagerId, accountStatus);

    const user = await userDao.getUserByEmail(eventManager.email);
    if (user) {
        user.accountStatus = accountStatus;
        await userDao.updateUserById(user.userId, user);
    }

    return updatedEventManager;
};


exports.checkEventManagerByEmail = async (email) => { 
    return await eventManagerDao.checkEventManagerByEmail(email);
 };

 