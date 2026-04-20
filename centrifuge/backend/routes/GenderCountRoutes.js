const express = require('express');
const genderCountController = require('../controllers/GenderCountController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

router.post("/saveGenderCount", genderCountController.saveGenderCount);
router.put("/updateGenderCount", genderCountController.updateGenderCount);
router.get("/getGenderCountById", genderCountController.getGenderCountById);
router.get('/getAllGenderCounts', genderCountController.getAllGenderCounts);
router.delete("/deleteGenderCountById", genderCountController.deleteGenderCountById);
router.get("/getGenderCountByEventId",genderCountController.getGenderCountByEventId);
router.put("/updateGenderCountByEventId",genderCountController.updateGenderCountByEventId);


module.exports = router;