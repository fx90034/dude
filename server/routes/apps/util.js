// ./routes/apps/util.js

const util = require('../util');
const debug = require('debug')('apps_util');
const appsFile = './conf/apps.json';

var menu = [];
var rooms = [];
var scenes = [];
var devices = [];
var appData = [[[]]];

exports.getLevel1 = function(callback) {
// debug("appData[i][j][0] = " + JSON.stringify(appData[0][0][0]))
// debug("menu = " + JSON.stringify(menu))
  if(menu.length == 0) {
    for(var i=0; i<appData.length; i++) {
      menu.push(appData[i][0][0]);
    }
  }
debug("menu = " + JSON.stringify(menu))
  return callback(null, menu);
}
exports.getLevel2 = function(i, callback) {
  var temp = [];
  if(appData[i][0][0] === 'Rooms') {
    if(rooms.length == 0) {
      for(var j=1; j<appData[i].length; j++) {
        rooms.push(appData[i][j][0]);
// debug("appData[i][j][0] = " + JSON.stringify(appData[i][j][0]))
      }
    }
    temp = rooms;
  }
  else if(appData[i][0][0] === 'Scenes') {
    if(scenes.length == 0) {
      for(var j=1; j<appData[i].length; j++) {
        scenes.push(appData[i][j][0]);
// debug("appData[i][j][0] = " + JSON.stringify(appData[i][j][0]))
      }
    }
    temp = scenes;
  }
  else if(appData[i][0][0] === 'Devices') {
    if(devices.length == 0) {
      for(var j=1; j<appData[i].length; j++) {
        devices.push(appData[i][j][0]);
// debug("appData[i][j][0] = " + JSON.stringify(appData[i][j][0]))
      }
    }
    temp = devices;
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
exports.loadApps = function(callback) {
debug("Loading Apps ...")
  util.readJSON(appsFile, function(err, data) {
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
          var level3Keys = Object.keys(level2); // "Lights", "Switch", "Lock", ...
debug("level3Keys = " + level3Keys)
          for(var k=1; k<=level2.length; k++) { // "Lights", "Switch", "Lock", ...
debug('k = ' + k)
            appData[i][j][k] = level2[k-1]; // "Light"
debug("appData[i][j][k] = " + JSON.stringify(appData[i][j][k]))
          }
        }
      }
    } catch(ex) {
      console.error(ex);
      return callback(ex, null);
    }
    return callback(null, null);
  });
}
