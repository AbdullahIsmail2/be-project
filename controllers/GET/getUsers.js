const getUsersModel = require("../../models/getUsers");

const getUsers = (req, res, next) => {
	getUsersModel()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => next(err));
};

module.exports = getUsers;
