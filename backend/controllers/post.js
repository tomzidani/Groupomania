// Importation
const Database = require('../database');
const database = new Database();

// Ajouter un post
exports.addPost = (req, res, next) => {
	console.log(req.file);

	// Déclaration des variables userId et message et picture
	const userId = req.body.userId;
	const message = req.body.message;
	var picture = null;

	// Si l'utilisateur a envoyé une image
	if (req.file) {
		picture = `${req.protocol}://${req.get('host')}/uploads/${
			req.file.filename
		}`;
	}

	// S'il manque une donnée on retourne un code 500
	if (!userId || !message)
		return res.status(500).json({ error: 'Bad request' });

	database
		.query('SELECT id, name, surname FROM users WHERE id = ? LIMIT 1', [userId])
		.then((data) => {
			// Déclaration de la variable result
			const result = data[0];

			// Si l'utilisateur est introuvable on renvoit un code 404
			if (!result) return res.status(404).json({ error: 'User not found' });

			// Déclaration des données à envoyer
			const post = {
				userId: userId,
				name: result.name,
				surname: result.surname,
				message: message,
				picture: picture,
			};

			console.log(post);
			// Insertion du message dans la base de données
			database
				.query('INSERT INTO posts SET ?', post)
				.then(() => res.status(201).json({ message: 'Post created' }))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => {
			res.status(400).json(err);
			console.log(err);
		});
};

// Récupérer les derniers posts
exports.getLastsPosts = (req, res, next) => {
	database
		.query('SELECT * FROM posts ORDER BY -id LIMIT 30')
		.then((data) => res.status(200).json(data))
		.catch((err) => res.status(400).json(err));
};

// Modifier un post
exports.editPost = (req, res, next) => {
	// Déclaration des variables id et userId
	const id = req.params.id;
	const userId = req.body.userId;

	database
		.query('SELECT id, admin FROM users WHERE id = ?', [userId])
		.then((data) => {
			// Déclaration de la variable result
			const result = data[0];

			// Si on ne trouve pas l'utilisateur on renvoit un code 404
			if (!result) return res.status(404).json({ error: 'User not found' });

			// Si l'utilisateur n'est ni admin ni la personne qui a posté le message on renvoit un code 401
			if (userId !== req.body.userPostId && data.admin !== 1)
				return res.status(401).json({ error: 'Unauthorized' });

			// Mise à jour des informations du post dans la base de données
			database
				.query('UPDATE posts SET message = ? WHERE id = ?', [
					req.body.message,
					id,
				])
				.then(() => res.status(200).json({ message: 'Post edited' }))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
};

exports.deletePost = (req, res, next) => {
	// Déclaration des variables id et userId
	const id = req.params.id;
	const userId = req.body.userId;

	database
		.query('SELECT id, admin FROM users WHERE id = ?', [userId])
		.then((data) => {
			// Déclaration de la variable result
			const result = data[0];

			// Si on ne trouve pas l'utilisateur on renvoit un code 404
			if (!result) return res.status(404).json({ error: 'User not found' });

			// Si l'utilisateur n'est ni admin ni la personne qui a posté le message on renvoit un code 401
			if (userId !== req.body.userPostId && data.admin !== 1)
				return res.status(401).json({ error: 'Unauthorized' });

			// Suppression du message
			database
				.query('DELETE FROM posts WHERE id = ?', [id])
				.then(() => res.status(200).json({ message: 'Post deleted' }))
				.catch((err) => res.status(400).json(err));
		})
		.catch((err) => res.status(400).json(err));
};
