const db = require("../db/connection");
const format = require("pg-format");
const getArticleByIdModel = require("../models/getArticleById");

const postCommentModel = (comment, article_id) => {
	const { author, body } = comment;

	return getArticleByIdModel(article_id)
		.then(() => {
			const query = format(
				`INSERT INTO comments (body, article_id, author, votes, created_at) VALUES (%L, %L, %L, 0, NOW()) RETURNING *;`,
				body,
				article_id,
				author
			);
			return db.query(query);
		})
		.then((response) => {
			return response.rows[0];
		});
};

module.exports = postCommentModel;
