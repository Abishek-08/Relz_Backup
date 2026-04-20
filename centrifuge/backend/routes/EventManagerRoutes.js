const express = require('express');
const eventManagerController = require('../controllers/EventManagerController');
const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

router.post("/createEventManager", eventManagerController.createEventManager);
router.get("/getAllEventManager", eventManagerController.getAllEventManagers);
router.get("/getEventManagerById",eventManagerController.getEventManagerById);
router.put("/updateEventManager",eventManagerController.updateEventManager);
router.put("/updateAccountStatus",eventManagerController.updateAccountStatus);
router.get("/checkEventManagerByEmail", eventManagerController.checkEventManagerByEmail);


module.exports = router;