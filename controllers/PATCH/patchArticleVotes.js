const patchArticleVotesModel = require("../../models/patchArticleVotes");

const patchArticleVotes = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	return patchArticleVotesModel(article_id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => next(err));
};

module.exports = patchArticleVotes;
