const express = require('express');
const router = express.Router();
const debug = require('debug')('http');
const validator = require('validator');
const passport = require('passport');
const db = require('../../models/users');
const bcrypt = require('bcrypt');

// Initialize Passport and restore authentication state, if any, from the session.
require('./init')//.init(app);
router.use(passport.initialize());
router.use(passport.session());

router.use('/users', require('./users'));

router.get('/home',
	function(req, res) {
		var user = req.session.user;
		var message = req.message;
debug("req.session.user = " + user);
		if(user) {
debug('In auth/home: username = ' + user.name);
			res.render('auth/main', { title: user.name, user: user.name });
		}
		else
			res.render('auth/home', { message: message });
	});

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

// var Users = [];

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
/*
      Users.filter(function(user){
debug('signup: Users = ' + user.name)
         if(user.name.toUpperCase() === username.toUpperCase()){
            res.render('auth/signup', {
               message: "User Already Exists! Login or choose a different username" });
						return;
         }
      });
*/
  if(type === 'email')
    username = username.toLowerCase();

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
  if(type === 'email')
    user = user.toLowerCase();
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
		var newUser = { name: user, type: type, pass: hash, remember: remember };
//		Users.push(newUser);
		req.session.user = newUser;

		db.users.addNewUser(newUser, function(err, body) {
			if(!err) {
				newUser.id = body._id;
				res.render('auth/profile', { user: body });
			}
		});
//	}
//	else
//		res.render('auth/credential', { user: user , type: type, message: "Please enter a valid password." });
//																message: "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long."});
});

router.get('/login',
	function(req, res, next){
		res.render('auth/login');
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
			res.redirect('auth/pass', { username: '', message: 'Failed authentication.' });
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
      return res.render('auth/profile', { user: user });
    });
  })(req, res, next);
});

router.get('/logout',
	function(req, res){
    req.session.destroy(function(){
      console.log("user logged out.")
   });
		req.logout();
		res.redirect('home');
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
