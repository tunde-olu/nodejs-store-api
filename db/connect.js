const mongoose = require('mongoose');

const connectDB = (uri) => {
	return mongoose.connect(uri, { dbName: '04-STORE-API' });
};

module.exports = connectDB;
