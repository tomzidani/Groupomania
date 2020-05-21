// Importation
const express = require('express');
const router = express.Router();

// Controllers
const authCtrl = require('../controllers/auth');

// Définition des routes
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

// Exportation
module.exports = router;
