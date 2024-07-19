const postCommentModel = require("../../models/postComment");

const postComment = (req, res, next) => {
	const comment = req.body;
	const { article_id } = req.params;

	postCommentModel(comment, article_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => next(err));
};

module.exports = postComment;
