// server/routes/api/auth.js

const passport = require('passport');
// const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../models');
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
  passport.use(new LocalStrategy((user, pass, callback) => {
    console.log('@@@@@@@@@@@@@')
  	db.users.findByUsername(user, (err, User) => {
  		if(err)
  			return callback(err);

  		// User not found
  		if(!User)
  			return callback(null, false);

      // warning  Potential timing attack, right side: true
      // security/detect-possible-timing-attacks
  		if(User.pass != pass)
  			return callback(null, false);

  		return callback(null, User);
  		/* Always use hashed passwords and fixed time comparison
  		bcrypt.compare(pass, User.pass, (err, isValid) => {
  			if(err)
  				return callback(err);

  			if(!isValid)
  				return callback(null, false);

  			return callback(null, User);
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
passport.serializeUser(function(User, callback) {
  callback(null, User.id);
});

passport.deserializeUser(function(id, callback) {
  db.users.findById(id, function (err, User) {
    if (err) { return callback(err); }
    callback(null, User);
  });
});
