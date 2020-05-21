// Importation des packages
const express = require('express');

// Définition de l'app
const app = express();

app.engine('html', require('ejs').renderFile);

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

app.use(express.static('assets'));
app.use(express.static('uploads'));

app.get('/', function (req, res) {
	res.render('./index.html');
});

app.get('/register', function (req, res) {
	res.render('./register.html');
});

app.get('/home', function (req, res) {
	res.render('./home.html');
});
// Exportation de l'app
module.exports = app;
