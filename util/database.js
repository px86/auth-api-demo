const MongoClient = require('mongodb').MongoClient;

let _db;

module.exports.mongoConnect = (callback) => {
	MongoClient.connect(process.env.DB_URI, {
		maxPoolSize: 50,
		wtimeoutMS: 2500
	}).then((client) => {
		_db = client.db(process.env.DB_NAME);
		callback();
	}).catch(err => {
		console.error(err);
		throw new Error('database connection failed!');
	});
};

module.exports.getDB = () => {
	if (_db) return _db;
	else throw new Error('database connection failed!');
};
