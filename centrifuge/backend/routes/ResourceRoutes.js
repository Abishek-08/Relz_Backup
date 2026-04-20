const express = require('express');
const resourceController = require('../controllers/ResourceController');
const upload = require('../middleware/multerConfig'); 
const multer = require('multer');
const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();


const handleUpload = (req, res, next) => {
    upload.fields([
        {name:'videos'},
        {name:'images'}

    ])(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message }); 
      }
      next(); 
    });
  };


router.post("/addResource", handleUpload, resourceController.createResource);
router.put("/updateResource",handleUpload, resourceController.updateResource);
router.get("/getResourceById", resourceController.findResourceById);
router.get('/getAllResources', resourceController.getAllResources);
router.delete("/deleteResourceById", resourceController.deleteResourceById);
router.get("/getResourceByEventId", resourceController.getResourceByEventId);



module.exports = router;