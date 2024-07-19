const getArticleByIdModel = require("../../models/getArticleById");

const getArticleByIdController = (req, res, next) => {
	const { article_id } = req.params;
	getArticleByIdModel(article_id, next)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
};

module.exports = getArticleByIdController;
