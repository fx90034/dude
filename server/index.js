// server/index.js

// ref: https://github.com/passport/express-4.x-local-example/blob/master/server.js
// ref: https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e
// refL https://www.tutorialspoint.com/expressjs/expressjs_quick_guide.htm

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const cors = require('cors');
const favicon = require('serve-favicon');
const engine = require('ejs-locals');
const passport = require('passport');
const errorHandler = require('errorhandler');
const router = require('./routes');
const validator = require('validator');

const debug = require('debug')('http');

// The Passport require must be below all models
// require('./config/passport');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Create a new Express application.
var app = express();

// Configure our app
app.use(cors());
app.use(router);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

app.use(require('morgan')('dev')); // ('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
	secret: 'bingobo',
	cookie: {
		httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
		secure: false, // only send cookie over https
		maxAge: 60000 // 60000*60*24 // set cookie expiry length in ms
	},
	resave: false,
	saveUninitialized: false
}));

// app.use(express.static(path.join(__dirname, '/views')));
app.use(express.static('../public'));
// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
// app.set('views', '../public');
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// Initialize Passport and restore authentication state, if any, from the session.
require('./routes/auth/init')//.init(app);
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
	function(req, res) {
		res.render('index', { title: req.user, body: req.user });
	});

app.get('/home',
	function(req, res) {
		var user = req.session.user;
		var message = req.message;
		if(user) {
debug('username = ' + user.name);
			res.render('main', { title: user.name, user: user.name });
		}
		else
			res.render('home', { title: req.user, user: '', message: message });
	});

app.post('/pass',
	function(req, res) {
		var username = req.body.username;
debug('In pass: ' + username);
		if(username) {
			if(validator.isMobilePhone(username, "en-US")) {
debug('isMobilePhone: username = ' + username)
				res.render('pass', { user: username });
				return;
			}

			else if(validator.isEmail(username)) {
debug('isEmail: username = ' + username)
				res.render('pass', { user: username });
				return;
			}
		}

		res.render('home', { user: '', message: "Please enter a valid username to get started." });
	});

var Users = [];

app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup', function(req, res){
	let username = req.body.username;
debug('signup: username = ' + username)
debug("Users length = " + Users.length)
  if(!username){
//      res.status("400");
//      res.send("Invalid details!");
		res.render('signup', { message: "Please enter your username to get started." });
   } else {
      Users.filter(function(user){
debug('signup: Users = ' + user.name)
         if(user.name === username){
            res.render('signup', {
               message: "User Already Exists! Login or choose a different username" });
         }
      });
		}

		if(validator.isMobilePhone(username, "en-US")) {
debug('isMobilePhone: username = ' + username)
			res.render('credential', { user: username, type: 'phone', message: '' });
			return;
		}

		else if(validator.isEmail(username)) {
debug('isEmail: username = ' + username)
			res.render('credential', { user: username, type: 'email', message: '' });
			return;
		}

		res.render('home', { message: "Please enter a valid username to get started."});
});

app.get('/credential', function(req, res) {
	res.render('signup');
});

app.post('/credential', function(req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
	var type = req.body.type;
	var remember = req.body.remember;
debug('creadential: user = ' + user)
debug('creadential: pass = ' + pass)
debug('creadential: type = ' + type)
debug('creadential: remember = ' + remember)
	if(!user){
//    res.status("400");
//    res.send("Invalid details!");
		res.render('signup', { message: "Please enter your username to get started."});
		return;
  }

//	if(validator.matches(pass, "/^[a-zA-Z0-9]{3,30}$/")) {
//		"/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/", "i")) {
		var newUser = { id: null, name: user, type: type, pass: pass, remember: remember };
		Users.push(newUser);
		req.session.user = newUser;

		const db = require('./models');
		var id;
		db.users.addNewUser(newUser, function(err, id) {
			if(!err) {
				newUser.id = id;
				res.render('profile', { user: newUser });
			}
		});
//	}
//	else
//		res.render('credential', { user: user , type: type, message: "Please enter a valid password." });
//																message: "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long."});
});

app.get('/login',
	function(req, res, next){
		res.render('login');
	});

app.post('/login',
	passport.authenticate('local', {
    successRedirect: 'profile',
    failureRedirect: 'home' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout',
	function(req, res){
    req.session.destroy(function(){
      console.log("user logged out.")
   });
		req.logout();
		res.redirect('/home');
	});

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.render('profile', { user: req.user });
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

app.get('/protected_page', checkSignIn, function(req, res){
   res.render('protected_page', {id: req.session.user.id})
});

app.use('/protected_page', function(err, req, res, next){
console.log(err);
   //User should be authenticated! Redirect him to log in.
   res.redirect('/login');
});

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

if(!isProduction) {
	app.use(errorHandler());

	app.use((err, req, res, next) => {
	// app.use(function(err, req, res) {
		res.status(err.status || 500).json({
			errors: {
				success: false,
				message: err.message,
				error: err,
			},
		});
	});
}

 app.use((err, req, res, next) => {
// app.use(function(err, req, res) {
	res.status(err.status || 500);

	res.json({
		errors: {
			message: err.message,
			error: {},
		},
	});
});

// Error handling
// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// app.listen(8080, () => console.log('Server running on http://localhost:8080/'));
var server = app.listen(7398, function() {
  var port = server.address().port;

  if(!isProduction) {
    if(debug.enabled)
      console.log("debug is enabled");
    else {
      console.log("debug is not enabled");
    }
    debug("debug is asdf");
    debug('isProduction = ' + isProduction);
  }
 console.log('Express server listening on port %s', port);
});
