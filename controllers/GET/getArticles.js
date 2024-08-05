const getArticlesModel = require("../../models/getArticles");

const getArticles = (req, res, next) => {
	const { topic, sort_by, order_by } = req.query;


	getArticlesModel(topic, sort_by, order_by)
		.then((response) => {
			res.status(200).send({ articles: response });
		})
		.catch((err) => next(err));
};

module.exports = getArticles;
