
const db = require('./index');
const debug = require('debug')('db');

exports.reportByLevel1 = function(level1, ip, user, callback) {
debug("reportByLevel1: " + level1);
  let params = { "level1": level1, "startkey": [level1], "endkey": [level1, {}, {}] };
	db.why.view('answers', 'count_level1', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("Level1 count: " + JSON.stringify(body))
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body);
	});
}

exports.reportByLevel2 = function(level1, level2, callback) {
debug("reportByLevel2: " + level2);
  let params = { "level1": level1, "startkey": [level1, level2], "endkey": [level1, level2, {}, {}] };
	db.why.view('answers', 'count_level2', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("Level2 count: " + JSON.stringify(body))
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body);
	});
}

exports.reportByLevel3 = function(level1, level2, level3, callback) {
debug("reportByLevel3: " + level3);
  let params = { "level1": level1, "startkey": [level1, level2, level3], "endkey": [level1, level2, level3, {}, {}] };
	db.why.view('answers', 'count_level3', params, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug("Level3 count: " + JSON.stringify(body))
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body);
	});
}
