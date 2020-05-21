// Importation des packages
const jwt = require('jsonwebtoken');

// Exportation de la fonction d'authentification
module.exports = (req, res, next) => {
	// Récupération de l'autorisation
	const authHeader = req.headers.authorization;

	// Si l'utilisateur possède une autorisation,
	// on déclare le token et on le vérifie, s'il n'y a pas
	// d'erreur, on le next, sinon on renvoie un statut 403
	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
			if (err) {
				return res.status(403);
			}

			next();
		});
	}

	// Sinon, on renvoie le statut 401 Unauthorized
	else {
		res.status(401);
	}
};
