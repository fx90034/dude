// ./routes/apps/index.js

const express = require('express');
const router = express.Router();
const debug = require('debug')('apps');
// const db = require('../../models/apps');
const appUtil = require('./util');
const appUsers = require('./users');
const deviceUtil = require('../devices/util')

router.get('/inspiring', function(req, res) {
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug('user = ' + username)
  var params = { user: username };
  req.session.redirect = '../../apps/inspiring';
  res.render('apps/inspiring', params);
});

router.get('/packages', function(req, res) {
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug('user = ' + username)
  appUtil.getPackages(function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0][0] = " + data[0][0])
    }
    var params = { user: username, data: data };
debug("params = " + JSON.stringify(params))
    req.session.redirect = '../../apps/packages';
    res.render('apps/packages', params);
  });
});

router.get('/package', function(req, res) {
  let package = req.query.package;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug('user = ' + username)
debug('package = ' + package)
  appUtil.getPackages(function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0][0] = " + data[0][0])
    }
    var line = [];
    for(var i=0; i<3; i++) {
      if(data[i][0] === package) {
        for(var j=0; j<3; j++) {
          line.push(data[i][j]);
        }
        break;
      }
    }
    var params = { user: username, data: line };
debug("params = " + JSON.stringify(params))
    req.session.redirect = '../apps/package?package=' + package;
    res.render('apps/package', params);
  });
});

router.get('/level1', function(req, res) {
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug('user = ' + username)
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
    var params = { user: username, data: data };
    if(rooms)
      params['rooms'] = rooms;
    if(scenes)
      params['scenes'] = scenes;
debug("params = " + JSON.stringify(params))
    req.session.redirect = '../apps/level1?rooms=' + rooms + '&scenes=' + scenes;
debug("req.session.redirect = " + req.session.redirect);
    res.render('apps/level1', params);
  });
});

router.get('/level2', function(req, res) {
  let i = req.query.i;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
  // else {
  //   res.render('auth/home', { message: "Please enable cookie and enter a valid username to get started." });
  //   return;
  // }
debug("apps/level2!!")
debug('ip = ' + req.ip)
debug('i = ' + i)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('req.session.user = ' + username)
// if(level1 == 'Devices') {
  appUtil.getLevel2(i, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
    var params = { i: i, level1: level1, user: username, data: data };
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
    req.session.redirect = '../apps/level2?rooms=' + rooms + '&scenes=' + scenes + '&level1=' + level1 + '&i=' + i;
    res.render('apps/level2', params);
  });
});

router.get('/level3', function(req, res) {
  let i = req.query.i;
  let j = req.query.j;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug("apps/level3!!")
debug('ip = ' + req.ip)
debug('i = ' + i)
debug('j = ' + j)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('user = ' + username)
if(level1 != 'Devices') {
  appUtil.getLevel3(i, j, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
    var params = { i: i, j: j, level1: level1, level2: level2, user: username, data: data };
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
    req.session.redirect = '../apps/level3?rooms=' + params['rooms'] + '&scenes=' + params['scenes'] + '&level1=' + level1 + '&i=' + i + '&level2=' + level2 + '&j=' + j;
    res.render('apps/level3', params);
  });
}
else {
    deviceUtil.getDeviceSubgroupByName(level2, function(err, data) {
      if(err) {
        console.error(err);
        throw err;
  //      return res.render('error', { error: err });
      }
      var params = { user: username, level1: level1, level2: level2, data: data };
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
      req.session.redirect = '../apps/level4?rooms=' + params['rooms']  + '&scenes=' + params['scenes'] + '&level1=' + level1 + '&level2=' + level2 + '&level3=' + data[0];
      res.render('apps/level3', params);
    });
}
});

router.get('/level4', function(req, res) {
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  let level3 = req.query.level3;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug("apps/level4!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
debug('level3 = ' + level3)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('user = ' + username)
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
      var params = { user: username, level2: level2, level3: level3, data: data }
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
    req.session.redirect = '../apps/level4?rooms=' + params['rooms'] + '&scenes=' + params['scenes'] + '&level1=' + level1 + '&level2=' + level2 + '&level3=' + level3;
      res.render('apps/list', params);
    });
  }
  else {
    deviceUtil.getDeviceSubgroupByName(level3, function(err, data) {
      if(err) {
        console.error(err);
        throw err;
  //      return res.render('error', { error: err });
      }
      var params = { user: username, level1: 'Devices', level2: level3, data: data };
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
      req.session.redirect = '../apps/level4?rooms=' + params['rooms']  + '&scenes=' + params['scenes'] + '&level1=Devices' + '&level2=' + level3 + '&level3=' + data[0];
      res.render('apps/level3', params);
    });
  }
});

router.get('/level5', function(req, res) {
  let id = req.query.id;
  let rooms = req.query.rooms;
  let scenes = req.query.scenes;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug("apps/level5!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('id = ' + id)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('user = ' + username)
  deviceUtil.getDeviceById(id, function(err, data) {
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
        data = '';
      }
    }
    var dataStr = '';
    if(data)
      dataStr = JSON.parse(JSON.stringify(data));
    var params = { user: username, data: dataStr }
    if(rooms) {
      params['rooms'] = rooms;
      params['scenes'] = '';
    }
    if(scenes) {
      params['rooms'] = '';
      params['scenes'] = scenes;
    }
debug("params = " + JSON.stringify(params))
      req.session.redirect = '../apps/level5?rooms=' + params['rooms']  + '&scenes=' + params['scenes'] + '&id=' + id + '&level2=' + dataStr.group + '&level3=' + dataStr.subgroup;
    res.render('apps/detail', params);
  });
});

router.post('/level5', function(req, res) {
  let id = req.body.id;
  let rooms = req.body.rooms;
  let scenes = req.body.scenes;
  let doc = req.body.doc;
  let user = req.session.user;
  let username = null;
  if(user)
    username = user.name;
debug("apps/level5!!!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('id = ' + id)
debug('rooms = ' + rooms)
debug('scenes = ' + scenes)
debug('doc = ' + doc)
debug('user = ' + username)
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
    var dataStr = '';
    if(data)
      dataStr = JSON.parse(data);
    var params = { user: username, data: dataStr }
    if(rooms) {
      params['rooms'] = rooms;
      params['scenes'] = '';
    }
    if(scenes) {
      params['rooms'] = '';
      params['scenes'] = scenes;
    }
debug("params = " + JSON.stringify(params))
      req.session.redirect = '../apps/level5?rooms=' + params['rooms']  + '&scenes=' + params['scenes'] + '&id=' + id + '&level2=' + dataStr.group + '&level3=' + dataStr.subgroup;
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
debug("apps/detail!!")
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

function redirectPost(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

// redirectPost('http://www.example.com', { text: 'text\n\ntext' });
module.exports = router;
