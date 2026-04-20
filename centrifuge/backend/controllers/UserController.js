const userService = require('../services/UserService');

exports.createUser = async (req, res) => {
    try {
        const response = await userService.createUser(req.body);
        res.status(201).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.query;

        const response = await userService.getUserById({ userId });
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const response = await userService.getAllUsers();
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.updateUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        const response = await userService.updateUserById(userId, req.body);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        const response = await userService.deleteUserById(userId);
        res.status(200).json({
            message: "User deleted Successfully",
            response
        });
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { userEmail } = req.query;

        const user = await userService.getUserByEmail(userEmail);

        res.status(200).json({
            message: 'User found',
            user
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};