const db = require("../db/connection");

const getCommentsByArticleIdModel = (id) => {
	return db
		.query(
			"SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC",
			[id]
		)
		.then((response) => {
			if (response.rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "this article has no comments",
				});
			}
			return response.rows;
		});
};

module.exports = getCommentsByArticleIdModel;
