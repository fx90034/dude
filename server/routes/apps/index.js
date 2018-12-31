// ./routes/apps/index.js

const express = require('express');
const router = express.Router();
const debug = require('debug')('apps');
// const db = require('../../models/apps');
const appUtil = require('./util');
const appUsers = require('./users');
const deviceUtil = require('../devices/util')

router.get('/level1', function(req, res) {
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  debug('rooms = ' + rooms)
  debug('scenes = ' + scenes)
  appUtil.getLevel1(function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    var params = { user: user, data: data };
    if(rooms)
      params['rooms'] = rooms;
    if(scenes)
      params['scenes'] = scenes;
debug("params = " + JSON.stringify(params))
    res.render('apps/level1', params);
  });
});

router.get('/level2', function(req, res) {
  let user = null;
  let i = req.query.i;
  let level1 = req.query.level1;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  if(req.session.user)
    user = req.session.user;
debug("apps/level2!!")
debug('ip = ' + req.ip)
debug('i = ' + i)
debug('level1 = ' + level1)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
  appUtil.getLevel2(i, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    var params = { i: i, level1: level1, user: user.name, data: data };
    if(level1 === 'Rooms' & scenes) {
      params['rooms'] = '';
      params['scenes'] = scenes;
    }
    else if(level1 === 'Scenes' & rooms) {
      params['rooms'] = rooms;
      params['scenes'] = '';
    }
    else {
      params['rooms'] = '';
      params['scenes'] = '';
    }
debug("params = " + JSON.stringify(params))
    res.render('apps/level2', params);
  });
});

router.get('/level3', function(req, res) {
  let user = null;
  let i = req.query.i;
  let j = req.query.j;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  if(req.session.user)
    user = req.session.user;
debug("apps/level3!!")
debug('ip = ' + req.ip)
debug('i = ' + i)
debug('j = ' + j)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
  appUtil.getLevel3(i, j, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    var params = { i: i, j: j, level1: level1, level2: level2, user: user.name, data: data };
    if(level1 === 'Rooms') {
      params['rooms'] = level2;
      params['scenes'] = '';
    }
    else if(level1 === 'Scenes') {
      params['rooms'] = '';
      params['scenes'] = level2;
    }
    else {
      if(!rooms)
        params['rooms'] = '';
      if(!scenes)
        params['scenes'] = '';
    }
debug("params = " + JSON.stringify(params))
    res.render('apps/level3', params);
  });
});

router.get('/level4', function(req, res) {
  let user = null;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let level3 = req.query.level3;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  if(req.session.user)
    user = req.session.user.name;
debug("apps/level4!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('level3 = ' + level3)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
  if(level1 === 'Devices') {
    deviceUtil.getDevices(level2, level3, function(err, data) {
      if(err) {
        console.error(err);
        throw err;
  //      return res.render('error', { error: err });
      }
      else {
        if(data != null) {
  debug("data[0] = " + JSON.stringify(data[0]))
        }
      }
  debug("user = " + user)
      var params = { user: user, data: data }
      if(rooms) {
        params['rooms'] = rooms;
        params['scenes'] = '';
      }
      else if(scenes) {
        params['rooms'] = '';
        params['scenes'] = scenes;
      }
      else {
        params['rooms'] = '';
        params['scenes'] = '';
      }
debug("params = " + JSON.stringify(params))
      res.render('apps/list', params);
    });
  }
  else {
    deviceUtil.getDevieSubgroupByName(level3, function(err, data) {
      if(err) {
        console.error(err);
        throw err;
  //      return res.render('error', { error: err });
      }
      var params = { user: user, level1: 'Devices', level2: level3, data: data };
      if(rooms) {
        params['rooms'] = level2;
        params['scenes'] = '';
      }
      else if(scenes) {
        params['rooms'] = '';
        params['scenes'] = level2;
      }
      else {
        params['rooms'] = '';
        params['scenes'] = '';
      }
  debug("params = " + JSON.stringify(params))
  debug("data[0] = " + JSON.stringify(data[0]))
  debug("user = " + user)
      res.render('apps/level3', params);
    });
  }
});

router.post('/level5', function(req, res) {
  let user = null;
  let id = req.body.id;
  let rooms = req.body.rooms;
  let scenes = req.body.scenes;
  let doc = req.body.doc;
  if(req.session.user)
    user = req.session.user.name;
debug("apps/level5!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('id = ' + id)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('doc = ' + doc)
  appUsers.getDevice(user, id, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
      if(data != null) {
debug("data = " + JSON.stringify(data))
      }
      else {
        data = doc;
      }
    }
debug("user = " + user)
    var params = { user: user, data: JSON.parse(data) }
    if(rooms) {
      params['rooms'] = rooms;
      params['scenes'] = '';
    }
    if(scenes) {
      params['rooms'] = '';
      params['scenes'] = scenes;
    }
debug("params = " + JSON.stringify(params))
    res.render('apps/detail', params);
  });
});

router.post('/detail', function(req, res) {
  let user = null;
  let j = req.query.j;
  let k = req.query.k;
  let l = req.query.l;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let level3 = req.query.level3;
  if(req.session.user)
    user = req.session.user.name;
debug("apps/level4!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('level3 = ' + level3)
  db.devices.addUserDevice(obj, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.render(error, { message: 'Please try again.'});
    }
    else {
        res.redirect('apps/level4?i=' + i + '&j=' + j +'&k=' + k +
        '&level1='  + level1 + '&level2=' + level2 + '&level3=' + level3);
    }
  });
});

module.exports = router;
