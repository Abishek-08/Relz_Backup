const resourceService = require('../services/ResourceService');

exports.createResource = async (req, res) => {
    try {
        const resource = await resourceService.createResource(req.body, req.files);
        res.status(201).json(resource);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateResource = async (req, res) => {
    try {
        const { resourceId } = req.query;

        const updatedResource = {
            ...req.body,
            files: req.files
        }

        const resource = await resourceService.updateResource(resourceId, updatedResource);
        res.status(200).json(resource);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};

exports.findResourceById = async (req, res) => {
    try {
        const { resourceId } = req.query;
        const resource = await resourceService.findResourceById(resourceId);
        res.status(200).json(resource);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};

exports.getAllResources = async (req, res) => {
    try {
        const response = await resourceService.getAllResources();
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.deleteResourceById = async (req, res) => {
    try {
        const { resourceId } = req.query;
        await resourceService.deleteResourceById(resourceId);
        res.status(200).json({ message: 'Resource Deleted Successfully!' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};

exports.getResourceByEventId = async (req, res) => {
    try {
        const { eventId } = req.query;

        const resource = await resourceService.getResourceByEventId(eventId);
        res.status(200).json(resource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

};