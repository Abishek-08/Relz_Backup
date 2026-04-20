
const genderCountService = require('../services/GenderCountService');

exports.saveGenderCount = async (req, res) => {
    try {
        const event = await genderCountService.createGenderCount(req.body);
        res.status(201).json(event);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.updateGenderCount = async (req, res) => {
    try {
        const { genderCountId } = req.query;

        const updatedData = {
            ...req.body
        };

        const genderCountData = await genderCountService.updateGenderCountById(genderCountId, updatedData);

        if (!genderCountData) {
            res.status(404).json({ message: "No GenderCount data found for this ID" })
        }

        res.status(200).json(genderCountData);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getGenderCountById = async (req, res) => {
    try {
        const { genderCountId } = req.query;
        const genderCount = await genderCountService.getGenderCountById(genderCountId);

        if (!genderCount) {
            return res.status(404).json({ message: "No gender count data found for this ID" });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.getAllGenderCounts = async (req, res) => {
    try {
        const response = await genderCountService.getAllGenderCountCategories();

        if (!response) {
            return res.status(404).json({ message: "No gender count data found!" });
        }
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};


exports.deleteGenderCountById = async (req, res) => {
    try {
        const { genderCountId } = req.query;
        const genderCount = await genderCountService.deleteGenderCountById(genderCountId);
        if (!genderCount) {
            return res.status(404).json({ message: "No gender category data found for this ID" });
        }
        res.status(200).json({ message: "Gender count data Deleted Successfully!" });
    } catch (err) {
        res.status(400).json({ messge: err.message });
    }
};

exports.getGenderCountByEventId = async(req, res) => {

    try{
        const { eventId } = req.query;
        const genderCount = await genderCountService.getGenderCountByEventId(eventId);
        res.status(200).json(genderCount);
    }catch(err){
        res.status(400).json({message: err.message});
    }

};

exports.updateGenderCountByEventId = async (req, res) => {
    try {
        const { eventId, resourceType } = req.query;

        const updatedData = {
            ...req.body
        };

        const genderCountData = await genderCountService.updateGenderCountByEventId(eventId,resourceType, updatedData);

        if (!genderCountData) {
            res.status(404).json({ message: "No GenderCount data found for this ID" })
        }

        res.status(200).json(genderCountData);
    }
    catch (err) {
        const status = err.statusCode || 400;
        return res.status(status).json({ message: err.message });
    }
};