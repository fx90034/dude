// server/db/users.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../../conf/config.' + env);
// var nano = require('nano')('http://localhost:' + config.db.port);
// var users = nano.use('users');
const users = require('nano')('http://localhost:' + config.db.port + '/users');
const debug = require('debug')('http');

var records = [
	{ id: 1, name: 'jack', pass: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
	, { id: 2, name: 'jill', pass: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
	, { id: 3, name: 'fx90034@gmail.com', pass: '111', displayName: 'Lily', emails: [ { value: 'fx90034@gmail.com' } ] }
];

exports.findById = function(id, callback) {
debug("in findById: id = " + id);
	process.nextTick(function() {
		var idx = id - 1;
		if (records[idx]) {
			callback(null, records[idx]);
		} else {
			callback(new Error('User ' + id + ' does not exist'));
		}
	});
};

exports.findByUsername = function(name, callback) {
debug("findByUsername: name = " + name)
	process.nextTick(function() {
		for (var i = 0, len = records.length; i < len; i++) {
			var record = records[i];
debug("record.name = " + record.name)
			if (record.name.toUpperCase() === name.toUpperCase()) {
				console.log("User found:" + name);
				return callback(null, record);
			}
		}
		return callback(null, null);
	});
};

exports.addNewUser = function(user, callback) {
debug("addNewUser");
debug("user.name = " + user.name);
debug("user.pass = " + user.pass);
//	var newUser = { id: len+1, name: user, type: type, pass: pass, remember: remember };
//	var newUser = { name: user.name, pass: user.pass, remember: user.remember, type: user.type, key: 'users' };
//	records.push(newUser);
	this.queryUser(user.name, function(err, body) {
debug("!!!body=" + body)
		if(body != null) {
			console.log("user: " + user.name + " has already signed up.");
			return callback(null,body);;
		}
		else {
debug("@!!")
		users.insert(user, null, function(err, body) {
			if(err) {
				console.err(err);
				return callback(err, null);
			}
			console.log(body);
			callback(null,body);
		});
	}
	})
}

exports.queryUser = function(username, callback) {
debug("queryUser: " + username);
//	user.search('users', 'user_name', { type: 'email' }).then((body) => {
	users.view('auth', 'by_username', {'key': username.toLowerCase(),  'include_docs': true }, function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
/* debug(body.rows)
alice.view('characters', 'happy_ones', {
  'key': 'Tea Party',
  'include_docs': true
}).then((body) => {
  body.rows.forEach((doc) => {
    console.log(doc.value);
  });
});
//  body.rows.foreach(function(doc) {}
		for (i=0; i<body.rows.length; i++) {
//		body.rows.foreach(function(doc) {
debug(body.rows[i].value)
			if(body.rows[i].value === username) {
				return callback(null, true);
			}
		}
		callback(null, false); */
debug(body)
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body.rows[0]);
	});
}

exports.loadSingedInUsers=  function(callback) {
	users.view('auth', 'by_ip', function(err, body) {
		if(err) {
			console.error(err);
			return callback(err, null);
		}
debug(body);
		if(body.rows.length == 0)
			return callback(null, null);
		else
			return callback(null, body.rows);
	});
}
exports.updateUser = function(user, callback) {
debug("updateUser");
}
