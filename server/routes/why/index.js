const express = require('express');
const router = express.Router();
const debug = require('debug')('http');
const db = require('../../models/why');
const util = require('./util');

router.get('/main', function(req, res) {
  var question = '';
  var answers = [];
  var level0;
  util.getData(0, 0, 0, function(err, data) {
    if(err) {
      console.error(err);
      throw err;
//      return res.render('error', { error: err });
    }
    else {
      question = data.question;
      answers = data.answer;
debug("question = " + question)
debug("answers = " + answers)
debug("answer = " + data.answer[0])
    }
  });
  res.render('why/main', { question: question, answers: answers });
});

router.get('/concern', function(req, res) {
  let user = null;
  let concern = req.query.concern;
  if(req.session.user)
    user = req.session.user.name;
debug("why/concern!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('concern = ' + concern)
  db.concern.addConcern(concern, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.render('why/concern', { message: 'Please try again.'});
    }
    switch(concern) {
      case 'Overall cost':
          res.render('why/cost', { concern: concern });
          break;
      case 'Devices compatibility':
          res.render('why/compatible', { concern: concern });
          break;
      case 'Ease of use':
          res.render('why/setup', { concern: concern });
          break;
      case 'Privacy':
          res.render('why/privacy', { concern: concern });
          break;
      default:
          break;
    }
  });
});

router.get('/cost', function(req, res) {
  let user = null;
  let cost = req.query.cost;
  let concern = req.query.concern;
  if(req.session.user)
    user = req.session.user.name;
debug("why/cost!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('cost = ' + cost)
debug('concern = ' + concern)
  db.cost.addCost(concern, cost, req.ip, user, function(err, body) {
    if(err) {
      console.error(err);
      res.render('why/cost?concern='+concern, { message: 'Please try again.'});
    }
    switch(cost) {
      case 'Wired network connectivity':
          res.render('why/wired?concern=' + concern + '&cost=' + cost);
          break;
      case 'Custom designed smart home':
          res.render('why/custom?concern=' + concern + '&cost=' + cost);
          break;
      case 'Standalone smart devices and sensors':
          res.render('why/setup?standalone=' + concern + '&cost=' + cost);
          break;
      case 'Dedicated smart hub or bridge':
          res.render('why/dedicated?concern=' + concern + '&cost=' + cost);
          break;
      default:
          break;
    }
  });
});

module.exports = router;
