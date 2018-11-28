// server/models/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../conf/config.' + env);
const nano = require('nano')('http://localhost:' + config.db.port);

require('./users/init.js');
require('./why/init.js');
