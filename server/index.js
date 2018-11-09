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
const errorHandler = require('errorhandler');
const debug = require('debug')('http');
const passport = require('passport');

// The Passport require must be below all models
// require('./config/passport');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Create a new Express application.
var app = express();
var MemoryStore = require('memorystore')(session)

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(cors());
app.use(require('morgan')('dev')); // ('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// If you run into a 500 error "Cannot set property X of undefined", it means that
// you placed those lines below app.use(app.router).
// It's important that app.use(app.router) is below in your configuration function.
app.use(session({
	secret: 'temp secret',
	store: new MemoryStore({ checkPeriod: 60000 }),
//	store   : new storage({ client : conn, cleanup: false }),
//	maxAge: 60000,
// duration: 60000, // 30 * 60 * 1000,
// activeDuration: 1000, // 5 * 60 * 1000,
// ephemeral: true,
	cookie: {
		httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
		secure: false, // only send cookie over https
		maxAge: 60000 // 60000*60*24 // set cookie expiry length in ms
	},
// Forces the session to be saved back to the session store,
// even if the session was never modified during the request.
// How do I know if this is necessary for my store?
// The best way to know is to check with your store if it implements the touch method.
// If it does, then you can safely set resave: false.
// If it does not implement the touch method and your store sets an expiration date on stored sessions,
// then you likely need resave: true.
// Session.touch()
// Updates the .maxAge property.
// Typically this is not necessary to call, as the session middleware does this for you.
	resave: false,
// Force a session identifier cookie to be set on every response.
// The expiration is reset to the original maxAge, resetting the expiration countdown.
// The default value is false.
// Note When this option is set to true but the saveUninitialized option is set to false,
// the cookie will not be set on a response with an uninitialized session.
//  rolling: true,
// Forces a session that is “uninitialized” to be saved to the store.
// A session is uninitialized when it is new but not modified.
// Choosing false is useful for implementing login sessions,
// reducing server storage usage, or complying with laws that require permission before setting a cookie.
// Choosing false will also help with race conditions where a client makes multiple parallel requests without a session.
//The default value is true, but using the default has been deprecated, as the default will change in the future. Please research into this setting and choose what is appropriate to your use-case.
	saveUninitialized: false
}));

/* The cookie.secure option can also be set to the special value 'auto'
to have this setting automatically match the determined security of the connection.
Be careful when using this setting if the site is available both as HTTP and HTTPS,
as once the cookie is set on HTTPS, it will no longer be visible over HTTP.
This is useful when the Express "trust proxy" setting is properly setup
to simplify development vs production configuration. */
/*
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
*/

// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
// app.set('views', '../public');
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// Initialize Passport and restore authentication state, if any, from the session.
// You need to use the express-session middleware before app.use(passport.session());
//  to actually store the session in memory/database.
// This middleware is responsible for setting cookies to browsers
// and converts the cookies sent by browsers into req.session object.
// PassportJS only uses that object to further deserialize the user.
require('./routes/auth/init')//.init(app);
app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(path.join(__dirname, '/views')));
app.use(express.static('../public'));
// Configure our app
const router = require('./routes');
app.use(router);
const auth = require('./routes/auth');
app.use('/auth', auth);

// Check session expires
app.use(function(req, res, next) {
debug("req.url = " + req.url)
debug("session = " +req.session.cookie.expires)
	if(req.url != '/' && req.user != 'undefined') {
		next();
	}
	else {
debug("Session expired.");
		req.logout();
		res.render('index', { title: req.user, body: req.user });
		req.session.destroy(function(){
			console.log("user logged out.")
		});
//		req.session.reset();
	}
//		res.redirect('/');
});

// Define routes.
app.get('/',
	function(req, res) {
		res.render('index', { title: req.user, body: req.user });
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
debug('isProduction = ' + isProduction);
  }
 console.log('Express server listening on port %s', port);
});
