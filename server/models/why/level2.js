const debug = require('debug')('http');
const db = require('./index');
const level1 = require('./level1');

exports.addLevel2 = function(level1, level2, ip, user, callback) {
debug("addLevel2!!");
  var today = new Date(Date.now());
  var record = { level1: level1, level2: level2, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
  if(!ip && !user) {
debug("@Insert level2 for anonimous user!!")
  		db.why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			return callback(null, body);
  		});
  }
	this.queryByLevel2(level1, level2, ip, user, function(err, body) {
		if(body != null && body.rows.length == 1 && body.rows[0].key[2]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[2])
			console.warn("level2: " + level2 + " existed.");
      let docId = body.rows[0].id;
debug("doc id = " + docId)
      db.update(record, docId, function(err, res) {
        if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			return callback(null, body);
      });
		}
		else {
      db.level1.queryByLevel1(level1, ip, user, function(err, body) {
    		if(body != null && body.rows.length == 1 && body.rows[0].key[1]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[1])
    			console.warn("level1: " + level1 + " existed.");
          let docId = body.rows[0].id;
debug("doc id = " + docId)
          db.update(record, docId, function(err, res) {
            if(err) {
      				console.error(err);
      				return callback(err, null);
      			}
      			console.log(body);
      			return callback(null, body);
          });
    		}
        else {
debug("@Insert level2!!")
  		db.why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			return callback(null, body);
  		});
    }
        }); // queryBylevel1()
    }
  }); // queryBylevel2()
}

exports.queryByLevel2 = function(level1, level2, ip, user, callback) {
debug("queryByLevel2: " + level2);
  let params = { "level1": level1, "startkey": [level1], "endkey": [level1, level2, ip, user]};
	db.why.view('answer', 'by_level1', params, function(err, body) {
//  why.view('answer', 'by_level1', {[level1, ip, user]},  function(err, body) {
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
