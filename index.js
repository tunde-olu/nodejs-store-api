require('dotenv').config();
require('express-async-errors');

const express = require('express');
const notFound = require('./middleware/not-found');
const app = express();
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());

// route
app.get('/', (req, res) => {
	res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter);

// product route
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`server is listening on port ${port}...`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
