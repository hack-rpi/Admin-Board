'use strict';

var LEN = 256,
	SALT_LEN = 64,
	ITERATIONS = 100,
	DIGEST = 'sha256';

var crypto = require('crypto'); 

/**
 * 
 */
exports.hash = function(password, salt, callback) {
	var len = LEN / 1;
	if (arguments.length === 3) {
		crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, function(err, derivedKey) {
			if (err) {
				return callback(err);
			}
			return callback(null, derivedKey.toString('hex'));
		});		
	}
	else {
		callback = salt;
		crypto.randomBytes(SALT_LEN / 2, function(err, salt) {
			if (err) {
				return callback(err);
			}
			salt = salt.toString('hex');
			crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, function(err, derivedKey) {
				if (err) {
					return callback(err);
				}
				callback(null, derivedKey.toString('hex'), salt);
			});
		});
	}
}


/**
 * 
 */
exports.isMatch = function(password, auth, callback) {
	exports.hash(password, auth.salt, function(err, hash) {
		callback(auth.hash === hash);
	});
}