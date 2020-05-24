// Importation
const mysql = require('mysql');

// Exportation de la classe
module.exports = class Database {
	constructor() {
		this.con = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.con.query(sql, args, (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.con.end((err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	}
};
