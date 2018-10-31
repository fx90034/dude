// server/models/init.js

var nano = require('nano')('http://localhost:8825');

try {
  nano.db.destroy('users', function() {
    nano.db.create('users', function() {
      var users = nano.use('users');
      users.insert({
         "views": {
            "by_username": {
               "map": function (doc) {
                  emit(doc.name, doc.last_signed_in_date);
               }
            },
            "by_ip": {
               "map": function (doc) {
                  emit(doc.ip, doc.name);
               }
            }
         }
      }, '_design/auth', function (error, response) {
        console.log("View 'by_username' is created.");
        console.log("View 'by_ip' is created.");
        console.log("Design document 'auth' is created in database 'users'.");
        console.log("Database 'users' is initialized.");
      });
    });
  });
} catch(err) {
  console.log(err);
}
