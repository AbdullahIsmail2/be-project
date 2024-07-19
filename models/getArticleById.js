const db = require("../db/connection");

const getArticleByIdModel = (id) => {
	return db
		.query("SELECT * FROM articles WHERE article_id = $1", [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `article with id ${id} does not exist`,
				});
			}
			return rows[0];
		});
};

module.exports = getArticleByIdModel;
