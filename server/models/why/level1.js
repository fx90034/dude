
const db = require('./index');
const debug = require('debug')('http');

exports.addLevel1 = function(level1, ip, user, callback) {
debug("addLevel1!!");
  var today = new Date(Date.now());
  var record = { level1: level1, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
	this.queryByLevel1(level1, ip, user, function(err, body) {
		if(body != null && body.rows.length >= 1 && body.rows[0].key[1]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[1])
			console.warn("level1: '" + level1 + "' is existed.");
      let docId = body.rows[0].id;
debug("doc id = " + docId)
      db.update(record, docId, function(err, body) {
        if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			callback(null, body);
      });
		}
		else {
debug("@Insert level1!!")
  		db.why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			callback(null, body);
  		});
  	}
  }); // queryBylevel1()
}

exports.queryByLevel1 = function(level1, ip, user, callback) {
debug("queryByLevel1: " + level1);
  let params = { "level1": level1, "startkey": [level1], "endkey": [level1, ip, user]};
	db.why.view('answers', 'by_level1', params, function(err, body) {
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
