// ./routes/why/util.js

const util = require('../util');
const debug = require('debug')('http');
const file = './conf/why.json';

var why = null;
var concerns = [];
var costs = [];

exports.getConcerns = function(callback) {
debug("concerns.length = " + concerns.length)
  if(concerns.length != 0)
    return callback(null, concerns);
  util.readJSON(file, function(err, data) {
    if(err) {
      console.error(err);
      return callback(err, null);
    }
    why = JSON.parse(JSON.stringify(data));
    try {
      for(var concern in why.concern)
        concerns.push(concern);
  debug("$$$$$$$$$$$" + concerns[0])
      callback(null, concerns);
    } catch(ex) {
      callback(ex, null);
    }
  });
}
