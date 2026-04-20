const userDao = require('../dao/UserDao');
const bcrypt = require('bcrypt');
const Login = require('../models/Login');
const User = require('../models/User');
const { generateRandomPassword } = require('../utils/passwordUtil');
const { sendLoginCredentials } = require('../utils/emailService');

exports.createUser = async (userData) => {
    if (!userData) {
        throw new Error('User data is required');
    }
    
    if (/@relevantz\.com$/i.test(userData.email)) {
        throw new Error('Internal email registration is restricted. Please use the login page.');
    }

    const user = new User(userData);
    user.userType = "EVENTMANAGER";
    user.userStatus = "ACTIVE";

    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    try {
        const response = await userDao.createUser(user);

        const login = new Login({
            email: response.email,
            password: hashedPassword,
            user: response._id
        });

        await sendLoginCredentials(response.email, plainPassword, response.firstName);
        await login.save();

        return response;
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            throw new Error('User already exists with this email');
        }
        throw err;
    }
};


exports.getUserById = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const response = await userDao.getUserById(userId);
    return response;
}

exports.getAllUsers = async () => {
    return await userDao.getAllUsers();
}

exports.updateUserById = async (userId, updatedUserData) => {
    if (!userId || !updatedUserData) {
        throw new Error('User ID and updated user data are required');
    }

    const response = await userDao.updateUserById(userId, updatedUserData);
    return response;
}

exports.deleteUserById = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const response = await userDao.deleteUserById(userId);

    if (!response) {
        throw new Error(`User with ${userId} not found`);
    }

    if (response.deletedCount === 0) {
        throw new Error('User not found');
    }

    return response
}

exports.getUserByEmail = async (userEmail) => {
    if (!userEmail) {
        throw new Error('Email is required!');
    }

    const userData = await userDao.getUserByEmail(userEmail);

    if (!userData) {
        throw new Error(`User with email '${userEmail}' not found`);
    }

    return userData;
};