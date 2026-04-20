const logger = require('../logger');
const eventManagerService = require('../services/EventManagerService');

exports.createEventManager = async (req, res) => {
    try{
        const eventManager = await eventManagerService.createEventManager(req.body);
        res.status(200).json(eventManager);
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
};

exports.updateEventManager = async(req, res) => {
    try{
        const {eventManagerId} = req.query; 
        const eventManager = await eventManagerService.updateEventManager(eventManagerId, req.body);
        res.status(200).json(eventManager);
    }catch(err){
        res.status(400).json({message:err.message})
    }

};

exports.getEventManagerById = async(req, res) => {
    try{
        const {eventManagerId} = req.query;
        const eventManager = await eventManagerService.getEventManagerById(eventManagerId);
        res.status(200).json(eventManager);
    }catch(err){
        res.status(400).json({message:err.message})
    }
};

exports.getAllEventManagers = async(req, res) => {
    try{
        const eventManager = await eventManagerService.getAllEventManagers();
        res.status(200).json(eventManager);
    }catch(err){
        res.status(400).json({message:err.message})
    }
};

exports.updateAccountStatus = async(req,res) => {
    try{
        const {eventManagerId, accountStatus} = req.query;
        const eventManager = await eventManagerService.updateAccountStatus(eventManagerId, accountStatus);
        res.status(200).json(eventManager);
    }catch(err){
        res.status(400).json({message:err.message})
    }
};

exports.checkEventManagerByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const exists = await eventManagerService.checkEventManagerByEmail(email);
    res.status(200).json({ exists });
  } catch (error) {
    logger.error("Error checking Event Manager by email:", error);
    res.status(500).json({ message: error.message });
  }
};


