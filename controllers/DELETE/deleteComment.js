const deleteCommentModel = require("../../models/deleteComment");

const deleteComment = (req, res, next) => {
	const { comment_id } = req.params;

	deleteCommentModel(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => next(err));
};

module.exports = deleteComment;
