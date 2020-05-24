// Importation
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Database = require('../lib/database');
const database = new Database();

// Déclaration des variables
const regex = /^[a-zA-Z _.éèà']+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
	// Déclaration de la variable user
	const user = req.body;

	// Si les données sont incomplètes on renvoit un code d'erreur 500
	if (!user.surname || !user.name || !user.email || !user.password)
		return res.status(500).json({ error: 'Bad request' });

	if (!regex.test(user.surname) || !regex.test(user.name))
		return res.status(500).json({ error: 'Invalid characters' });

	if (!emailRegex.test(user.email))
		return res.status(500).json({ error: 'Invalid email' });

	if (!passwordRegex.test(user.password))
		return res.status(500).json({
			error:
				'Password must contain 8 characters with 1 uppercase 1 lowercase and 1 number',
		});

	database
		.query('SELECT email FROM users WHERE email = ?', [req.body.email])
		.then((data) => {
			// Déclaration du résultat
			const result = data[0];

			// Si l'adresse e-mail est déjà utilisée on renvoit un code d'erreur
			if (result)
				return res.status(409).json({ error: 'Email already exists' });

			// Hash du mot de passe
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					// Déclaration de la variable des données
					const data = {
						name: user.name,
						surname: user.surname,
						email: user.email,
						password: hash,
						gender: user.gender,
					};

					// Insertion des informations dans la base de données
					database
						.query('INSERT INTO users SET ?', data)
						.then((packet) => {
							// Création du token et de l'userId
							const userId = packet.insertId;
							const token = jwt.sign(
								{
									userId: userId,
									isAdmin: 0,
								},
								process.env.TOKEN_SECRET,
								{
									expiresIn: '4h',
								}
							);
							res
								.status(201)
								.json({ userId: userId, token: token, isAdmin: 0 });
						})
						.catch((err) => res.status(400).json(err));
				})
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
	// Déclaration de la variable user
	const user = req.body;

	// S'il manque une donnée, on renvoit un code 500
	if (!user.email || !user.password)
		return res.status(500).json({ error: 'Bad request' });

	database
		.query('SELECT id, email, password, admin FROM users WHERE email = ?', [
			user.email,
		])
		.then((data) => {
			// Déclaration de la variable de résultat
			const result = data[0];

			// Si l'on ne trouve pas l'utilisateur, on renvoit un code 404
			if (!result) return res.status(404).json({ error: 'User not find' });

			bcrypt
				.compare(user.password, result.password)
				.then((valid) => {
					// Si le mot de passe n'est pas valide on renvoit un code 401
					if (!valid)
						return res.status(401).json({ error: 'Password incorrect' });

					// Déclaration des variable userId et du token
					const userId = result.id;
					const isAdmin = result.admin;
					const token = jwt.sign(
						{
							userId: userId,
							isAdmin: result.admin,
						},
						process.env.TOKEN_SECRET,
						{
							expiresIn: '4h',
						}
					);
					res
						.status(200)
						.json({ userId: userId, token: token, isAdmin: isAdmin });
				})
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
};
