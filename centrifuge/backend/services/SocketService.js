const socketDao = require('../dao/SocketDao');

exports.getAllSockets = async() => {
    return socketDao.getAllSockets();
};

exports.terminateBySocketIds = async (socketArray) => {
    const terminatedSockets = [];

    for (const socketValue of socketArray) {
        const result = await socketDao.deactivateAndDeleteBySocket(socketValue);
        terminatedSockets.push(result);
    }

    return terminatedSockets;
};

exports.findAllSocketsByOrganizerEmail = async (email) => {
    if(email === null || email === "" || email === " " ){
        throw new Error("Email should not be empty or null")
    }
    return socketDao.findAllSocketsByOrganizerEmail(email);
};

exports.getAllSocketCountsByOrganizerEmail = async(email) => {
    if(email === null || email === "" || email === " " ){
        throw new Error("Email should not be empty or null")
    }
    return socketDao.getAllSocketCountsByOrganizerEmail(email);
};

exports.getActiveUserCountsByOrganizerEmail = async(email) => {
    if(email === null || email === "" || email === " " ){
        throw new Error("Email should not be empty or null")
    }
    return socketDao.getActiveUserCountsByOrganizerEmail(email);
};

exports.getInActiveUserCountsByOrganizerEmail = async(email) => {
    if(email === null || email === "" || email === " " ){
        throw new Error("Email should not be empty or null")
    }
    return socketDao.getInActiveUserCountsByOrganizerEmail(email);
};