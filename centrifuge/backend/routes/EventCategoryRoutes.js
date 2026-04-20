const express = require('express');
const eventCategoryController = require('../controllers/EventCategoryController');
const upload = require('../middleware/multerConfig'); 
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();


const handleUpload = (req, res, next) => {
    upload.single('eventCategoryLogo')(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message }); 
      }
      next(); 
    });
  };
  
  

 router.use(verifyToken);

router.post("/addEventCategory", handleUpload, eventCategoryController.createEventCategory);
router.put("/updateEventCategory",handleUpload, eventCategoryController.updateEventCategory);
router.get("/getEventCategoryById", eventCategoryController.getEventCategoryById);
router.get('/getAllEventCategories', eventCategoryController.getAllEventCategories);
router.delete("/deleteEventCategoryById", eventCategoryController.deleteEventCategoryById);
router.get( "/getAllEventCategoriesMinimal", eventCategoryController.getAllEventCategoriesMinimal );
module.exports = router;