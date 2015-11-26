var MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectId,
	password = require('../helpers/password'),
	config = require('../config');

/**
 * 
 */
exports.createUser = function(username, pwd, profile, callback) {
	var doc = {};
	doc.createdAt = new Date();
	doc.username = username;	
	password.hash(pwd, function(err, hash, salt) {
		if (err) {
			return callback(err, null);
		}
		doc.auth = {
			salt: salt,
			hash: hash
		}
		doc.profile = profile;
		MongoClient.connect(config.mongo_url, function(err, db) {
			if (err) {
				return callback(err, null);
			}
			db.collection('users').insertOne(doc, function(err, res) {
				db.close();
				if (err) {
					return callback(err, null);
				}
				return callback(null, doc);
			});
		});
	});
}


/**
 * 
 */
exports.findUserById = function(id, callback) {
	MongoClient.connect(config.mongo_url, function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection('users').findOne({ _id: new ObjectId(id) }, {}, function(err, doc) {
			db.close();
			if (err) {
				return callback(err, null);
			}
			return callback(null, doc);
		});
	});
}

/**
 * 
 */
exports.findUserByUsername = function(username, callback) {
	MongoClient.connect(config.mongo_url, function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection('users').findOne({ username: username }, function(err, doc) {
			db.close();
			if (err) {
				return callback(err, null);
			}
			return callback(null, doc);
		});
	});
}