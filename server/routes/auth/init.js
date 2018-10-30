// server/routes/api/auth.js

const passport = require('passport');
// const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../models/users');
const debug = require('debug')('http');
const bcrypt = require('bcrypt');
/*
const USER = {
	username: 'test-user',
	passhash: 'bcrypt-hashed-password',
	id: 1
};
*/

/** Configure the local strategy for use by Passport
  * The local strategy require a `verify` function which receives the credentials
  * (`username` and `password`) submitted by the user.  The function must verify
  * that the password is correct and then invoke `cb` with a user object, which
  * will be set at `req.user` in route handlers after authentication.
  */
//function initPassport () {
  passport.use(new LocalStrategy((username, password, callback) => {
debug('@@@@@@@@@@@@@')
  	db.users.queryUser(username, (err, user) => {
  		if(err)
  			return callback(err);

  		// user not found
  		if(!user)
  			return callback(null, false, { message: "Invalid username or password" });
debug("!!!! user = " + username)
debug("!!!! password = " + password)
debug("pass = " + user.doc.pass)
      /* warning  Potential timing attack, right side: true
         security/detect-possible-timing-attacks
  		if(user.pass != password)
  			return callback(null, false, { message: "Invalid username or password" });

  		return callback(null, user); */
  		// Always use hashed passwords and fixed time comparison
      if(bcrypt.compareSync(password, user.doc.pass)) {
        return callback(null, user.doc);
      }
      else {
        return callback(null, false, { message: "Invalid username or password" });
      }
/*
  		bcrypt.compare(hash, user.pass, (err, isValid) => {
  			if(err)
  				return callback(err);

  			if(!isValid)
  				return callback(null, false, { message: "Invalid username or password" });

  			return callback(null, user);
  		}); */
  	});
  }
  ));
//  passport.authenticationMiddleware = authenticationMiddleware
//}

//module.exports = initPassport

/* Configure Passport authenticated session persistence
    In order to restore authentication state across HTTP requests, Passport needs
    to serialize users into and deserialize users out of the session.  The
    typical implementation of this is as simple as supplying the user ID when
    serializing, and querying the user record by ID from the database when
    deserializing.
*/
/*
passport.serializeUser(function(user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function(_id, callback) {
  db.users.findById(id, function (err, user) {
    if (err) { return callback(err); }
    callback(null, user);
  });
});
*/
passport.serializeUser(function(user, callback) {
  callback(null, user.name);
});

passport.deserializeUser(function(name, callback) {
  db.users.queryUser(name, function (err, user) {
    if (err) { return callback(err); }
    callback(null, user.doc);
  });
});
