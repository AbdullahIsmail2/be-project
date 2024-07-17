const endpoints = require("../endpoints.json");

const getEndpointsController = (req, res, next) => {
	res.status(200).send({ endpoints: endpoints });
};

module.exports = getEndpointsController;
