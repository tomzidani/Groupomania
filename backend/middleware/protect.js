const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
	windowMs: 900000, // 15 minutes
	max: 5, // 5 requêtes
	message: 'Too many requests',
});
