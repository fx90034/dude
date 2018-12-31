// ./models/devices/index.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
exports.devices = require('nano')('http://http://localhost:' + config.db.port + '/devices');
const db = require('nano')('http://http://localhost:' + config.db.port + '/devices');
const debug = require('debug')('db');

exports.getLatestDeviceTime = function(callback) {
console.log('getLatestDeviceTime ...');
  let params = { last_update_date: {}, descending: true, limit:1 };
	db.view('device', 'by_last_update_date', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
console.log(body)
console.log("rows.length = " + body.rows.length)
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body.rows[0].value);
	});
}
exports.addDevice = function(record, callback) {
debug("addDevice!!");
  var group = record["group"];
  var subgroup = record["subgroup"];
  var name = record["name"];
  var key = null;
	this.queryByName(group, subgroup, name, function(err, body) {
		if(body) {
debug("body.id = " + body.id)
      record._rev = body.value;
      key = body.id;
      // this.update(record, key, function(err, res) {
      //   if(err) {
      //     console.error(err);
      //     return callback(err, null);
      //   }
      //   return callback(null, null);
      // });
		}
debug("@Insert device!!")
debug("!!!record = " + JSON.stringify(record))
		db.insert(record, key, function(err, body) {
			if(err) {
				console.error(err);
				return callback(err, null);
			}
//			console.log(body);
			callback(null, body);
		});
  }); // queryByName()
}
exports.queryByName = function(group, subgroup, name, callback) {
debug("queryByName: " + group);
debug("queryByName: " + subgroup);
debug("queryByName: " + name);
  let params = { "name": name, "startkey": [name], "endkey": [name, {}, {}], include_docs: true };
	db.view('device', 'by_name', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("rows = " + body.rows.length)
		if(body.rows.length == 0)
			return callback(null, null);
		else {
      var len = body.rows.length;
      for(var i=0; i<len; i++) {
        if(group === body.rows[i].doc.group && subgroup === body.rows[i].doc.subgroup) {
debug(JSON.stringify(body.rows[i]))
          return callback(null, body.rows[i]);
        }
      }
			return callback(null, null);
    }
	});
}
exports.update = function(obj, key, callback) {
 db.get(key, function (error, existing) {
  if(!error) obj._rev = existing._rev;
  db.insert(obj, key, callback);
 });
}
exports.queryBySubgroup = function(group, subgroup, callback) {
debug("queryBySubgroup: " + group);
debug("queryBySubgroup: " + subgroup);
  let params = { "subgroup": subgroup,"startkey": [subgroup], "endkey": [subgroup, {}], include_docs: true };
	db.view('device', 'by_subgroup', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("rows = " + body.rows.length)
		if(body.rows.length == 0)
			return callback(null, null);
    else {
      return callback(null, body.rows);
    }
	});
}
