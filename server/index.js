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

// The Passport require must be below all models
// require('./config/passport');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Create a new Express application.
var app = express();

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
	cookie: {
		httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
		secure: false, // only send cookie over https
		maxAge: 60000 // 60000*60*24 // set cookie expiry length in ms
	},
	resave: false,
	saveUninitialized: false
}));

// Configure view engine to render EJS templates.
// app.set('views', __dirname + '/views');
// app.set('views', '../public');
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// app.use(express.static(path.join(__dirname, '/views')));
app.use(express.static('../public'));
// Configure our app
const router = require('./routes');
app.use(router);
const auth = require('./routes/auth');
app.use('/auth', auth);

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
