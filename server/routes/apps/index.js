// ./routes/apps/index.js

const express = require('express');
const router = express.Router();
const debug = require('debug')('apps');
// const db = require('../../models/apps');
const util = require('./util');

router.get('/level1', function(req, res) {
  util.getData(0, 0, 0, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    res.render('apps/level1', { user: user, data: data });
  });
});

router.get('/level2', function(req, res) {
  let user = null;
  let i = req.query.i;
  let level1 = req.query.level1;
  if(req.session.user)
    user = req.session.user;
debug("apps/level2!!")
debug('ip = ' + req.ip)
debug('i = ' + i)
debug('level1 = ' + level1)
  util.getLevel2(i, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    res.render('apps/level2', { i: i, level1: level1, user: user, data: data });
  });
});

router.get('/level3', function(req, res) {
  let user = null;
  let i = req.query.i;
  let j = req.query.j;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  if(req.session.user)
    user = req.session.user;
debug("apps/level3!!")
debug('ip = ' + req.ip)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
  var answers = [];
  util.getLevel3(0, j, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
debug("data[0] = " + data[0])
    }
debug("user.name = " + user.name)
    res.render('apps/level3', { i: i, j: j, level1: level1, level2: level2, user: user, data: data });
  });
});

router.get('/level4', function(req, res) {
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
  db.level3.addLevel3(level1, level2, level3, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.render(error, { message: 'Please try again.'});
    }
    else {
        res.redirect(level3);
    }
  });
});

module.exports = router;
