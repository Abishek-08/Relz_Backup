const sockets = require('../models/Sockets');

exports.getAllSockets = async () => {
    return await sockets.find();
};

exports.findAllSocketsByOrganizerEmail = async (email) => {
    return await sockets.find({ email: email });
};

exports.deactivateAndDeleteBySocket = async (socketValue) => {
    const socketDoc = await sockets.findOne({ socket: socketValue });

    if (!socketDoc) {
        throw new Error(`Socket not found: ${socketValue}`);
    }

    socketDoc.isActive = false;
    await socketDoc.save();

    await sockets.deleteOne({ _id: socketDoc._id });

    return { socket: socketValue, deletedId: socketDoc._id };
};

exports.getAllSocketCountsByOrganizerEmail = async (email) => {
    return await sockets.countDocuments({ email });
};

exports.getActiveUserCountsByOrganizerEmail = async (email) => {
    return await sockets.countDocuments({ email, isActive: true });
};

exports.getInActiveUserCountsByOrganizerEmail = async (email) => {
    return await sockets.countDocuments({ email, isActive: false });
};