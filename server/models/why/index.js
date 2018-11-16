exports.why = require('nano')('http://localhost:8825/why');
const db = require('nano')('http://localhost:8825/why');
const debug = require('debug')('http');

exports.concern = require('./concern');
exports.cost = require('./cost');


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
