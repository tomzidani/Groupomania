const mysql = require('mysql');

module.exports = class Database {
	constructor(){
		this.con = mysql.createConnection({host: 'localhost', user: 'root', password: 'password', database: 'groupomania'});
	}
	query(sql, args){
		return new Promise((resolve, reject) => {
			this.con.query(sql, args, (err, rows) => {
				if(err) return reject(err);
				resolve(rows);
			});
		});
	}
	close(){
		return new Promise((resolve, reject) => {
			this.con.end(err => {
				if(err) return reject(err);
				resolve();
			});
		});
	}
}