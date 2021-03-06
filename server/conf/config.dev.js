// config.js

const config = {};
config.cloud = {};
config.db = {};
config.web = {};

config.cloud.credential = 'bingobo:841101c@';
config.cloud.uri = process.env.DUOSTACK_DB_REDIS;

config.db.host = 'localhost';
config.db.port = 8825;

config.web.port = process.env.WEB_PORT || 3000;
config.web.session_expired = 600000; // 60000*60*24

module.exports = config;
