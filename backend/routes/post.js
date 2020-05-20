// Importation
const express = require('express');
const router = express.Router();

// Controllers
const postCtrl = require('../controllers/post');

// Middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Définition des routes
router.post('/', multer.single("picture"), postCtrl.addPost);
router.post('/delete/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, postCtrl.editPost);
router.get('/', auth, postCtrl.getLastsPosts);

// Exportation
module.exports = router;