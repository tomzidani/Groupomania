// Importation
const express = require('express');
const router = express.Router();

// Controllers
const userCtrl = require('../controllers/user');

// Middleware
const auth = require('../middleware/auth');

// Définition des routes
router.post('/:id', auth, userCtrl.deleteUser);
router.get('/:id', auth, userCtrl.getOneUser);

// Exportation
module.exports = router;