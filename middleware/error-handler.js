const { customAPIerror } = require('../errors/custom-error');

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof customAPIerror) {
		return res.status(err.statusCode).status(404).send({ msg: err.message });
	}

	return res.status(500).json({ msg: 'Something went wrong, please try again' });
};

module.exports = errorHandlerMiddleware;
