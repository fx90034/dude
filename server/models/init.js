// server/models/init.js

var nano = require('nano')('http://localhost:8825');

require('./users/init.js');
require('./why/init.js');
