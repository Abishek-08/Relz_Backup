const express = require('express')
const router = express.Router();
const userController = require('../controllers/UserController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');

router.post("/saveUser", userController.createUser);

router.use(verifyToken);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUserById", userController.getUserById);
router.put("/updateUserById", userController.updateUserById);
router.delete("/deleteUserById", userController.deleteUserById)
router.get("/getUserByEmail", userController.getUserByEmail);

module.exports = router;