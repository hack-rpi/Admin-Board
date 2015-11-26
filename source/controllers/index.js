var express = require('express'),
	passport = require('passport'),
	users = require('../models/users'),
	router = express.Router();
	
router.get('/', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board',
		username: req.user ? req.user.username : null
	});
});

router.get('/login', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board',
	});
});

router.post('/login', 
	passport.authenticate('local', { successRedirect: '/', 
									 failureRedirect: '/login' })
);

router.get('/register', function(req, res) {
	res.render('register.jade', {
		title: 'Admin Board'
	});
});

router.post('/register', function(req, res, next) {
	var username = req.body.username,
		password = req.body.password;
	users.createUser(username, password, {}, function(err, doc) {
		if (err) {
			console.log(err);
			return res.send('error');
		}
		return res.send(doc);
	});
});

module.exports = router;
