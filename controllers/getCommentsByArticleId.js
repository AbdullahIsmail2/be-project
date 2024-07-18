const getCommentsByArticleIdModel = require("../models/getCommentsByArticleId");

const getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	getCommentsByArticleIdModel(article_id)
		.then((response) => {
			console.log(response);
			res.status(200).send(response);
		})
		.catch((err) => next(err));
};

module.exports = getCommentsByArticleId;
