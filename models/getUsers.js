const db = require("../db/connection");

const getUsers = () => {
	return db.query("SELECT * FROM users").then((response) => {
		return response.rows;
	});
};

module.exports = getUsers;
