const getArticlesModel = require("../../models/getArticles");

const getArticles = (req, res, next) => {
	getArticlesModel()
		.then((response) => {
			res.status(200).send({ articles: response });
		})
		.catch((err) => next(err));
};

module.exports = getArticles;
