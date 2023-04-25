class customAPIerror extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;
	}
}

const customError = (statusCode, message) => {
	return new customAPIerror(statusCode, message);
};

module.exports = { customAPIerror, customError };
