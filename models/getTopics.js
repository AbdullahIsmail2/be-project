const db = require("../db/connection");

const getTopicsModel = () => {
	return db
		.query("SELECT * FROM topics")
		.then((response) => response.rows)
};

module.exports = getTopicsModel;