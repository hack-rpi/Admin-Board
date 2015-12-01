var express = require('express'),
	passport = require('passport'),
	router = express.Router();

router.get('/login', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board'
	});
});

router.post('/login', 
	passport.authenticate('local', { successFlash: 'Welcome!',
									 successRedirect: '/', 
									 failureFlash: 'Invalid username or password',
									 failureRedirect: '/login' })
);

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;