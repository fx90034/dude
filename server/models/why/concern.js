
const db = require('./index');
const debug = require('debug')('http');

exports.addConcern = function(concern, ip, user, callback) {
debug("addConcern!!");
  var today = new Date(Date.now());
  var record = {concern: concern, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
	this.queryByConcern(concern, ip, user, function(err, body) {
		if(body != null && body.rows.length == 1 && body.rows[0].key[1]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[1])
			console.warn("concern: '" + concern + "' is existed.");
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
debug("@Insert concern!!")
  		db.why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			callback(null, body);
  		});
  	}
  }); // queryByConcern()
}

exports.queryByConcern = function(concern, ip, user, callback) {
debug("queryByConcern: " + concern);
  let params = { "concern": concern, "startkey": [concern], "endkey": [concern, ip, user]};
	db.why.view('answer', 'by_concern', params, function(err, body) {
//  why.view('answer', 'by_concern', {[concern, ip, user]},  function(err, body) {
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
