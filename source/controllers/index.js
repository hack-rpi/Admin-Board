var express = require('express'),
	router = express.Router();
	
router.get('/', function(req, res) {
	res.render('index.jade', {
		title: 'Admin Board'
	});
});

module.exports = router;
