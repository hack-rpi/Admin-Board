var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	password = require('../helpers/password'),
	users = require('../models/users');

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	users.findUserById(id, done);
});
	
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, pwd, done) {
		users.findUserByEmail('poegem@rpi.edu', function(err, doc) {
			if (err) {
				return done(err);
			}
			if (! doc) {
				return done(null, false, { message: 'Incorrect email.' });
			}
			password.isMatch(pwd, doc.auth, function(match) {
				if (match) {
					return done(null, doc);
				}
				else {
					return done(null, false, { message: 'Incorrect password.' });
				}
			});
		});
	}
));
