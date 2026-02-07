const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.get('/all', auth, userController.getAllUsers);
router.get('/all', auth, userController.getAllUsers);
router.put('/:id', auth, userController.adminUpdateUser);
router.get('/all', auth, userController.getAllUsers);
router.put('/:id', auth, userController.adminUpdateUser);

module.exports = router;