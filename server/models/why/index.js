// ./index.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
exports.why = require('nano')('http://localhost:' + config.db.port + '/why');
const db = require('nano')('http://localhost:' + config.db.port + '/why');
const debug = require('debug')('db');

exports.level1 = require('./level1');
exports.level2 = require('./level2');


exports.queryByIP = function(ip, user, callback) {
debug("queryByIP: " + ip);
  let params = { "ip": ip, "startkey": [ip], "endkey": [ip, {}]};
	why.view('answer', 'by_ip', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug(body)
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body);
	});
}

exports.update = function(obj, key, callback) {
 db.get(key, function (error, existing) {
  if(!error) obj._rev = existing._rev;
  db.insert(obj, key, callback);
 });
}
