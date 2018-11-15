var why = require('nano')('http://localhost:8825/why');
const debug = require('debug')('http');

exports.addConcern = function(concern, ip, user, callback) {
debug("addConcern!!");
  var today = new Date(Date.now());
  var record = { concern: concern, created_date: today, last_update_date: today };
  if(ip)
    record = { concern: concern, ip: ip, created_date: today, last_update_date: today };
  else if(user)
    record = { concern: concern, ip: ip, user: user, created_date: today, last_update_date: today };
debug("record = " + JSON.stringify(record));
	this.queryConcern(concern, ip, user, function(err, body) {
		if(body != null && body.rows.length == 1 && body.rows[0].key[1]) {
debug("!!!body.rows[0].key = " + body.rows[0].key[0])
			console.warn("concern: " + concern + " has existed.");
      let docId = body.rows[0].id;
debug("doc id = " + docId)
      why.atomic("answer", "last_update_date", docId,
        {field: "last_update_date", value: today}, function(err, body) {
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
  		why.insert(record, null, function(err, body) {
  			if(err) {
  				console.error(err);
  				return callback(err, null);
  			}
  			console.log(body);
  			callback(null, body);
  		});
  	}
  }); // queryConcern()
}

exports.queryConcern = function(concern, ip, user, callback) {
debug("queryConcern: " + concern);
  let params = { "concern": concern,
    "startkey": [concern], "endkey": [concern, ip, {}]};
	why.view('answer', 'by_concern', params, function(err, body) {
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
