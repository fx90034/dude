const express = require('express');
const router = express.Router();
const debug = require('debug')('why');
const db = require('../../models/why');
const util = require('./util');

router.get('/level1', function(req, res) {
  var question = '';
  var answers = [];
  util.getData(0, 0, 0, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
      question = data.question;
      answers = data.answers;
debug("question = " + question)
debug("answers = " + answers)
debug("answer = " + data.answers[0])
    }
    res.render('why/level1', { question: question, answers: answers });
  });
});

router.get('/level2', function(req, res) {
  let user = null;
  let j = req.query.j;
  let level1 = req.query.level1;
  if(req.session.user)
    user = req.session.user.name;
debug("why/level2!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('j = ' + j)
debug('level1 = ' + level1)
  db.level1.addLevel1(level1, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.send('Please try again.');
//      res.render('/error', { message: 'Please try again.'});
    }
    else {
      var question = '';
      var answers = [];
      util.getData(0, j, 0, function(err, data) {
        if(err) {
          console.error(err);
          throw err;
    //      return res.render('error', { error: err });
        }
        else {
          question = data.question;
          answers = data.answers;
debug("question = " + question)
debug("answers = " + answers)
        }
        res.render('why/level2', { j: j, level1: level1, question: question, answers: answers });
      });
    }
  });
});

router.get('/level3', function(req, res) {
  let user = null;
  let j = req.query.j;
  let k = req.query.k;
  let level1 = req.query.level1;
  let level2 = req.query.level2;
  if(req.session.user)
    user = req.session.user.name;
debug("why/level3!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('level1 = ' + level1)
debug('level2 = ' + level2)
  db.level2.addLevel2(level1, level2, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.render(error, { message: 'Please try again.'});
    }
    else {
      var answers = [];
      util.getData(0, j, k, function(err, data) {
        if(err) {
          console.error(err);
          throw err;
    //      return res.render('error', { error: err });
        }
        else {
          question = data.question;
          answers = data.answers;
debug("question = " + question)
debug("answers = " + answers)
        }
        res.render('why/level3', { j: j, k: k, level1: level1, level2: level2, question: question, answers: answers });
      });
    }
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
debug("why/level4!!")
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
