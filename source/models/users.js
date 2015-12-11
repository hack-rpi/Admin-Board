var MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectId,
	password = require('../helpers/password'),
	config = require('../config');

/**
 * 
 */
exports.createUser = function(email, pwd, profile, callback) {
	var doc = {};
	doc.createdAt = new Date();
	doc.email = {
		address: email,
		verified: false
	}
	exports.findUserByEmail(email, function(err, usr) {
		if (err) {
			return callback(err, null);
		}
		else if (usr) {
			var e = new Error('Email already in use.');
			e.showUser = true;
			return callback(e, null);
		}
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
exports.findUserByEmail = function(email, callback) {
	MongoClient.connect(config.mongo_url, function(err, db) {
		if (err) {
			return callback(err, null);
		}
		db.collection('users').findOne({ 'email.address': email }, function(err, doc) {
			db.close();
			if (err) {
				return callback(err, null);
			}
			return callback(null, doc);
		});
	});
}