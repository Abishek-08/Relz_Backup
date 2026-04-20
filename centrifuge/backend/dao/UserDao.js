const user = require('../models/User')

exports.createUser = async (userData) => {
    return await user.create(userData);
}

exports.getUserById = async (userId) => {
    return await user.findOne({userId});
}

exports.getAllUsers = async () => {
    return await user.find({ userType: "USER" });
}

exports.updateUserById = async (userId, updatedUserData) => {
    return await user.findOneAndUpdate({ userId }, updatedUserData, { new: true });
}

exports.deleteUserById = async (userId) => {
    return await user.findOneAndDelete({ userId });
}

exports.getUserByEmail = async (userEmail) => {
    return await user.findOne({ email: userEmail });
}