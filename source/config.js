var settings = require('./config.json'),
	config = {};

config.mongo_url = settings.mongo_url || '';
config.port = settings.port || 8000;
config.root_url = settings.root_url || 'http://localhost:' + config.port;

config.email = {};
config.email.address = settings.email.address || '';
config.email.password = settings.email.password || '';
config.email.from = settings.email.from || '';
config.email.replyTo = settings.email.replyTo || '';

module.exports = config;
