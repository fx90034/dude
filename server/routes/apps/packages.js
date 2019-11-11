// ./routes/apps/packages.js

const util = require('../util');
const debug = require('debug')('apps_packages');
const packagesFile = './conf/packages.json';

var names = [];
var packages = [[]];
var packagesData = [[[]]];
var lines = ["rose|Morning Mode|Rose package can meet your basic needs with a lowest budget.",
             "gold|Video Doorbell|Gold package is most economical with rich featurs.",
             "platinum|Whole House|Platinum package comes with all luxury devices communicated with each other."];

exports.getPackages = function(callback) {
  for(var i=0; i<3; i++) {
debug(lines[i])
    packages[i] = [];
    var elements = lines[i].split("|");
    for(var j=0; j<3; j++) {
debug(elements[j])
      packages[i].push(elements[j]);
    }
  }
    return callback(null, packages);
}
exports.getNames = function(callback) {
debug("packagesData[i][j][0] = " + JSON.stringify(packagesData[0][0][0]))
debug("names = " + JSON.stringify(names))
  if(names.length == 0) {
    for(var i=0; i<packagesData.length; i++) {
      names.push(packagesData[i][0][0]);
    }
  }
debug("names = " + JSON.stringify(names))
  return callback(null, names);
}
exports.getTypes = function(name, callback) {
  var temp = [];
debug("packagesData[i][0][0] = " + packagesData[i][0][0])
  for(var i=0; i<names.length; i++) {
    if(packagesData[i][0][0] === name) {
      for(var j=1; j<packagesData[i].length; j++) {
        temp.push(packagesData[i][j][0]);
debug("packagesData[i][j][0] = " + JSON.stringify(packagesData[i][j][0]))
      }
    }
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.getPackageList = function(name, callback) {
  var temp = [];
  for(var i=0; i<names.length; i++) {
    if(names[i] != name)
      continue;
    var types = getTypes(name)
    for(var j=1; j<=packagesData[i].length; j++) {
      for(var k=1; k<=packagesData[i][j].length; k++) {
        temp.push(packagesData[i][j][k]);
      }
    }
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.loadPackages = function(callback) {
debug("Loading Packages ...")
  util.readJSON(packagesFile, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
    }
    try {
      var level0 = data;
      var level1;
      var level2;
      var packageKeys = Object.keys(level0);
 debug("!packageKeys = " + packageKeys)
      for(var i=0; i<packageKeys.length; i++) { // "Rose", "Gold", "Platinum"
        packagesData[i] = [];
        packagesData[i][0] = [];
        packagesData[i][0][0] = packageKeys[i];
 debug("packagesData[i][0][0] = " + JSON.stringify(packagesData[i][0][0]))
        level1 = level0[packageKeys[i]];
        var typeKeys = Object.keys(level1); // "Dimmer", "Light", "Shade", "Curtain", ...
debug("typeKeys = " + typeKeys)
        for(var j=1; j<=typeKeys.length; j++) {
debug('j = ' + j)
          packagesData[i][j] = [];
          packagesData[i][j][0] = typeKeys[j-1]; // "Dimmer"
debug("packagesData[i][j][0] = " + JSON.stringify(packagesData[i][j][0]))
          level2 = level1[typeKeys[j-1]];
debug("level2 = " +  JSON.stringify(level2))
debug("level2.length = " + level2.length)
          if(level2 == undefined)
            packagesData[i][j][1] = level2;
          else {
            for(var k=1; k<=level2.length; k++) { // "Lights", "Switch", "Lock", ...
debug('k = ' + k)
              packagesData[i][j][k] = level2[k-1]; // "Light"
debug("packagesData[i][j][k] = " + JSON.stringify(packagesData[i][j][k]))
            }
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
