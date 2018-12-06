// server/route/basicAuth.js

const basicAuth = require('basic-auth');

exports.basicAuth({ users: { 'admin': 'supersecret'}});
