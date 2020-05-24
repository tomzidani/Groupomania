// Importation des packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

// Définition de l'app
const app = express();

// Ajout des headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);
	next();
});

// Utilisation du body-parser sur le document
app.use(bodyParser.json());

// Utilisation de l'administration de la route d'image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Exportation de l'app
module.exports = app;
