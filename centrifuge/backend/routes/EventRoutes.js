const express = require('express');
const eventController = require('../controllers/EventController');
const upload = require('../middleware/multerConfig'); 
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();


const handleUpload = (req, res, next) => {
    upload.single('eventPoster')(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message }); 
      }
      next(); 
    });
  };
  
  

 router.use(verifyToken);

router.post("/addEvent", handleUpload, eventController.createEvent);
router.put("/updateEvent",handleUpload, eventController.updateEvent);
router.get("/getEventById", eventController.getEventById);
router.get('/getAllEvents', eventController.getAllEvents);
router.get("/getEventsByEventCategoryId", eventController.getEventsByEventCategoryId);
router.patch("/updateEventStatusByEventId",eventController.updateEventStatusByEventId)
router.delete("/deleteEventById", eventController.deleteEventById);
router.get("/getEventsByCategoryMinimal/:eventCategoryId", eventController.getEventsByCategoryMinimal );

module.exports = router;