const getTopicsModel = require("../../models/getTopics");

const getTopicsController = (req, res, next) => {
	return getTopicsModel()
		.then((data) => {
			console.log(data);
			res.status(200).send({ topics: data });
		})
		.catch((err) => next(err));
};

module.exports = getTopicsController;
