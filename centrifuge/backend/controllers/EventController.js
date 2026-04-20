const eventService = require('../services/EventService');

exports.createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body, req.file);
        res.status(201).json(event);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.query;

        const updatedData = {
            ...req.body,
            ...req.file
        };

        const event = await eventService.updateEventById(eventId, updatedData);

        if (!event) {
            res.status(404).json({ message: "No Event found for this ID" })
        }

        res.status(200).json(event);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.query;
        const event = await eventService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({ message: "No event found for this ID" });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



exports.getAllEvents = async (req, res) => {
    try {
        const response = await eventService.getAllEventCategories();

        if (!response) {
            return res.status(404).json({ message: "No events found!" });
        }
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};


exports.deleteEventById = async (req, res) => {
    try {
        const { eventId } = req.query;
        const event = await eventService.deleteEventById(eventId);
        if (!event) {
            return res.status(404).json({ message: "No event Category found for this ID" });
        }
        res.status(200).json({ message: "Event Category Deleted Successfully!" });
    } catch (err) {
        res.status(400).json({ messge: err.message });
    }
};

exports.getEventsByEventCategoryId = async(req, res) => {
    try{
        const {eventCategoryId} = req.query;
        const events = await eventService.getEventsByEventCategoryId(eventCategoryId);
        res.status(200).json(events);
    }catch(err){
        res.status(400).json({message: err.message});
    }

};

exports.updateEventStatusByEventId = async(req, res) => {
    try{
       
        const {eventId} = req.query;
        const response = await eventService.updateEventStatusByEventId(eventId, req.body);
        res.status(200).json(response);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

exports.getEventsByCategoryMinimal = async (req, res) => {
  try {
    const { eventCategoryId } = req.params;
    const events = await eventService.getEventsByCategoryMinimal(eventCategoryId);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
