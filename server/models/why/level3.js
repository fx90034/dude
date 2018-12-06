const debug = require('debug')('db');
const db = require('./index');
const level1 = require('./level1');
const level2 = require('./level2');

exports.addLevel3 = function(level1, level2, level3, ip, user, callback) {
debug("addLevel3!!");
  var today = new Date(Date.now());
  var record = { level1: level1, level2: level2, level3: level3, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
  if(!ip && !user) {
debug("@Insert level3 for anonymous user!!")
  		db.why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			return callback(null, body);
  		});
  }
  db.report.reportByLevel3(level1, level2, level3, function(err, count) {
    console.log("Level3 count: " + JSON.stringify(count));
  });
	this.queryByLevel3(level1, level2, level3, ip, user, function(err, body) {
		if(body != null && body.rows.length > 0) {
debug("!!!body.rows[0].ip = " + body.rows[0].ip)
			console.warn("level3: " + level3 + " existed.");
      return callback(null, null);
		}
    db.level2.queryByLevel2(level1, level2, ip, user, function(err, body) {
  		if(body != null && body.rows.length > 0) {
debug("!!!body.rows[0].ip = " + body.rows[0].ip)
        for(var i=0; i<body.rows.length; i++) {
          if(body.rows[i].level3 == null) {
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
            break;
      		}
        } // end of for(i)
        if(i == body.rows.length-1) {
debug("@Insert level3!!")
          		db.why.insert(record, null, function(err, body) {
          			if(err) {
          				console.error(err);
          				return callback(err, null);
          			}
          			console.log(body);
          			return callback(null, body);
          		});
        }
      } // end of if(row>0)
      else {
        db.level1.queryByLevel1(level1, ip, user, function(err, body) {
      		if(body != null && body.rows.length > 0) {
            for(var i=0; i<body.rows.length; i++) {
              if(body.rows[i].level2 == null) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[1])
          			console.warn("level1: " + level1 + " existed.");
                let docId = body.rows[i].id;
debug("doc id = " + docId)
                db.update(record, docId, function(err, res) {
                  if(err) {
            				console.error(err);
            				return callback(err, null);
            			}
            			console.log(body);
            			return callback(null, body);
                });
                break;
          		}
            } // end of for(i)
            if(i == body.rows.length-1) {
debug("@Insert level3!!")
          		db.why.insert(record, null, function(err, body) {
          			if(err) {
          				console.error(err);
          				return callback(err, null);
          			}
          			console.log(body);
          			return callback(null, body);
          		});
            }
          } // end of if(row>0)
          else {
debug("@Insert level3!!")
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
  }); // queryBylevel3()
}

exports.queryByLevel3 = function(level1, level2, level3, ip, user, callback) {
debug("queryByLevel3: " + level3);
  let params = { "level1": level1, "startkey": [level1, level2, level3, ip, user], "endkey": [level1, level2, level3, ip, user] };
	db.why.view('answers', 'by_level3', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("queryByLevel3 result: " + JSON.stringify(body))
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body);
	});
}
