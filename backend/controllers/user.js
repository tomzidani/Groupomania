// Importation
const bcrypt = require('bcrypt');
const Database = require('../database');
const database = new Database();

// Récupérer un seul utilisateur
exports.getOneUser = (req, res, next) => {
	// Déclaration de la variable userId
	const userId = req.params.id;

	// Si il manque un paramètre on renvoit un code 500
	if (!userId) return res.status(500).json({ error: 'Bad request' });

	database
		.query('SELECT id, name, surname, admin FROM users WHERE id = ? LIMIT 1', [
			userId,
		])
		.then((data) => {
			// Déclaration de la variable user
			const user = data[0];

			// Si on ne trouve pas d'utilisateur, on renvoit un code 404
			if (!user) return res.status(400).json({ error: 'User not find' });

			// Envoi d'un code 200 avec les informations de l'utilisateur
			res.status(200).json({
				userId: user.id,
				name: user.name,
				surname: user.surname,
				isAdmin: user.admin,
			});
		})
		.catch((err) => res.status(400).json(err));
};

// Supprimer un utilisateur
exports.deleteUser = (req, res, next) => {
	// Déclaration de la variable userId
	const userId = req.body.userId;

	// S'il manque l'userId, on renvoit un code 500
	if (!userId) return res.status(500).json({ error: 'Bad request' });

	database
		.query('SELECT id, password FROM users WHERE id = ? LIMIT 1', [userId])
		.then((data) => {
			// Déclaration de la variable de résultat
			result = data[0];

			// S'il n'y a pas d'utilisateur on renvoit un code 404
			if (!result) return res.status(404).json({ error: 'User not found' });

			// Vérification du mot de passe
			bcrypt
				.compare(req.body.password, result.password)
				.then((valid) => {
					// Si le mot de passe n'est pas valide on renvoit un code 401
					if (!valid) return res.status(401).json({ error: 'Password invaid' });

					// Suppression de l'utilisateur
					database
						.query('DELETE FROM users WHERE id = ?', [userId])
						.then(() => res.status(200).json({ message: 'Account deleted' }))
						.catch((err) => res.status(400).json(err));
				})
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
};
