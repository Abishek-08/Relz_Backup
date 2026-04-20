const socketService = require('../services/SocketService');

exports.getAllSockets = async (req, res) => {
    try {
        const response = await socketService.getAllSockets();
        res.status(200).json(response);
    } catch {
        res.status(400).json({ message: err.message });
    }

};

exports.socketTermination = async (req, res) => {
    try {
        const socketList = req.body.socket;
        if (!Array.isArray(socketList)) {
            return res.status(400).json({ message: "socket must be an array" });
        }

        const result = await socketService.terminateBySocketIds(socketList);
        res.status(200).json({ success: true, terminated: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.findAllSocketsByOrganizerEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const response = await socketService.findAllSocketsByOrganizerEmail(email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllSocketCountsByOrganizerEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const response = await socketService.getAllSocketCountsByOrganizerEmail(email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getActiveUserCountsByOrganizerEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const response = await socketService.getActiveUserCountsByOrganizerEmail(email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getInActiveUserCountsByOrganizerEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const response = await socketService.getInActiveUserCountsByOrganizerEmail(email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}