var express = require('express'),
	router = express.Router(),
	lib_route = '../../../node_modules';

router.get('/jquery', function(req, res) {
	res.sendFile('jquery/dist/jquery.min.js', {
		root: __dirname + lib_route
	});
});

module.exports = router;
