const eventCategoryService = require('../services/EventCategoryService');

exports.createEventCategory = async (req, res) => {
    try {
        const eventCategory = await eventCategoryService.createEventCategory(req.body, req.file);
        res.status(201).json(eventCategory);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.updateEventCategory = async (req, res) => {
    try {
        const { eventCategoryId } = req.query;

        const updatedData = {
            ...req.body,
            ...req.file
        };

        const eventCategory = await eventCategoryService.updateEventCategoryById(eventCategoryId, updatedData);

        if (!eventCategory) {
            res.status(404).json({ message: "No Event category found for this ID" })
        }

        res.status(200).json(eventCategory);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getEventCategoryById = async (req, res) => {
    try {
        const { eventCategoryId } = req.query;
        const eventCategory = await eventCategoryService.getEventCategoryById(eventCategoryId);

        if (!eventCategory) {
            return res.status(404).json({ message: "No event Category found for this ID" });
        }

        res.status(200).json(eventCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.getAllEventCategories = async (req, res) => {
    try {
        const response = await eventCategoryService.getAllEventCategories();
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};


exports.deleteEventCategoryById = async (req, res) => {
    try {
        const { eventCategoryId } = req.query;
        const eventCategory = await eventCategoryService.deleteEventCategoryById(eventCategoryId);
        if (!eventCategory) {
            return res.status(404).json({ message: "No event Category found for this ID" });
        }
        res.status(200).json({ message: "Event Category Deleted Successfully!" });
    } catch (err) {
        res.status(400).json({ messge: err.message });
    }
};

exports.getAllEventCategoriesMinimal = async (req, res) => {
  try {
    const categories = await eventCategoryService.getAllEventCategoriesMinimal();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
