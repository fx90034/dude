// server/index.js

// ref: https://github.com/passport/express-4.x-local-example/blob/master/server.js
// ref: https://github.com/passport/express-4.x-local-example/blob/master/server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const engine = require('ejs-locals');
const passport = require('passport');
const errorHandler = require('errorhandler');
// const passport = require('passport');

// The Passport require must be below all models
require('./config/passport');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Create a new Express application.
var app = express();

// Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('../public'));
app.use(session({
	secret: 'passport-tutorial',
	cookie: {
		httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
		//    secure: true, // only send cookie over https
		maxAge: 60000 // 60000*60*24 // set cookie expiry length in ms
	},
	resave: false,
	saveUninitialized: false
}));
/*
if(!isProduction) {
	app.use(errorHandler());

		app.use((err, req, res) => {
	// app.use(function(err, req, res) {
		res.status(err.status || 500).res.json({
			errors: {
				success: false,
				message: err.message,
				error: err,
			},
		});
	});
}

 app.use((err, req, res) => {
// app.use(function(err, req, res) {
	res.status(err.status || 500);

	res.json({
		errors: {
			message: err.message,
			error: {},
		},
	});
});
*/
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
app.set('views', '../public');
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Define routes.
app.get('/',
	function(req, res) {
		res.render('home', { user: req.user });
	});

app.get('/login',
	function(req, res){
		res.render('login');
	});

app.post('/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout',
	function(req, res){
		req.logout();
		res.redirect('/');
	});

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.render('profile', { user: req.user });
	});

  app.get('/test',
  	function(req, res) {
  		res.render('index', { title: req.user, body: req.user });
  	});

// app.listen(8080, () => console.log('Server running on http://localhost:8080/'));
var server = app.listen(7398, function() {
  var port = server.address().port;
 console.log('Express server listening on port %s', port);
});
