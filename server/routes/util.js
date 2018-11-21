// ./routes/util.js

const fs = require('fs');
const debug = require('debug')('http');

exports.readJSON = function(filePath, callback) {
  fs.readFile(filePath, function(err, data) {
    var parsedJson;
    if (err)
       return callback(err, null);
debug("data = " + data)
    try {
      parsedJson = JSON.parse(data);
    } catch (exception) {
      return callback(exception, null);
    }
    return callback(null, parsedJson);
  });
}
