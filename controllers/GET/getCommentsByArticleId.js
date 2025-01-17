const getCommentsByArticleIdModel = require("../../models/getCommentsByArticleId");

const getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	getCommentsByArticleIdModel(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => next(err));
};

module.exports = getCommentsByArticleId;
