const login = require('../models/Login');

exports.findEmail = async (email) => {
    return await login.findOne({ email });
};

exports.updateLoginByEmail = async (email, updates) => {
    return await login.findOneAndUpdate({ email }, { $set: updates }, { new: true });
};

exports.updateLogin = async (loginDoc) => {
    return await loginDoc.save(); 
};

exports.updateUser = async (userDoc) => {
    return await userDoc.save(); 
};