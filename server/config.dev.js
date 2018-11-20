// config.js

const config = {};
config.cloud = {};
config.db = {};
config.web = {};

config.cloud.username = 'user';
config.cloud.password=  'pass';
config.cloud.uri = process.env.DUOSTACK_DB_REDIS;

config.db.host = 'localhost';
config.db.port = 8825;
config.web.port = process.env.WEB_PORT || 7398;

module.exports = config;
