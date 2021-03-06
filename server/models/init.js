// server/models/init.js

const env = process.env.NODE_ENV || 'dev'
const config = require('../conf/config.' + env);
const nano = require('nano')('http://' + config.cloud.credential + 'localhost:' + config.db.port);

require('./users/init.js');
require('./why/init.js');
require('./devices/init.js');
require('./apps/init.js');
