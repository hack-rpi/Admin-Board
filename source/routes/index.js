var express = require('express'),
	router = express.Router();

router.use(require('./auth'));
router.use('/libs', require('./libs'));

router.get('/', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board',
		email: req.user ? req.user.email.address : null
	});
});

module.exports = router;
