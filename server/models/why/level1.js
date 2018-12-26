
const db = require('./index');
const debug = require('debug')('db');

exports.addLevel1 = function(level1, ip, user, callback) {
debug("addLevel1!!");
  var today = new Date(Date.now());
  var record = { level1: level1, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
  if(!ip && !user) {
  debug("@Insert level1 for anonymous user!!")
      db.why.insert(record, null, function(err, body) {
        if(err) {
          console.error(err);
          return callback(err, null);
        }
        console.log(body);
        return callback(null, body);
      });
  }
	this.queryByLevel1(level1, ip, user, function(err, body) {
		if(body != null && body.rows.length > 0) {
debug("!!!body.rows[0].ip = " + body.rows[0].ip)
			console.warn("level1: '" + level1 + "' is existed.");
      return callback(null, null);
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
  let params = { "level1": level1, "startkey": [level1, ip, user], "endkey": [level1, ip, user] };
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
