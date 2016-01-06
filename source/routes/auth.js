var express = require('express'),
	passport = require('passport'),
	users = require('../models/users'),
	mailer = require('../helpers/mailer'),
	password = require('../helpers/password'),
	router = express.Router();

router.get('/login', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board'
	});
});

router.post('/login', 
	passport.authenticate('local', { successFlash: 'Welcome!',
									 successRedirect: '/', 
									 failureFlash: 'Invalid email or password',
									 failureRedirect: '/login' })
);

router.get('/logout', function(req, res) {
	req.flash('success', 'Logged out successfully.');
	req.logout();
	res.redirect('/');
});

router.get('/register', function(req, res) {
	res.render('register.jade', {
		title: 'Admin Board'
	});
});

router.post('/register', function(req, res, next) {
	var email = req.body.email,
		  pwd = req.body.password;
	var token = password.generateToken();
	if (email === '') {
		req.flash('error', 'No email provided.');
		return res.redirect('/register');
	}
	else if (pwd === '') {
		req.flash('error', 'No password provided.');
		return res.redirect('/register');
	}
	users.createUser(email, pwd, {}, function(err, doc) {
		if (err) {
			if (err.showUser) {
				req.flash('error', err.message);
			}
			else {
				req.flash('error', 'User creation failed.');
			}
			return res.redirect('/register');
		}
		req.login(doc, function(err) {
			if (err) {
				req.flash('error', 'Log in failed.');
				return res.redirect('/');
			}
			users.updateOne({ _id: doc._id }, { '$set': { token: token } }, function(err, result) {
				if (err) {
					req.flash('error', 'Failed to send verification email.');
					return res.redirect('/');
				}
				doc.token = token;
				mailer.confirmRegistration(doc, function(err, state) {
					if (err) {
						req.flash('error', 'Failed to send verification email.');
					}
					else {
						req.flash('success', 'Verification email sent.');
					}
					return res.redirect('/');
				});
			});
		});
	});
});

router.get('/verify', function(req, res, next) {
	var id = req.query.id,
		  token = req.query.token;
	if (id && token) {
		users.verifyEmail(id, token, function(err, state) {
			if (err) {
				if (err.showUser) {
					req.flash('error', err.message);
				}
				else {
					req.flash('error', 'Unable to verify email address.');
				}
			}
			else if (state) {
				req.flash('success', 'Email address verified.');
			}
			else {
				req.flash('error', 'Token expired.');
			}
			return res.redirect('/');
		});
	}
	else {
		res.redirect('/');		
	}
});

router.get('/user/*', function(req, res, next) {
  if (! req.user) {
    req.flash('error', 'You must log in to see this page.');
    return res.redirect('/login');
  }
  var uid = req.params['0'];
  users.findUserById(uid, function(err, doc) {
    if (err) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }
    return res.render('user', {
      user_data: doc
    });
  });
});

module.exports = router;
