// Importation
const express = require('express');
const router = express.Router();

// Controllers
const authCtrl = require('../controllers/auth');

// Middleware
const protect = require('../middleware/protect');

// Définition des routes
router.post('/signup', authCtrl.signup);
router.post('/login', protect, authCtrl.login);

// Exportation
module.exports = router;
