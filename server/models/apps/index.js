// ./models/apps/index.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
exports.apps = require('nano')('http://localhost:' + config.db.port + '/apps');
const db = require('nano')('http://localhost:' + config.db.port + '/apps');
const debug = require('debug')('db');

exports.report = require('./report');

exports.queryUserDevice = function(id, user, callback) {
debug("queryUserDevice: " + id);
  let params = { "id": id, "startkey": [id, user], "endkey": [id, {}], include_docs: true };
	db.view('active', 'by_device_id', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug(body)
		if(body.rows.length == 0)
			return callback(null, null);
    body.rows.forEach((doc) => {
console.log(doc.value);
      if(doc.user === user)
        return callback(null, doc);
    });
	});
}

exports.update = function(obj, key, callback) {
 db.get(key, function (error, existing) {
  if(!error) obj._rev = existing._rev;
  db.insert(obj, key, callback);
 });
}
