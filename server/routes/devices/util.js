// ./routes/devices/util.js

const util = require('../util');
const debug = require('debug')('devices_util');
const devicesFile = './conf/devices.json';
const db = require('../../models/devices');
const fs = require('fs');

var group = [];
var subgroup = [[]];

exports.getGroup = function(callback) {
  if(!group) {
    for(var i=0; i<subgroup.length; i++) {
      group.push(subgroup[i][0]);
    }
  }
debug("group = " + JSON.stringify(group))
  return callback(null, group);
}
exports.getSubgroup = function(i, callback) {
  var temp= [];
  for(var j=1; j<subgroup[i].length; j++) {
    temp.push(subgroup[i][j]);
// debug("subgroup[i][j][0] = " + JSON.stringify(subgroup[i][j][0]))
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.getDevieSubgroupByName = function(level3, callback) {
debug("level3 = " + level3 + "!")
  var temp = [];
  for(var i=0; i<group.length; i++) {
    if(group[i] == level3) {
      debug("group[i] = " + group[i] + "!")
      debug("subgroup[i].length = " + subgroup[i].length )
      for(var j=1; j<subgroup[i].length; j++) {
debug("subgroup[i][j] = " + subgroup[i][j] )
        temp.push(subgroup[i][j]);
      }
    }
  }
debug("temp = " + JSON.stringify(temp))
  return callback(null, temp);
}
exports.getDevices = function(group, subgroup, callback) {
debug("getDevices ...")
  db.queryBySubgroup(group, subgroup, function(err, rows) {
    if(err) {
      return callback(err, null);
    }
    return callback(null, rows);
  });
}
exports.loadDevices = function(callback) {
  db.getLatestDeviceTime(function(err, last) {
    if(last) {
      try {
        var stats = fs.statSync(devicesFile);
        var mtime = new Date(stats.mtime);
console.log('last_update_date = "' + last + '"');
console.log('lastModifiedDate = ' + JSON.stringify(stats.mtime));
        if(mtime.getTime() <= (new Date(last)).getTime())
          return callback(null, null);
      } catch(ex) {
        console.error(ex);
      }
    }
    util.readJSON(devicesFile, function(err, data) {
console.log("Loading Devices ...")
      if(err) {
        console.error(err);
        throw err;
      }
      try {
        var level0 = data;
        var level1;
        var level2;
        var level3;
        group = Object.keys(level0); // "Lights", "Switch", "Lock", ...
debug("group = " + group)
        for(var i=0; i<group.length; i++) {
          subgroup[i] = [];
          subgroup[i][0] = group[i];
debug("subgroup[i][0] = " + JSON.stringify(subgroup[i][0]))
          level1 = level0[group[i]];
          var level2Keys = Object.keys(level1); // "Dimmer", "Lamp", "Light Bulb",  ...
  debug("level2Keys = " + level2Keys)
          for(var j=1; j<=level2Keys.length; j++) {
  debug('j = ' + j)
             subgroup[i][j] = level2Keys[j-1]; // "Dimmer"
  debug("key = " + JSON.stringify(subgroup[i][j]))
            level2 = level1[subgroup[i][j]];
  // debug("level2 = " +  JSON.stringify(level2))
            for(var k=1; k<=level2.length; k++) {
  debug('k = ' + k)
              var deviceObj = level2[k-1];
              var keys = Object.keys(deviceObj);
  debug("keys = " + JSON.stringify(keys))
              var device = {};
              for(var l in keys) {
                device[keys[l]] = deviceObj[keys[l]];
              }
              device["group"] = group[i];
              device["subgroup"] = subgroup[i][j];
//              device["active"] = false;
              device["last_update_date"] = new Date(Date.now());
  debug("device = " + JSON.stringify(device))
              db.addDevice(device, function(err, data) {
                if(err) {
                  console.error(err);
                }
              });
            }
          }
        }
      } catch(ex) {
        console.error(ex);
        return callback(ex, null);
      }
      return callback(null, null);
    });
  });
}
