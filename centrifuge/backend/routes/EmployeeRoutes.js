const express = require('express')
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const {verifyToken} = require('../middleware/authMiddleware');



router.use(verifyToken);

router.get("/searchEmployees", employeeController.getEmpByName);

module.exports = router;