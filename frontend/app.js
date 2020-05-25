// Importation des packages
const express = require('express');

// Définition de l'app
const app = express();

app.engine('html', require('ejs').renderFile);

app.use(express.static('assets'));
app.use(express.static('scripts'));
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
