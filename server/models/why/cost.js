const debug = require('debug')('http');
const db = require('./index');
const concern = require('./concern');

exports.addCost = function(concern, cost, ip, user, callback) {
debug("addCost!!");
  var today = new Date(Date.now());
  var record = { concern: concern, cost: cost, ip: ip, user: user, last_update_date: today };
debug("record = " + JSON.stringify(record));
	this.queryByCost(concern, cost, ip, user, function(err, body) {
		if(body != null && body.rows.length == 1 && body.rows[0].key[2]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[2])
			console.warn("cost: " + cost + " existed.");
      let docId = body.rows[0].id;
debug("doc id = " + docId)
      db.why.update(record, docId, function(err, res) {
        if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			callback(null, body);
      });
		}
		else {
      db.concern.queryByConcern(concern, ip, user, function(err, body) {
    		if(body != null && body.rows.length == 1 && body.rows[0].key[1]) {
debug("!!!body.rows[0].ip = " + body.rows[0].key[1])
    			console.warn("concern: " + concern + " existed.");
          let docId = body.rows[0].id;
debug("doc id = " + docId)
          db.update(record, docId, function(err, res) {
            if(err) {
      				console.error(err);
      				return callback(err, null);
      			}
      			console.log(body);
      			callback(null, body);
          });
    		}
        else {
debug("@Insert cost!!")
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
  }); // queryByCost()
}

exports.queryByCost = function(concern, cost, ip, user, callback) {
debug("queryByCost: " + cost);
  let params = { "concern": concern, "startkey": [concern], "endkey": [concern, cost, ip, user]};
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
