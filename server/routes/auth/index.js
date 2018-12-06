const express = require('express');
const router = express.Router();
const debug = require('debug')('http');
const validator = require('validator');
const passport = require('passport');
const db = require('../../models/users');
const bcrypt = require('bcrypt');

// Initialize Passport and restore authentication state, if any, from the session.
// require('./init')//.init(app);
// router.use(passport.initialize());
// router.use(passport.session());

// router.use('/users', require('./users'));

var signedInUsernames = new Map();
db.users.loadSingedInUsers(function(err, signedInUsers) {
	if(!err && signedInUsers && signedInUsers.length != 0) {
		signedInUsers.forEach(function(user) {
			signedInUsernames.set(user.key, user.value);
		});
	}
});

router.get('/start',
	function(req, res) {
//		signedInIps.filter(function(ip) {
		let username = signedInUsernames.get(req.ip);
debug("req.ip = " + req.ip)
debug("username = " + username)
		let user = req.session.user;
		 if(username) {
			 if(user == null) {
				 user = { name: username };
				 req.session.user = user;
			 }
			 else {
			  user.name = username;
			}
			res.render('apps/main', { user: user });
			return;
		 }
/*
debug(req.cookies.rememberme)
		if(req.cookies.rememberme == 1)
			req.session.user = req.cookies.name;
*/
		if(user) {
debug('In auth/home: username = ' + user);
			res.render('apps/main', { title: user, user: user });
			return;
		}
		res.render('auth/home', { message: req.message });
	});

	router.get('/home',
		function(req, res) {
			if(req.session.user)
console.log("@@@@user " + req.session.user.name + " logged out.");
			req.logout();
			res.render('auth/home', { message: req.message });
		}
	);

router.post('/pass',
	function(req, res) {
		var username = req.body.username;
debug('In pass: ' + username);
		if(username) {
			if(validator.isMobilePhone(username, "en-US")) {
debug('isMobilePhone: username = ' + username)
				res.render('auth/pass', { username: username, message: '' });
				return;
			}

			else if(validator.isEmail(username)) {
debug('isEmail: username = ' + username)
				res.render('auth/pass', { username: username, message: '' });
				return;
			}
		}

		res.render('auth/home', { message: "Please enter a valid username to get started." });
	});

router.post('/signup', function(req, res){
	let username = req.body.username;
  let type = '';
debug('signup: username = ' + username);
  if(!username) {
//      res.status("400");
//      res.send("Invalid details!");
		res.render('auth/signup', { message: "Please enter your username to get started." });
		return;
   }

	if(validator.isMobilePhone(username, "en-US")) {
    type = 'phone';
  }

  else if(validator.isEmail(username)) {
    type = 'email';
  }

  else {
debug('validation failed: ' + username)
	   res.render('auth/home', { message: "Please enter a valid username to get started."});
     return;
  }

  db.users.queryUser(username, function(err, body) {
   if(body) {
       res.render('auth/signup', { message: "User Already Exists! Login or choose a different username" });
       return;
   }

   else {
     res.render('auth/credential', { user: username, type: type, message: '' });
   }
  });
});

router.get('/credential', function(req, res) {
	res.render('auth/home', { message: '' } );
});

router.post('/credential', function(req, res) {
	var user = req.body.username;
	var pass = req.body.password;
	var type = req.body.type;
	var remember = req.body.remember;
	var today = new Date(Date.now());
  if(type === 'email')
    user = user.toLowerCase();
	if(remember === 'on')
		ip = req.ip;
	else
		ip = '';
debug('creadential: user = ' + user)
debug('creadential: pass = ' + pass)
debug('creadential: type = ' + type)
debug('creadential: remember = ' + remember)
	if(!user){
//    res.status("400");
//    res.send("Invalid details!");
		res.render('auth/signup', { message: "Please enter your username to get started."});
		return;
  }

//	if(validator.matches(pass, "/^[a-zA-Z0-9]{3,30}$/")) {
//		"/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/", "i")) {
    let hash = bcrypt.hashSync(pass, 10);
		var newUser = { name: user, type: type, pass: hash, created_date: today, last_signed_in_date: today };
		if(ip)
			newUser = { name: user, type: type, pass: hash, ip: ip, created_date: today, last_signed_in_date: today};

		db.users.addNewUser(newUser, function(err, body) {
			if(!err) {
/*
				if(remember === 'on') {
debug("remember = " + remember)
					var farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10)); // ~10y
					res.cookie('name', user, { expires: farFuture, httpOnly: true });
					res.cookie('rememberme', '1', { expires: farFuture, httpOnly: true });
				}
*/
				newUser._id = body.id;
				req.session.user = user;
				if(ip)
					signedInUsernames.set(ip, user);
				res.render('apps/main', { user: newUser });
			}

			else {
				res.render('auth/pass', { username: '', message:  err.message });
			}
		});
//	}
//	else
//		res.render('auth/credential', { user: user , type: type, message: "Please enter a valid password." });
//																message: "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long."});
});

router.get('/login',
	function(req, res, next){
		res.render('auth/../index');
	});
/*
app.post('/login',
	passport.authenticate('local', {
    successRedirect: 'auth/profile',
    failureRedirect: 'auth/home' }),
	function(req, res) {
		res.redirect('/');
	});
*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
			console.error(err);
			res.render('auth/pass', { username: '', message: 'Failed authentication.' });
			// return next(err);
		}
    if (!user) {
			console.error("User not found.");
			console.error(info.message);
			return res.render('auth/pass', { username: '', message: info.message });
		}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.session.user = user;
debug(user)
debug("in auth/login: req.session.user = " + user.name);
      return res.render('apps/main', { user: user });
    });
  })(req, res, next);
});

router.get('/logout',
	function(req, res){
console.log("user " + req.session.user.name + " logged out.");
		req.logout();
//		req.session.reset();
		req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} else {
				res.render('auth/../index');
			}
	 });
});

router.get('/profile',
//	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
debug("In /profile.")
		res.render('auth/profile', { user: req.session.user });
	});

function checkSignIn(req, res){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

router.get('/protected_page', checkSignIn, function(req, res){
   res.render('protected_page', {id: req.session.user.id})
});

router.use('/protected_page', function(err, req, res, next){
console.log(err);
   //User should be authenticated! Redirect him to log in.
   res.redirect('login');
});

router.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

module.exports = router;
