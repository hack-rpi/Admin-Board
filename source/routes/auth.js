var express = require('express'),
	passport = require('passport'),
	users = require('../models/users'),
	mailer = require('../helpers/mailer'),
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
	var email = req.body.username,
		password = req.body.password;
	if (email === '') {
		req.flash('error', 'No email provided.');
		return res.redirect('/register');
	}
	else if (password === '') {
		req.flash('error', 'No password provided.');
		return res.redirect('/register');
	}
	users.createUser(email, password, {}, function(err, doc) {
		if (err) {
			if (err.showUser) {
				req.flash('error', err.message);
			}
			else {
				req.flash('error', 'User creation failed.');
			}
			return res.redirect('/register');
		}
		mailer.confirmRegistration(req, res, email);
		return res.redirect('/');
	});
});

module.exports = router;