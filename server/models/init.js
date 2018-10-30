// server/models/init.js

var nano = require('nano')('http://localhost:8825');

try {
  nano.db.destroy('users', function() {
    nano.db.create('users', function() {
      var users = nano.use('users');
      users.insert({
         "views": {
            "username": {
               "map": function (doc) {
                  emit(doc.name, doc.pass);
               }
            }
         }
      }, '_design/auth', function (error, response) {
         console.log("View 'auth/username' is created.");
      });
    });
  });
} catch(err) {
  console.log(err);
}

console.log("Database 'users' is initialized.");
