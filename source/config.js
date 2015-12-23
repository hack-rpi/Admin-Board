var settings = {},
    config = {};
try {
  settings = require('./config.json');
} catch(e) {
  settings = {};
}

config.mongo_url = settings.mongo_url || '';
config.port = settings.port || 8000;
config.root_url = settings.root_url || 'http://localhost:' + config.port;

config.email = {};
settings.email = settings.email || {};
config.email.address = settings.email.address || '';
config.email.password = settings.email.password || '';
config.email.from = settings.email.from || '';
config.email.replyTo = settings.email.replyTo || '';

module.exports = config;
