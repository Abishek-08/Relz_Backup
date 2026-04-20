const express = require('express');
const socketController = require('../controllers/SocketController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

router.get("/getAllSockets", socketController.getAllSockets);
router.get("/findAllSocketsByOrganizerEmail", socketController.findAllSocketsByOrganizerEmail);
router.get("/getAllSocketCountsByOrganizerEmail", socketController.getAllSocketCountsByOrganizerEmail);
router.get("/getActiveUserCountsByOrganizerEmail", socketController.getActiveUserCountsByOrganizerEmail);
router.get("/getInActiveUserCountsByOrganizerEmail", socketController.getInActiveUserCountsByOrganizerEmail);
router.post("/socketTermination",socketController.socketTermination);
module.exports = router;