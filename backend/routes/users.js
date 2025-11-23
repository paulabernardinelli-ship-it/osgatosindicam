const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rotas protegidas
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateUser);
router.delete('/profile', auth, userController.deleteUser);
router.get('/all', auth, userController.getAllUsers);

module.exports = router;