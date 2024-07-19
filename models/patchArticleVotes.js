const db = require("../db/connection");
const getArticleByIdModel = require("../models/getArticleById");

const patchArticleVotesModel = (article_id, inc_votes) => {
	return getArticleByIdModel(article_id)
		.then(() => {
			return db.query(
				"UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
				[inc_votes, article_id]
			);
		})
		.then(({ rows }) => rows[0]);
};

module.exports = patchArticleVotesModel;
