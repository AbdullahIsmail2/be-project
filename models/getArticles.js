const db = require("../db/connection");

const getArticles = () => {
	return db.query(`SELECT * FROM articles`).then((response) => {
		// remove body property
		const articles = response.rows;
		const updatedArticles = articles.map((article) => {
			const { body, ...rest } = article;
			return rest;
		});
		return updatedArticles;
	});
};

module.exports = getArticles;
