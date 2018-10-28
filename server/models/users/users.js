// server/db/users.js

var records = [
	{ id: 1, name: 'jack', pass: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
	, { id: 2, name: 'jill', pass: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
	, { id: 3, name: 'fx90034@gmail.com', pass: '111', displayName: 'Lily', emails: [ { value: 'fx90034@gmail.com' } ] }
];

exports.findById = function(id, callback) {
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
console.log("findByUsername: name = " + name)
	process.nextTick(function() {
		for (var i = 0, len = records.length; i < len; i++) {
			var record = records[i];
console.log("record.name = " + record.name)
			if (record.name.toUpperCase() === name.toUpperCase()) {
				console.log("User found:" + name);
				return callback(null, record);
			}
		}
		return callback(null, null);
	});
};

exports.addNewUser = function(user, callback) {
	var len = records.length;
console.log("user.name = " + user.name);
console.log("user.pass = " + user.pass);
//	var newUser = { id: len+1, name: user, type: type, pass: pass, remember: remember };
	var newUser = { id: len+1, name: user.name, pass: user.pass, remember: user.remember };
	records.push(newUser);

	return callback(null, len+1);
}
