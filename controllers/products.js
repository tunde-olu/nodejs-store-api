const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
	const products = await Product.find({ price: { $gt: 40, $lt: 100 } })
		.select('name price')
		.sort('name')
		.select('name price');
	// throw customError(400, 'not found');
	res.status(200).json({ nbHits: products.length, products });
};

const getAllProducts = async (req, res) => {
	const { featured, company, name, sort, fields, numericFilters } = req.query;
	const queryObject = {};
	if (featured) {
		queryObject.featured = featured === 'true' ? true : false;
	}
	if (company) {
		queryObject.company = company;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: 'i' };
	}
	if (numericFilters) {
		const operatorMap = {
			'>': '$gt',
			'>=': '$gte',
			'=': '$eq',
			'<': '$lt',
			'<=': '$lte',
		};
		const regEx = /\b(<|>|>=|=|<|<=)\b/g;
		let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);

		const options = ['price', 'rating'];
		filters = filters.split(',').forEach((item) => {
			const [field, operator, value] = item.split('-');

			if (options.includes(field)) {
				queryObject[field] = { [operator]: value };
			}
		});
	}
	// const products = await Product.find(req.query).setOptions({ strictQuery: true });
	let result = Product.find(queryObject);

	if (sort) {
		const sortedList = sort.split(',').join(' ');
		result.sort(sortedList);
	} else {
		result.sort('createdAt');
	}

	if (fields) {
		const fieldsList = fields.split(',').join(' ');
		result.select(fieldsList);
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result.skip(skip).limit(limit);

	const products = await result;
	res.status(200).json({
		nbHits: products.length,
		page: page,
		totalPages: Math.ceil(23 / limit),
		products,
	});
};

module.exports = { getAllProducts, getAllProductsStatic };
