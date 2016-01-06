var MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectId,
	_ = require('underscore'),
	password = require('../helpers/password'),
	config = require('../config');

/**
 * 
 */
exports.createUser = function(email, pwd, profile, callback) {
	var doc = {};
	doc.createdAt = new Date();
	doc.token = {};
	doc.email = {
		address: email,
		verified: false
	};
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
exports.verifyEmail = function(id, token, callback) {
	exports.findUserById(id, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		var now = new Date();
		if (doc.token.token === token && now <= doc.token.expires) {
			exports.updateOne({ _id: new ObjectId(id) }, { '$set': {'email.verified': true, 'token': {} } });
			return callback(null, true);
		}
		else if (now > doc.token.expires) {
			return callback(null, false);
		}
		var e = new Error('Invalid token.');
		e.showUser = true;
		return callback(e, null);
	});
}

/**
 * 
 */
exports.findUserById = function(id, callback) {
  if (id.length !== 24) {
    return callback(new Error('invalid user id'), null);
  }
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

/**
 * 
 */
exports.updateOne = function(selector, modifier, callback) {
	callback = callback || _.noop;
	MongoClient.connect(config.mongo_url, function(err, db) {
		if (err) {
			return callback(err, null);
		}
		if (selector._id && typeof(selector._id) === 'string') {
			selector._id = ObjectId(selector._id);
		}
		db.collection('users').updateOne(selector, modifier, function(err, doc) {
			db.close();
			if (err) {
				return callback(err, null);
			}
			return callback(null, doc);
		});
	});
}
