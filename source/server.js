var express = require('express'),
	lessMiddleware = require('less-middleware'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash'),
	config = require('./config'),
	app = express();
	
app.use(lessMiddleware(
	__dirname + '/public',
	{ force: true }
));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ 
	secret: 'my_secret',
	saveUninitialized: false,
	resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./middlewares/passport');

app.use(flash());
app.use('/', require('./middlewares/flash'));

app.use('/', require('./controllers'));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error.jade', {
		message: err.message,
		error: {}
	});
});

var server = app.listen(config.port, function() {
	var host = server.address().address,
		port = server.address().port;
	console.log('App running at http://%s%s', host, port);
});
