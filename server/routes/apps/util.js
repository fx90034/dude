// ./routes/apps/util.js

const util = require('../util');
const debug = require('debug')('apps_util');
const file = './conf/apps.json';

var rooms = [];
var scenes = [];
var devices = [];
var appData = [[[]]];

exports.getLevel1 = function(callback) {
debug(appData[0][0][0])
  if(!appData[0][0][0]) {
debug("Loading ...")
    load(function(err, data) {
      if(err) {
        console.error(err);
        return callback(err, null);
      }
debug("@@@@@@@@@@Loaded.")
debug("appData[0][0][0] = " + appData[0][0][0])
      var temp = [];
      for(var i=0; i<appData.length; i++) {
        temp.push(appData[i][0][0]);
      }
debug("temp = " + JSON.stringify(temp))
      return callback(null, temp);
    });
  }
  else {
    var temp = [];
    for(var i=0; i<appData.length; i++) {
      temp.push(appData[i][0][0]);
    }
debug("temp = " + JSON.stringify(temp))
    return callback(null, temp);
  }
debug("appData.length = " + appData.length)
}
exports.getLevel2 = function(i, callback) {
  var temp = [];
  for(var j=1; j<appData[i].length; j++) {
    temp.push(appData[i][j][0]);
// debug("appData[i][j][0] = " + JSON.stringify(appData[i][j][0]))
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.getLevel3 = function(i, j, callback) {
  var temp = [];
  for(var k=1; k<appData[i][j].length; k++) {
    temp.push(appData[i][j][k]);
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.getData = function(i, j, k, callback) {
debug(appData[0][0][0])
  if(!appData[0][0][0]) {
debug("Loading ...")
    load(function(err, data) {
      if(err) {
        console.error(err);
        return callback(err, null);
      }
debug("@@@@@@@@@@Loaded.")
debug("appData[0][0][0] = " + appData[0][0][0])
      var data = { appData: appData[i][j][k] };
debug("data = " + JSON.stringify(data))
      return callback(null, data);
    });
  }
  else {
debug("i=" + i)
debug("j=" + j)
debug("k=" + k)
    var data = { appData: appData[i][j][k] };
debug("data = " + JSON.stringify(data))
    return callback(null, data);
  }
}
function load(callback) {
  util.readJSON(file, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
    }
    try {
      var level0 = data;
      var level1;
      var level2;
      var level3;
      var level1Keys = Object.keys(level0);
 debug("!level1Keys = " + level1Keys)
      for(var i=0; i<level1Keys.length; i++) { // "Rooms", "Scenes", "Devices"
        appData[i] = [];
        appData[i][0] = [];
        appData[i][0][0] = level1Keys[i];
 debug("appData[i][0][0] = " + JSON.stringify(appData[i][0][0]))
        level1 = level0[level1Keys[i]];
        var level2Keys = Object.keys(level1); // "Entry", "Kitchen", "Bathroom", "Bedroom", ...
debug("level2Keys = " + level2Keys)
        for(var j=1; j<=level2Keys.length; j++) {
debug('j = ' + j)
          appData[i][j] = [];
          appData[i][j][0] = level2Keys[j-1]; // "Entry"
debug("appData[i][j][0] = " + JSON.stringify(appData[i][j][0]))
          level2 = level1[level2Keys[j-1]];
debug("level2 = " +  JSON.stringify(level2))
          var level3Keys = Object.keys(level2); // "Light", "Switch", "Lock", ...
debug("level3Keys = " + level3Keys)
          for(var k=1; k<=level2.length; k++) { // "Light", "Switch", "Lock", ...
debug('k = ' + k)
            appData[i][j][k] = level2[k-1]; // "Light"
debug("appData[i][j][k] = " + JSON.stringify(appData[i][j][k]))
          }
        }
      }
    } catch(ex) {
      console.error(ex);
    }
    return callback(null, null);
  });
}
