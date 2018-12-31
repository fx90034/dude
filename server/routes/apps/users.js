// ./routes/apps/user.js

const debug = require('debug')('apps_users');
const db = require('../../models/apps');

exports.getDevice = function(user, id, callback) {
debug("getDevice ...")
  db.queryUserDevice(user, id, function(err, data) {
    if(err) {
      return callback(err, null);
    }
    return callback(null, data);
  });
}
