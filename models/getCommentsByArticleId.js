const db = require("../db/connection");
const getArticleByIdModel = require("../models/getArticleById");
const getCommentsByArticleIdModel = (id) => {
	return getArticleByIdModel(id)
		.then(() => {
			return db.query(
				"SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC",
				[id]
			);
		})
		.then((response) => {
			return response.rows;
		});
};

module.exports = getCommentsByArticleIdModel;
