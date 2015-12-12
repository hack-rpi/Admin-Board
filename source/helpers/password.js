'use strict';

var LEN = 256,
	SALT_LEN = 64,
	ITERATIONS = 100,
	DIGEST = 'sha256';

var crypto = require('crypto'); 

/**
 * Generate a hash of a password with the given salt
 * @param {string} password
 * @param {salt} salt to use to hash the password
 * @param {callback} function to call with the resulting hash
 * 	on completion
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
 * Determines if a password matches the hash
 * @param {string} password
 * @param {authorizationObject} authorization objects that contains
 * 	the salt and the hash generated with that salt
 * @param {callback} callback function to call with the result
 * 	of the comparison
 */
exports.isMatch = function(password, auth, callback) {
	exports.hash(password, auth.salt, function(err, hash) {
		callback(auth.hash === hash);
	});
}

/**
 * Generate a random token with an expiration date of 24 hours.
 * @returns {tokenObject} token object
 */
exports.generateToken = function() {
	var token = crypto.randomBytes(32).toString('hex'),
		exp = new Date();
	exp.setDate(exp.getDate() + 1);
	return {
		token: token,
		expires: exp
	};
}